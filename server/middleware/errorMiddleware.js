/**
 * Error Handling Middleware
 * Centralizes error handling for the application
 */

const { responseUtil } = require('../utils');

/**
 * Handle not found routes (404)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Custom error handler
 * @param {Object} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  // Set status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Log error in development environment
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
  }
  
  // Check for specific error types
  if (err.name === 'ValidationError') {
    // MongoDB validation error
    return responseUtil.error(
      res,
      400,
      'Validation Error',
      formatValidationError(err)
    );
  }
  
  if (err.name === 'MongoServerError' && err.code === 11000) {
    // MongoDB duplicate key error
    return responseUtil.error(
      res,
      400,
      'Duplicate entry error',
      formatDuplicateKeyError(err)
    );
  }
  
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    // MongoDB invalid ID error
    return responseUtil.error(
      res,
      400,
      'Invalid ID format'
    );
  }
  
  // Generic error response
  return responseUtil.error(
    res,
    statusCode,
    err.message || 'Server Error',
    process.env.NODE_ENV === 'production' ? null : err.stack
  );
};

/**
 * Format MongoDB validation error
 * @param {Object} err - MongoDB validation error
 * @returns {Object} Formatted error object
 */
const formatValidationError = (err) => {
  const errors = {};
  
  Object.keys(err.errors).forEach(key => {
    errors[key] = err.errors[key].message;
  });
  
  return errors;
};

/**
 * Format MongoDB duplicate key error
 * @param {Object} err - MongoDB duplicate key error
 * @returns {Object} Formatted error object
 */
const formatDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return {
    field,
    message: `${field} already exists`
  };
};

module.exports = {
  notFound,
  errorHandler
}; 