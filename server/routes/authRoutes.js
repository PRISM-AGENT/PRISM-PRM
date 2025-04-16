/**
 * Authentication Routes
 * Handles authentication-related API endpoints
 */

const express = require('express');
const { auth, validation } = require('../middleware');
const authController = require('../controllers/authController');
const { check } = require('express-validator');

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
 * @desc 🔑 Authenticate user & get token
 * @access Public
 */
router.post('/login', 
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ], 
  authController.login
);

/**
 * @route GET /api/auth/me
 * @desc Get current user info
 * @access Private
 */
router.get('/me', auth.protect, authController.getMe);

module.exports = router; 