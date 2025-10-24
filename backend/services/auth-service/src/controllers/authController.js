const prisma = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET = "dev-secret", JWT_EXPIRY = "24h" } = process.env;

function signJwt(payload) {
  // include a jti (JWT ID) for revocation management
  const jti = require("crypto").randomBytes(16).toString("hex");
  return jwt.sign({ ...payload, jti }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

exports.register = async (req, res, next) => {
  try {
    const { email, password, role = "user" } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "email & password required" });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: "User already exists" });

    const roleObj = await prisma.role.findUnique({ where: { name: role } });
    if (!roleObj) return res.status(400).json({ error: "Invalid role" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash, roleId: roleObj.id },
    });

    const token = signJwt({
      sub: user.id,
      email: user.email,
      role: roleObj.name,
    });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signJwt({
      sub: user.id,
      email: user.email,
      role: user.role.name,
    });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    await prisma.user.delete({ where: { email } });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ error: "Missing Authorization header" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Missing token" });

    const decoded = jwt.verify(token, JWT_SECRET);

    // Add token to blacklist
    await prisma.tokenBlacklist.create({
      data: {
        jti: decoded.jti,
        expiresAt: new Date(decoded.exp * 1000), // JWT exp in seconds, convert to ms
        reason: "User logout",
      },
    });

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};
