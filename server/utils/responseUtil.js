/**
 * Response Utility
 * Standardized API response formats
 */

/**
 * Create a success response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {*} data - Response data
 * @returns {Object} Response object
 */
const success = (res, statusCode = 200, message = 'Success', data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Create an error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {*} errors - Additional error details
 * @returns {Object} Response object
 */
const error = (res, statusCode = 500, message = 'Server Error', errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

/**
 * Create a validation error response
 * @param {Object} res - Express response object
 * @param {Array|Object} errors - Validation errors
 * @returns {Object} Response object
 */
const validationError = (res, errors) => {
  return error(res, 422, 'Validation Error', errors);
};

/**
 * Create an unauthorized error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} Response object
 */
const unauthorized = (res, message = 'Unauthorized') => {
  return error(res, 401, message);
};

/**
 * Create a not found error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} Response object
 */
const notFound = (res, message = 'Resource not found') => {
  return error(res, 404, message);
};

/**
 * Create a forbidden error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} Response object
 */
const forbidden = (res, message = 'Forbidden') => {
  return error(res, 403, message);
};

module.exports = {
  success,
  error,
  validationError,
  unauthorized,
  notFound,
  forbidden
};