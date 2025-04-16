/**
 * 🔑 User Service
 * Handles user-related business logic and data operations
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Constants
const JWT_SECRET = process.env.JWT_SECRET || 'prism_secret_key';
const JWT_EXPIRY = '24h';
const SALT_ROUNDS = 10;

/**
 * Find a user by their email address
 * @param {string} email - User email
 * @returns {Promise<Object>} User object or null
 */
exports.findByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
};

/**
 * Find a user by their ID
 * @param {string} id - User ID
 * @returns {Promise<Object>} User object or null
 */
exports.findById = async (id) => {
  try {
    const user = await User.findById(id).select('-password');
    return user;
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw error;
  }
};

/**
 * Create a new user
 * @param {Object} userData - User data including name, email, and password
 * @returns {Promise<Object>} Created user object without password
 */
exports.createUser = async (userData) => {
  try {
    // Hash password
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    // Create user with hashed password
    const user = new User({
      name: userData.name,
      email: userData.email,
      password: hashedPassword
    });
    
    await user.save();
    
    // Return user without password
    const userObject = user.toObject();
    delete userObject.password;
    
    return userObject;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Authenticate a user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Authentication result with user and token
 */
exports.authenticate = async (email, password) => {
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { success: false, message: 'Invalid email or password' };
    }
    
    // Update last login timestamp
    user.lastLogin = Date.now();
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );
    
    // Return user data without password
    const userObject = user.toObject();
    delete userObject.password;
    
    return {
      success: true,
      user: userObject,
      token
    };
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw error;
  }
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated user object
 */
exports.updateUser = async (userId, updateData) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return null;
    }
    
    // Update user fields if provided
    if (updateData.name) user.name = updateData.name;
    if (updateData.email) user.email = updateData.email;
    
    await user.save();
    
    // Return user without password
    const userObject = user.toObject();
    delete userObject.password;
    
    return userObject;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Result object with success status and message
 */
exports.changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return { success: false, message: 'Current password is incorrect' };
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password
    user.password = hashedPassword;
    await user.save();
    
    return { success: true, message: 'Password updated successfully' };
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
}; 