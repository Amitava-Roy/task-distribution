// Import necessary modules
const express = require("express");
const multer = require("multer");

const taskController = require("../controllers/taskController"); // Assuming you have a Task model

// Create an Express router
const router = express.Router();

// Configure multer to store files in memory
// This makes the file available as a buffer in req.file.buffer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define the POST route for file upload
router.post("/upload", upload.single("file"), taskController.uploadTask);

router.get("/", taskController.getTask);
// Export the router
module.exports = router;
