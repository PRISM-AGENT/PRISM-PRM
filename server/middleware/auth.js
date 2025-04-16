const jwt = require('jsonwebtoken');

/**
 * Authentication middleware
 * Verifies JWT token and sets user ID in request
 */
const auth = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // If no token, continue without authentication
    if (!token) {
      return next();
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'prism_secret_key');
    
    // Set user ID in request
    req.userId = decoded.id;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    // Continue without authentication on error
    next();
  }
};

/**
 * Required authentication middleware
 * Verifies JWT token and rejects if not authenticated
 */
const requireAuth = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // If no token, reject
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'prism_secret_key');
    
    // Set user ID in request
    req.userId = decoded.id;
    
    next();
  } catch (error) {
    console.error('Required auth middleware error:', error);
    return res.status(401).json({ message: 'Authentication invalid' });
  }
};

module.exports = { auth, requireAuth }; 