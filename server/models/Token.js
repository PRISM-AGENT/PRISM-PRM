const mongoose = require('mongoose');

/**
 * Token schema for MongoDB
 * Represents PRM token transactions and balances
 */
const TokenSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  balance: {
    type: Number,
    default: 0,
    required: true
  },
  transactions: [{
    type: {
      type: String,
      enum: ['airdrop', 'purchase', 'reward', 'payment', 'transfer'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    description: {
      type: String
    },
    fromAddress: {
      type: String
    },
    toAddress: {
      type: String
    },
    txHash: {
      type: String
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const Token = mongoose.model('Token', TokenSchema);

module.exports = Token; 