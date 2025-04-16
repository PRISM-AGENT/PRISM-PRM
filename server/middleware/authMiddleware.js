/**
 * Authentication Middleware
 * Verifies JWT tokens and adds user ID to request
 */

const jwt = require('jsonwebtoken');
const { responseUtil } = require('../utils');

/**
 * Protect routes by verifying JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const protect = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return responseUtil.error(res, 401, 'Not authorized, no token');
    }
    
    // Extract token from header
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'prism_secret_key');
    
    // Add user ID to request
    req.userId = decoded.id;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return responseUtil.error(res, 401, 'Invalid token');
    }
    
    if (error.name === 'TokenExpiredError') {
      return responseUtil.error(res, 401, 'Token expired');
    }
    
    return responseUtil.error(res, 401, 'Not authorized');
  }
};

/**
 * Restrict routes to specific roles
 * @param {...String} roles - Allowed roles
 * @returns {Function} Middleware function
 */
const restrictTo = (...roles) => {
  return async (req, res, next) => {
    try {
      // User ID should be set by protect middleware
      if (!req.userId) {
        return responseUtil.error(res, 401, 'Not authorized');
      }
      
      // Get user from database
      const { User } = require('../models');
      const user = await User.findById(req.userId);
      
      if (!user) {
        return responseUtil.error(res, 404, 'User not found');
      }
      
      // Check if user role is in allowed roles
      if (!roles.includes(user.role)) {
        return responseUtil.error(res, 403, 'Not authorized for this action');
      }
      
      next();
    } catch (error) {
      console.error('Restrict middleware error:', error);
      return responseUtil.error(res, 500, 'Server error');
    }
  };
};

module.exports = {
  protect,
  restrictTo
}; 