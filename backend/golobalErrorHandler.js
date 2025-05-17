const AppError = require("./utils/AppError");

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400, 0);
};

module.exports = (err, req, res, next) => {
  console.log(err);
  if (err.name == "ValidationError") err = handleValidationErrorDB(err);

  err.message = err.message || "Something went wrong";
  err.status = err.status || 500;
  err.responseCode = err.responseCode || 0;

  res.status(err.status).json({
    message: err.message,
    responseCode: err.responseCode,
    body: null,
  });
};
