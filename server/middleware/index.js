/**
 * Middleware Index
 * Exports all middleware modules
 */

const authMiddleware = require('./authMiddleware');
const validationMiddleware = require('./validationMiddleware');
const errorMiddleware = require('./errorMiddleware');

module.exports = {
  auth: authMiddleware,
  validation: validationMiddleware,
  error: errorMiddleware
}; 