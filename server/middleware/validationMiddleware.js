/**
 * Validation Middleware
 * Validates request data before processing
 */

const { responseUtil } = require('../utils');

/**
 * Validate required fields in request body
 * @param {Array} fields - Array of field names to validate
 * @returns {Function} Middleware function
 */
const validateRequiredFields = (fields) => {
  return (req, res, next) => {
    const missingFields = fields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return responseUtil.error(
        res, 
        400, 
        `Missing required fields: ${missingFields.join(', ')}`
      );
    }
    
    next();
  };
};

/**
 * Validate email format
 * @param {string} fieldName - Name of the field to validate (default: 'email')
 * @returns {Function} Middleware function
 */
const validateEmail = (fieldName = 'email') => {
  return (req, res, next) => {
    const email = req.body[fieldName];
    
    // Skip if email not provided (will be caught by required fields validator if needed)
    if (!email) {
      return next();
    }
    
    // Simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      return responseUtil.error(
        res, 
        400, 
        `Invalid email format for field: ${fieldName}`
      );
    }
    
    next();
  };
};

/**
 * Validate password strength
 * @param {string} fieldName - Name of the field to validate (default: 'password')
 * @param {Object} options - Validation options
 * @returns {Function} Middleware function
 */
const validatePassword = (fieldName = 'password', options = {}) => {
  const defaultOptions = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false
  };
  
  const validationOptions = { ...defaultOptions, ...options };
  
  return (req, res, next) => {
    const password = req.body[fieldName];
    
    // Skip if password not provided (will be caught by required fields validator if needed)
    if (!password) {
      return next();
    }
    
    const errors = [];
    
    if (password.length < validationOptions.minLength) {
      errors.push(`Password must be at least ${validationOptions.minLength} characters long`);
    }
    
    if (validationOptions.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (validationOptions.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (validationOptions.requireNumbers && !/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (validationOptions.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    if (errors.length > 0) {
      return responseUtil.error(res, 400, 'Password validation failed', errors);
    }
    
    next();
  };
};

/**
 * Validate wallet address format
 * @param {string} fieldName - Name of the field to validate (default: 'walletAddress')
 * @returns {Function} Middleware function
 */
const validateWalletAddress = (fieldName = 'walletAddress') => {
  return (req, res, next) => {
    const walletAddress = req.body[fieldName];
    
    // Skip if wallet address not provided (will be caught by required fields validator if needed)
    if (!walletAddress) {
      return next();
    }
    
    // Ethereum address regex (0x followed by 40 hex characters)
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    
    if (!ethAddressRegex.test(walletAddress)) {
      return responseUtil.error(
        res, 
        400, 
        `Invalid wallet address format for field: ${fieldName}`
      );
    }
    
    next();
  };
};

/**
 * Validate numeric field
 * @param {string} fieldName - Name of the field to validate
 * @param {Object} options - Validation options
 * @returns {Function} Middleware function
 */
const validateNumeric = (fieldName, options = {}) => {
  const defaultOptions = {
    min: null,
    max: null,
    integer: false
  };
  
  const validationOptions = { ...defaultOptions, ...options };
  
  return (req, res, next) => {
    const value = req.body[fieldName];
    
    // Skip if value not provided (will be caught by required fields validator if needed)
    if (value === undefined || value === null) {
      return next();
    }
    
    // Convert to number
    const numValue = Number(value);
    
    // Check if it's a valid number
    if (isNaN(numValue)) {
      return responseUtil.error(
        res, 
        400, 
        `Field ${fieldName} must be a number`
      );
    }
    
    // Check if it's an integer if required
    if (validationOptions.integer && !Number.isInteger(numValue)) {
      return responseUtil.error(
        res, 
        400, 
        `Field ${fieldName} must be an integer`
      );
    }
    
    // Check min value if specified
    if (validationOptions.min !== null && numValue < validationOptions.min) {
      return responseUtil.error(
        res, 
        400, 
        `Field ${fieldName} must be at least ${validationOptions.min}`
      );
    }
    
    // Check max value if specified
    if (validationOptions.max !== null && numValue > validationOptions.max) {
      return responseUtil.error(
        res, 
        400, 
        `Field ${fieldName} must be at most ${validationOptions.max}`
      );
    }
    
    next();
  };
};

module.exports = {
  validateRequiredFields,
  validateEmail,
  validatePassword,
  validateWalletAddress,
  validateNumeric
}; 