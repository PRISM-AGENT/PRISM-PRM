/**
 * User Controller
 * Handles user-related API endpoints
 */

const UserService = require('../services/userService');
const { successResponse, errorResponse, validationError, notFoundError, unauthorizedError } = require('../utils/responseUtils');

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return validationError(res, { message: 'Name, email, and password are required' });
    }
    
    // Check if user already exists
    const existingUser = await UserService.findByEmail(email);
    if (existingUser) {
      return validationError(res, { email: 'Email is already registered' });
    }
    
    // Create new user
    const user = await UserService.createUser({ name, email, password });
    
    return successResponse(res, 201, 'User registered successfully', { user });
  } catch (error) {
    console.error('Registration error:', error);
    return errorResponse(res, 500, 'Failed to register user');
  }
};

/**
 * Login user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return validationError(res, { message: 'Email and password are required' });
    }
    
    // Authenticate user
    const authResult = await UserService.authenticate(email, password);
    
    if (!authResult.success) {
      return unauthorizedError(res, authResult.message);
    }
    
    return successResponse(res, 200, 'Login successful', {
      user: authResult.user,
      token: authResult.token
    });
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(res, 500, 'Failed to login');
  }
};

/**
 * Get current user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await UserService.findById(userId);
    
    if (!user) {
      return notFoundError(res, 'User not found');
    }
    
    return successResponse(res, 200, 'User profile retrieved successfully', { user });
  } catch (error) {
    console.error('Get user profile error:', error);
    return errorResponse(res, 500, 'Failed to retrieve user profile');
  }
};

/**
 * Update user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;
    
    // Check if email is already taken by another user
    if (email) {
      const existingUser = await UserService.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        return validationError(res, { email: 'Email is already in use' });
      }
    }
    
    // Update user
    const updatedUser = await UserService.updateUser(userId, { name, email });
    
    if (!updatedUser) {
      return notFoundError(res, 'User not found');
    }
    
    return successResponse(res, 200, 'Profile updated successfully', { user: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    return errorResponse(res, 500, 'Failed to update profile');
  }
}; 