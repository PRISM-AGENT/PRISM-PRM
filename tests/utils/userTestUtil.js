/**
 * User test utilities
 * Provides functions to create test users and generate auth tokens
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../server/models/User');
const config = require('../../server/config');

/**
 * Create a test user in the database
 * @param {Object} userData - Optional user data to override defaults
 * @returns {Promise<Object>} Created user document
 */
const createTestUser = async (userData = {}) => {
  const defaultUser = {
    username: `testuser_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: 'Password123!',
    role: 'user',
    walletAddress: `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    isVerified: true
  };

  const userToCreate = { ...defaultUser, ...userData };

  // Hash password before saving
  if (userToCreate.password) {
    const salt = await bcrypt.genSalt(10);
    userToCreate.password = await bcrypt.hash(userToCreate.password, salt);
  }

  const user = new User(userToCreate);
  await user.save();
  
  // Return a clean user object without password
  const userObj = user.toObject();
  delete userObj.password;
  
  return userObj;
};

/**
 * Generate a JWT token for a user
 * @param {string} userId - User ID to encode in token
 * @returns {string} JWT token
 */
const generateTestToken = (userId) => {
  return jwt.sign(
    { id: userId },
    config.jwtSecret,
    { expiresIn: '1d' }
  );
};

/**
 * Create a test user and generate token for them
 * @param {Object} userData - Optional user data
 * @returns {Promise<Object>} Object with user data and token
 */
const createTestUserWithToken = async (userData = {}) => {
  const user = await createTestUser(userData);
  const token = generateTestToken(user._id);
  
  return {
    user,
    token
  };
};

/**
 * Clean up test users from the database
 * @param {Array<string>} userIds - Array of user IDs to delete
 * @returns {Promise<void>}
 */
const removeTestUsers = async (userIds = []) => {
  if (userIds.length > 0) {
    await User.deleteMany({ _id: { $in: userIds } });
  } else {
    // If no specific IDs provided, remove all test users
    await User.deleteMany({ username: /^testuser_/ });
  }
};

module.exports = {
  createTestUser,
  generateTestToken,
  createTestUserWithToken,
  removeTestUsers
}; 