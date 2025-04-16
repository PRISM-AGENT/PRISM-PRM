/**
 * Token Controller
 * Handles user token operations
 */

const { responseUtil } = require('../utils');
const { tokenService, userService } = require('../services');

// Constants
const AIRDROP_AMOUNT = 100;
const AIRDROP_DESCRIPTION = 'Initial airdrop tokens';

/**
 * Token Controller
 * Handles user token operations
 */
const tokenController = {
  /**
   * Get token information for authenticated user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getTokenInfo: async (req, res) => {
    try {
      // Check if user exists
      const user = await userService.findById(req.userId);
      if (!user) {
        return responseUtil.error(res, 404, 'User not found');
      }

      // Get token data
      const tokenData = await tokenService.getTokenInfo(req.userId);
      
      return responseUtil.success(res, 200, 'Token information retrieved', tokenData);
    } catch (error) {
      console.error('Error in getTokenInfo controller:', error);
      return responseUtil.error(res, 500, 'Server error', error);
    }
  },
  
  /**
   * Request token airdrop
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  requestAirdrop: async (req, res) => {
    try {
      const { walletAddress } = req.body;
      
      if (!walletAddress) {
        return responseUtil.error(res, 400, 'Wallet address is required');
      }
      
      // Check if user exists
      const user = await userService.findById(req.userId);
      if (!user) {
        return responseUtil.error(res, 404, 'User not found');
      }
      
      // Process airdrop
      const result = await tokenService.processAirdrop(
        req.userId, 
        walletAddress, 
        AIRDROP_AMOUNT, 
        AIRDROP_DESCRIPTION
      );
      
      return responseUtil.success(res, 200, 'Airdrop processed successfully', {
        transaction: result.transaction,
        currentBalance: result.tokenInfo.balance
      });
    } catch (error) {
      console.error('Error in requestAirdrop controller:', error);
      return responseUtil.error(res, 500, 'Server error', error);
    }
  },
  
  /**
   * Transfer tokens to another user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  transferTokens: async (req, res) => {
    try {
      const { recipientId, amount, description } = req.body;
      
      // Validate required fields
      if (!recipientId || !amount) {
        return responseUtil.error(res, 400, 'Recipient ID and amount are required');
      }
      
      // Ensure amount is a positive number
      const transferAmount = Number(amount);
      if (isNaN(transferAmount) || transferAmount <= 0) {
        return responseUtil.error(res, 400, 'Amount must be a positive number');
      }
      
      // Process transfer
      const result = await tokenService.transferTokens(
        req.userId,
        recipientId,
        transferAmount,
        description || 'Token transfer'
      );
      
      return responseUtil.success(res, 200, 'Transfer successful', {
        currentBalance: result.senderBalance,
        transaction: result.transaction
      });
    } catch (error) {
      console.error('Error in transferTokens controller:', error);
      
      // Handle specific errors
      if (error.message === 'Insufficient balance for transfer') {
        return responseUtil.error(res, 400, 'Insufficient balance for transfer');
      }
      
      if (error.message === 'Recipient user not found') {
        return responseUtil.error(res, 404, 'Recipient not found');
      }
      
      return responseUtil.error(res, 500, 'Server error', error);
    }
  }
};

module.exports = tokenController; 