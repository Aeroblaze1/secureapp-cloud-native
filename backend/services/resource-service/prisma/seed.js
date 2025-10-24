// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin', description: 'Administrator role' }
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: { name: 'user', description: 'Regular user' }
  });

  // example permissions
  const p1 = await prisma.permission.upsert({
    where: { resource_action: { resource: 'users', action: 'read' } },
    update: {},
    create: { resource: 'users', action: 'read', description: 'Read users' }
  }).catch(()=>{}); // ignore if unique constraint name differs

  // simpler: create some permissions and link them to roles
  const perm = await prisma.permission.createMany({
    data: [
      { resource: 'users', action: 'read', description: 'Read users' },
      { resource: 'users', action: 'delete', description: 'Delete users' },
      { resource: 'resources', action: 'read', description: 'Read resources' }
    ],
    skipDuplicates: true
  });

  // link admin -> all existing permissions
  const allPerms = await prisma.permission.findMany();
  for (const p of allPerms) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: adminRole.id, permissionId: p.id } },
      update: {},
      create: { roleId: adminRole.id, permissionId: p.id }
    }).catch(()=>{});
  }

  // create admin user
  const passwordHash = await bcrypt.hash('Admin@1234', 10);
  await prisma.user.upsert({
    where: { email: 'admin@secureapp.test' },
    update: { passwordHash, roleId: adminRole.id },
    create: {
      email: 'admin@secureapp.test',
      passwordHash,
      roleId: adminRole.id
    }
  });

  console.log('Seeded initial data');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
