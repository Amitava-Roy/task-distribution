const APIFeatures = require("./ApiFeatures");
const ResponseDto = require("./ResponseDto");
const asyncHandler = require("./createAsync");

const AppError = require("./AppError");

exports.getAllDoc = (Model) =>
  asyncHandler(async (req, res, next) => {
    const apiFeature = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docCount = await Model.countDocuments();
    const limit = parseInt(req.query.limit, 10) || 0;
    const noOfPages = Math.ceil(docCount / (limit || docCount));

    const docs = await apiFeature.query;
    console.log("docs");

    res.status(200).json(new ResponseDto("Success", 1, { docs, noOfPages }));
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    console.log(req.params.tourId);
    const doc = await Model.findByIdAndUpdate(req.params.tourId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json(new ResponseDto("Success", 1, doc));
  });
