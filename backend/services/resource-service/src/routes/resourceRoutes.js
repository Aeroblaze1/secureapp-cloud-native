const express = require("express");
const router = express.Router();
const {
  createResource,
  getMyResources,
  getAllResources,
} = require("../controllers/resourceController");
const { verifyToken, adminOnly } = require("../middleware/authMiddleware");
router.post("/", verifyToken, createResource); // Create new resource

router.get("/me", verifyToken, getMyResources); // own resources
router.get("/all", verifyToken, adminOnly, getAllResources); // admin sees all

module.exports = router;
