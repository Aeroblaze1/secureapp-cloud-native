const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
module.exports = prisma;

/*This reuses the same database as Auth-Service.

No need to create another prisma/schema.prisma—you already have User, Role, etc.*/
