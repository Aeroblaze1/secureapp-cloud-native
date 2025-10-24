const express = require("express");
const router = express.Router();

// Import based on your exports
const validateInput = require("../middleware/validateInput"); // default export
const { adminOnly } = require("../middleware/adminOnly"); // named export
const checkBlacklist = require("../middleware/checkBlacklist");
const {
  register,
  login,
  deleteUser,
  logout,
} = require("../controllers/authController");

// Public routes
router.post("/register", validateInput, register);
router.post("/login", validateInput, login);
router.post("/logout", checkBlacklist, logout); // logout

// Admin-only route
router.delete("/delete", checkBlacklist, adminOnly, deleteUser);

module.exports = router;
