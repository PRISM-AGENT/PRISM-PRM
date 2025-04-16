/**
 * User Routes
 * Handles user-related API endpoints
 */

const express = require('express');
const { auth, validation } = require('../middleware');
const userController = require('../controllers/userController');

const router = express.Router();

/**
 * @route POST /api/users/register
 * @desc Register new user
 * @access Public
 */
router.post('/register', 
  validation.validateRequiredFields(['username', 'email', 'password']),
  validation.validateEmail(),
  validation.validatePassword(),
  userController.register
);

/**
 * @route POST /api/users/login
 * @desc Login user
 * @access Public
 */
router.post('/login', 
  validation.validateRequiredFields(['email', 'password']),
  validation.validateEmail(),
  userController.login
);

/**
 * @route GET /api/users/profile
 * @desc Get user profile
 * @access Private
 */
router.get('/profile', auth.protect, userController.getProfile);

/**
 * @route PUT /api/users/profile
 * @desc Update user profile
 * @access Private
 */
router.put('/profile', auth.protect, userController.updateProfile);

/**
 * Admin-only routes
 */
router.use(restrictTo('admin'));

/**
 * @route GET /api/users
 * @desc Get all users (admin only)
 * @access Private/Admin
 */
// router.get('/', userController.getAllUsers);

module.exports = router; 