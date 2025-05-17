class AppError extends Error {
  constructor(message, status, responseCode) {
    super();
    this.message = message;
    this.status = status;
    this.responseCode = responseCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
