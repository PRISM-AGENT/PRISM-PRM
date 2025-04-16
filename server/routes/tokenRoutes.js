/**
 * Token Routes
 * Handles token-related API endpoints
 */

const express = require('express');
const { auth, validation } = require('../middleware');
const tokenController = require('../controllers/tokenController');

const router = express.Router();

/**
 * @route GET /api/tokens
 * @desc Get token info for authenticated user
 * @access Private
 */
router.get('/', auth.protect, tokenController.getTokenInfo);

/**
 * @route POST /api/tokens/airdrop
 * @desc Request token airdrop
 * @access Private
 */
router.post('/airdrop', 
  auth.protect,
  validation.validateRequiredFields(['walletAddress']),
  validation.validateWalletAddress(),
  tokenController.requestAirdrop
);

/**
 * @route POST /api/tokens/transfer
 * @desc Transfer tokens to another user
 * @access Private
 */
router.post('/transfer', 
  auth.protect,
  validation.validateRequiredFields(['recipientId', 'amount']),
  validation.validateNumeric('amount', { min: 1 }),
  tokenController.transferTokens
);

module.exports = router; 