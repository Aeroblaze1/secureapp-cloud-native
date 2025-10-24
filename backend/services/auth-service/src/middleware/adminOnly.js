const prisma = require("../config/db");
const jwt = require("jsonwebtoken");

const { JWT_SECRET = "dev-secret" } = process.env;

exports.adminOnly = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ error: "Missing Authorization header" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Missing token" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      include: { role: true },
    });

    if (!user) return res.status(401).json({ error: "User not found" });
    if (user.role.name !== "admin")
      return res.status(403).json({ error: "Admin only" });

    req.user = user; // attach user info for downstream use
    next();
  } catch (err) {
    next(err);
  }
};
