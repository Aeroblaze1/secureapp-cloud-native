const express = require("express");
const router = express.Router();
const { listAllResources, deleteResource } = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const rbac = require("../middleware/rbac");

router.use(authMiddleware, rbac(["admin"]));

router.get("/", listAllResources);
router.delete("/:id", deleteResource);

module.exports = router;
