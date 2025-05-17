const Task = require("../models/taskModel");
const asyncHandler = require("../utils/createAsync");
const ResponseDto = require("../utils/ResponseDto");
const AppError = require("../utils/AppError");
const xlsx = require("xlsx");
const path = require("path"); // Added to help with file extension
const Agent = require("../models/agentModel"); // Assuming you have an Agent model

exports.getTask = asyncHandler(async (req, res, next) => {
  const tasks = await Task.find().populate("agentId");

  res
    .status(200)
    .json(new ResponseDto("Task fetched successfully", 1, { tasks }));
});

exports.uploadTask = asyncHandler(async (req, res, next) => {
  // Check if a file was uploaded
  if (!req.file) {
    return next(new AppError("No file found.", 0, 400));
  }

  let workbook;
  const fileExtension = path.extname(req.file.originalname).toLowerCase();

  // Read the workbook from the buffer based on file type
  if (fileExtension === ".csv") {
    // For CSV files, convert buffer to string and then parse
    const csvData = req.file.buffer.toString("utf8");
    workbook = xlsx.read(csvData, { type: "string" });
  } else if (fileExtension === ".xlsx" || fileExtension === ".xls") {
    // For Excel files, parse directly from buffer
    workbook = xlsx.read(req.file.buffer, { type: "buffer" });
  } else {
    return next(
      new AppError(
        "Unsupported file type. Please upload an Excel (.xlsx, .xls) or CSV (.csv) file.",
        0,
        400
      )
    );
  }

  // Get the first sheet from the workbook
  // For CSV, there's typically only one sheet, and for Excel, we're using the first one.
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    return next(
      new AppError("Could not find any sheets in the uploaded file.", 0, 400)
    );
  }
  const worksheet = workbook.Sheets[firstSheetName];

  // Convert the sheet data to JSON
  const data = xlsx.utils.sheet_to_json(worksheet);

  if (data.length === 0) {
    return next(
      new AppError(
        "The uploaded file is empty or could not be parsed correctly.",
        0,
        400
      )
    );
  }

  // Fetch all agents from the database
  const agents = await Agent.find();
  if (agents.length === 0) {
    return next(
      new AppError(
        "No agents found in the database. Please add agents first.",
        0,
        400
      )
    );
  }

  // Initialize an array to hold tasks distributed to each agent
  const distributedTasksByAgent = Array.from(
    { length: agents.length },
    () => []
  );

  // Distribute tasks among agents in a round-robin fashion
  data.forEach((item, index) => {
    const agentIndex = index % agents.length;
    distributedTasksByAgent[agentIndex].push(item);
  });

  // Process and save tasks for each agent
  for (let i = 0; i < agents.length; i++) {
    if (distributedTasksByAgent[i].length > 0) {
      const tasksForAgent = distributedTasksByAgent[i].map((taskData) => ({
        agentId: agents[i]._id, // Assign the agent's ID
        // Ensure these field names match the headers in your Excel/CSV files
        firstName:
          taskData.FirstName || taskData.firstName || taskData["First Name"],
        phone: taskData.Phone || taskData.phone,
        notes: taskData.Notes || taskData.notes,
      }));

      // Insert the tasks into the database
      // Make sure your Task model is set up to handle these fields
      await Task.insertMany(tasksForAgent);
    }
  }

  // Send a success response
  res
    .status(200)
    .json(
      new ResponseDto(
        `Tasks from ${req.file.originalname} distributed and saved successfully.`,
        1,
        null
      )
    );

  if (err.name === "SheetJSUnsupportedFile") {
    return next(new AppError("Unsupported file type.", 0, 500));
  }
  return next(new AppError("Server error during file processing.", 0, 400));
});
