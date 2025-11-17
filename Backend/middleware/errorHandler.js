const ApiError = require("../utils/ApiError.js");

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle specific Mongoose errors
  if (err.name === "CastError") {
    message = `Resource not found. Invalid: ${err.path}`;
    statusCode = 404; 
  }
  if (err.code === 11000) {
    message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    statusCode = 400;
  }

  // Send the final, formatted error response
  res.status(statusCode).json({
    success: false,
    message: message,
    errors: err.errors || [],
  });
};

module.exports = errorHandler;