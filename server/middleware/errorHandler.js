const { responseUtil } = require('../utils');

/**
 * Global error handling middleware
 * Catches and formats all unhandled errors
 */
const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Error:', err);
  
  // Handle different types of errors
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return responseUtil.error(res, 400, 'Validation error', { details: errors });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return responseUtil.error(res, 400, `Duplicate value for ${field}`, err);
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return responseUtil.error(res, 401, 'Invalid token', err);
  }
  
  if (err.name === 'TokenExpiredError') {
    return responseUtil.error(res, 401, 'Token expired', err);
  }
  
  // Default to 500 server error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server error';
  
  return responseUtil.error(res, statusCode, message, err);
};

module.exports = errorHandler;