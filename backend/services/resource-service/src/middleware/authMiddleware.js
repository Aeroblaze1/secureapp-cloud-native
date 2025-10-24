const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { JWT_SECRET = "dev-secret" } = process.env;

exports.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing Authorization header" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // so req.user.sub is userId
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

exports.adminOnly = async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.sub },
    include: { role: true },
  });
  if (!user || user.role.name !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  next();
};
