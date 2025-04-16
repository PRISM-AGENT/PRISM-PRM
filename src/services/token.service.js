import api from './api';

/**
 * Token Service
 * Handles token-related operations
 */
const TokenService = {
  /**
   * Get token information
   * @returns {Promise} API response with token information
   */
  getTokenInfo: async () => {
    try {
      const response = await api.get('/token/info');
      return response.data;
    } catch (error) {
      console.error('Error in getTokenInfo service:', error);
      throw error;
    }
  },

  /**
   * Request an airdrop of tokens
   * @param {string} walletAddress - Wallet address to receive the airdrop
   * @returns {Promise} API response
   */
  requestAirdrop: async (walletAddress) => {
    try {
      const response = await api.post('/token/airdrop', { walletAddress });
      return response.data;
    } catch (error) {
      console.error('Error in requestAirdrop service:', error);
      throw error;
    }
  }
};

export default TokenService; 