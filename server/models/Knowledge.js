const mongoose = require('mongoose');

/**
 * 📚 Knowledge Model
 * Stores validated information for the knowledge base
 */

/**
 * Knowledge schema for MongoDB
 * Represents a piece of knowledge in the system
 */
const KnowledgeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['crypto', 'blockchain', 'defi', 'nft', 'regulation', 'technology', 'other'],
    default: 'other'
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  source: {
    type: String,
    trim: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
});

// Text index for search
KnowledgeSchema.index({ 
  title: 'text', 
  content: 'text', 
  tags: 'text' 
});

const Knowledge = mongoose.model('Knowledge', KnowledgeSchema);

module.exports = Knowledge;