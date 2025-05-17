const ResponseDto = require("../utils/ResponseDto");
const asyncHandler = require("../utils/createAsync");
const AppError = require("../utils/AppError");
const Agent = require("../models/agentModel");

exports.createAgent = asyncHandler(async (req, res, next) => {
  const agentData = await Agent.create(req.body);

  if (!agentData) return next(new AppError("Could not save user", 500, 0));

  res
    .status(200)
    .json(new ResponseDto("Agent created sucessfully.", 1, { agentData }));
});

exports.getAllAgents = asyncHandler(async (req, res, next) => {
  const agentData = await Agent.find();
  if (!agentData) return next(new AppError("Could not find any agent."));

  res
    .status(200)
    .json(new ResponseDto("Agent fetched successfully", 1, { agentData }));
});
