/**
 * Input validation middleware
 * Provides validation functions for route handlers
 */

const { responseUtil } = require('../utils');

/**
 * Validates that required fields are present in the request body
 * @param {Array} requiredFields - Array of field names that are required
 * @returns {Function} Express middleware
 */
const validateRequiredFields = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = [];
    
    requiredFields.forEach(field => {
      if (req.body[field] === undefined) {
        missingFields.push(field);
      }
    });
    
    if (missingFields.length > 0) {
      return responseUtil.error(
        res, 
        400, 
        'Missing required fields', 
        { missingFields }
      );
    }
    
    next();
  };
};

/**
 * Validates email format
 * @returns {Function} Express middleware
 */
const validateEmail = () => {
  return (req, res, next) => {
    const { email } = req.body;
    
    if (!email) {
      return next();
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return responseUtil.error(
        res, 
        400, 
        'Invalid email format'
      );
    }
    
    next();
  };
};

/**
 * Validates password format
 * @param {Object} options - Validation options
 * @param {number} options.minLength - Minimum password length (default: 8)
 * @param {boolean} options.requireUppercase - Require uppercase letter (default: true)
 * @param {boolean} options.requireLowercase - Require lowercase letter (default: true)
 * @param {boolean} options.requireNumber - Require number (default: true)
 * @param {boolean} options.requireSpecial - Require special character (default: false)
 * @returns {Function} Express middleware
 */
const validatePassword = (options = {}) => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumber = true,
    requireSpecial = false
  } = options;
  
  return (req, res, next) => {
    const { password } = req.body;
    
    if (!password) {
      return next();
    }
    
    const errors = [];
    
    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long`);
    }
    
    if (requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (requireNumber && !/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    if (errors.length > 0) {
      return responseUtil.error(
        res, 
        400, 
        'Invalid password format',
        { errors }
      );
    }
    
    next();
  };
};

/**
 * Validates wallet address format
 * @returns {Function} Express middleware
 */
const validateWalletAddress = () => {
  return (req, res, next) => {
    const { walletAddress } = req.body;
    
    if (!walletAddress) {
      return next();
    }
    
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!addressRegex.test(walletAddress)) {
      return responseUtil.error(
        res, 
        400, 
        'Invalid Ethereum wallet address format'
      );
    }
    
    next();
  };
};

module.exports = {
  validateRequiredFields,
  validateEmail,
  validatePassword,
  validateWalletAddress
}; 