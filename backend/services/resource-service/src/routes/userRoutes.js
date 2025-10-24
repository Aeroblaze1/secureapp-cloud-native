const express = require("express");
const router = express.Router();
const { listResources, createResource } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/", listResources);
router.post("/", createResource);

module.exports = router;
