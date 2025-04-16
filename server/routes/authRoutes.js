/**
 * Authentication Routes
 * Handles authentication-related API endpoints
 */

const express = require('express');
const { auth, validation } = require('../middleware');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', 
  validation.validateRequiredFields(['email', 'password', 'firstName', 'lastName']),
  validation.validateEmail(),
  validation.validatePassword(),
  authController.register
);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
router.post('/login',
  validation.validateRequiredFields(['email', 'password']),
  validation.validateEmail(),
  authController.login
);

/**
 * @route GET /api/auth/me
 * @desc Get current user info
 * @access Private
 */
router.get('/me', auth.protect, authController.getMe);

module.exports = router; 