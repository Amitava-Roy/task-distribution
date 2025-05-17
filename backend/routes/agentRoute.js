const express = require("express");
const agentController = require("../controllers/agentController");
const authController = require("../controllers/authController");
const router = express.Router();

router.post("/", authController.protect, agentController.createAgent);
router.get("/", authController.protect, agentController.getAllAgents);

module.exports = router;
