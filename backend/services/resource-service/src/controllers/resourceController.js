const prisma = require("../config/db");

// User sees own resources
exports.getMyResources = async (req, res, next) => {
  try {
    const resources = await prisma.resource.findMany({
      where: { ownerId: req.user.id },
    });
    res.json(resources);
  } catch (err) {
    next(err);
  }
};

exports.createResource = async (req, res, next) => {
  try {
    const { name, type } = req.body;

    console.log("Decoded user:", req.user); // 👀 debug line

    const resource = await prisma.resource.create({
      data: {
        name,
        type,
        ownerId: req.user.sub, // assuming verifyToken sets req.user
      },
    });
    res.json(resource);
  } catch (err) {
    console.error("Error creating resource:", err); // 👀 log it
    next(err);
  }
};

// Admin sees all resources
exports.getAllResources = async (req, res, next) => {
  try {
    const resources = await prisma.resource.findMany({
      include: { owner: true },
    });
    res.json(resources);
  } catch (err) {
    next(err);
  }
};
