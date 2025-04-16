const mongoose = require('mongoose');

/**
 * Assistant schema for MongoDB
 */
const AssistantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  specialization: {
    type: String,
    enum: ['general', 'crypto', 'defi', 'nft', 'regulation', 'technical', 'custom'],
    default: 'general'
  },
  context: {
    type: String,
    default: ''
  },
  knowledgeBase: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Knowledge'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  usageCount: {
    type: Number,
    default: 0
  }
});

const Assistant = mongoose.model('Assistant', AssistantSchema);

module.exports = Assistant; 