const prisma = require("../config/db");
const jwt = require("jsonwebtoken");

const { JWT_SECRET = "dev-secret" } = process.env;

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing Authorization header" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Missing token" });

    const decoded = jwt.verify(token, JWT_SECRET);

    const blacklisted = await prisma.tokenBlacklist.findUnique({
      where: { jti: decoded.jti }
    });

    if (blacklisted) return res.status(401).json({ error: "Token revoked" });

    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
};
