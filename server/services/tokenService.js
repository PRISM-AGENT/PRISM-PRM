/**
 * 💼 Token Service
 * Manages token transactions and balances for PRISM users
 */

const Token = require('../models/Token');
const User = require('../models/User');

/**
 * Get token information for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Token information
 */
exports.getTokenInfo = async (userId) => {
  try {
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get token info from database
    const tokenInfo = await Token.findOne({ userId });
    
    if (!tokenInfo) {
      // Create new token record if doesn't exist
      const newTokenInfo = new Token({
        userId,
        balance: 0,
        transactions: []
      });
      await newTokenInfo.save();
      return newTokenInfo;
    }

    return tokenInfo;
  } catch (error) {
    console.error('Error getting token info:', error);
    throw error;
  }
};

/**
 * Process an airdrop for a user
 * @param {string} userId - User ID
 * @param {string} walletAddress - User's wallet address
 * @param {number} amount - Amount of tokens to airdrop
 * @param {string} description - Description of the transaction
 * @returns {Promise<Object>} Updated token information
 */
exports.processAirdrop = async (userId, walletAddress, amount, description) => {
  try {
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Validate wallet address
    if (!walletAddress) {
      throw new Error('Wallet address is required');
    }

    // Get or create token record
    let tokenRecord = await Token.findOne({ userId });
    
    if (!tokenRecord) {
      tokenRecord = new Token({
        userId,
        balance: 0,
        transactions: []
      });
    }

    // Update user's wallet address if provided
    if (user.walletAddress !== walletAddress) {
      user.walletAddress = walletAddress;
      await user.save();
    }

    // Create transaction record
    const transaction = {
      type: 'airdrop',
      amount,
      description,
      timestamp: new Date(),
      walletAddress
    };

    // Update token balance and add transaction
    tokenRecord.balance += amount;
    tokenRecord.transactions.push(transaction);
    
    await tokenRecord.save();
    
    return {
      tokenInfo: tokenRecord,
      transaction: transaction
    };
  } catch (error) {
    console.error('Error processing airdrop:', error);
    throw error;
  }
};

/**
 * Transfer tokens between users
 * @param {string} fromUserId - Sender user ID
 * @param {string} toUserId - Recipient user ID
 * @param {number} amount - Amount to transfer
 * @param {string} description - Transfer description
 * @returns {Promise<Object>} Result of the transfer
 */
exports.transferTokens = async (fromUserId, toUserId, amount, description) => {
  try {
    // Validate amount
    amount = Number(amount);
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Invalid transfer amount');
    }

    // Check if both users exist
    const [fromUser, toUser] = await Promise.all([
      User.findById(fromUserId),
      User.findById(toUserId)
    ]);

    if (!fromUser) {
      throw new Error('Sender user not found');
    }

    if (!toUser) {
      throw new Error('Recipient user not found');
    }

    // Get token records for both users
    const [fromTokenRecord, toTokenRecord] = await Promise.all([
      Token.findOne({ userId: fromUserId }),
      Token.findOne({ userId: toUserId })
    ]);

    // Check if sender has enough balance
    if (!fromTokenRecord || fromTokenRecord.balance < amount) {
      throw new Error('Insufficient balance for transfer');
    }

    // Create or update recipient's token record
    let recipientTokenRecord = toTokenRecord;
    if (!recipientTokenRecord) {
      recipientTokenRecord = new Token({
        userId: toUserId,
        balance: 0,
        transactions: []
      });
    }

    // Create transaction records
    const timestamp = new Date();
    
    const senderTransaction = {
      type: 'transfer_out',
      amount: -amount,
      description,
      timestamp,
      recipient: toUser.email
    };

    const recipientTransaction = {
      type: 'transfer_in',
      amount,
      description,
      timestamp,
      sender: fromUser.email
    };

    // Update balances and add transactions
    fromTokenRecord.balance -= amount;
    fromTokenRecord.transactions.push(senderTransaction);

    recipientTokenRecord.balance += amount;
    recipientTokenRecord.transactions.push(recipientTransaction);

    // Save both records
    await Promise.all([
      fromTokenRecord.save(),
      recipientTokenRecord.save()
    ]);

    return {
      success: true,
      senderBalance: fromTokenRecord.balance,
      recipientBalance: recipientTokenRecord.balance,
      transaction: senderTransaction
    };
  } catch (error) {
    console.error('Error transferring tokens:', error);
    throw error;
  }
}; 