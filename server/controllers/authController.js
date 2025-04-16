/**
 * Authentication Controller
 * Handles user authentication and registration
 */

const bcrypt = require('bcryptjs');
const { responseUtil } = require('../utils');
const { userService } = require('../services');

/**
 * Authentication Controller
 * Handles user authentication and registration
 */
const authController = {
  /**
   * Register a new user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  register: async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      // Check if user already exists
      const existingUser = await userService.findByEmail(email);
      if (existingUser) {
        return responseUtil.error(res, 400, 'User with this email already exists');
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create user
      const userData = {
        email,
        password: hashedPassword,
        firstName,
        lastName
      };
      
      const user = await userService.createUser(userData);
      
      // Generate token
      const token = await userService.generateToken(user._id);
      
      // Return user info and token
      return responseUtil.success(res, 201, 'User registered successfully', {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt
        },
        token
      });
    } catch (error) {
      console.error('Error in register controller:', error);
      return responseUtil.error(res, 500, 'Server error', error);
    }
  },
  
  /**
   * Login a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Authenticate user
      const { success, user, token, message } = await userService.authenticate(email, password);
      
      if (!success) {
        return responseUtil.error(res, 401, message);
      }
      
      // Return user info and token
      return responseUtil.success(res, 200, 'Login successful', { user, token });
    } catch (error) {
      console.error('Error in login controller:', error);
      return responseUtil.error(res, 500, 'Server error', error);
    }
  },
  
  /**
   * Get current user information
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getMe: async (req, res) => {
    try {
      // Get user from database (exclude password)
      const user = await userService.findById(req.userId);
      
      if (!user) {
        return responseUtil.error(res, 404, 'User not found');
      }
      
      // Return user info
      return responseUtil.success(res, 200, 'User retrieved successfully', { user });
    } catch (error) {
      console.error('Error in getMe controller:', error);
      return responseUtil.error(res, 500, 'Server error', error);
    }
  }
};

module.exports = authController; 