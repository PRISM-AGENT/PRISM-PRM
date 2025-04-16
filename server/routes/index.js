/**
 * Routes Index
 * Registers all API routes
 */

const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const tokenRoutes = require('./tokenRoutes');
const assistantRoutes = require('./assistantRoutes');

const router = express.Router();

/**
 * API Health Check
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * Register all routes
 */
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/tokens', tokenRoutes);
router.use('/assistant', assistantRoutes);

module.exports = router; 