/**
 * 🤖 Assistant Service
 * Handles AI assistant queries and knowledge integration
 * Data access layer for assistant-related operations
 */

const { Assistant } = require('../models');

/**
 * Find an assistant by ID
 * @param {string} assistantId - Assistant ID to find
 * @returns {Promise<Object>} Assistant object
 */
const findById = async (assistantId) => {
  try {
    const assistant = await Assistant.findById(assistantId);
    return assistant;
  } catch (error) {
    console.error('Error in findById service:', error);
    throw error;
  }
};

/**
 * Check if a user has access to an assistant
 * @param {Object} assistant - Assistant object
 * @param {string} userId - User ID to check
 * @returns {boolean} Whether user has access
 */
const hasAccess = (assistant, userId) => {
  if (!assistant) return false;
  
  // Public assistants are accessible to everyone
  if (assistant.isPublic) return true;
  
  // Private assistants are only accessible to their creator
  return userId && assistant.createdBy.toString() === userId;
};

/**
 * Create a new assistant
 * @param {Object} assistantData - Assistant data to create
 * @param {string} userId - User ID of creator
 * @returns {Promise<Object>} Created assistant object
 */
const createAssistant = async (assistantData, userId) => {
  try {
    // Create assistant with user as creator
    const assistant = new Assistant({
      ...assistantData,
      createdBy: userId
    });
    
    await assistant.save();
    return assistant;
  } catch (error) {
    console.error('Error in createAssistant service:', error);
    throw error;
  }
};

/**
 * Update an assistant
 * @param {string} assistantId - Assistant ID to update
 * @param {Object} updateData - Data to update
 * @param {string} userId - User ID attempting the update
 * @returns {Promise<Object>} Updated assistant object
 */
const updateAssistant = async (assistantId, updateData, userId) => {
  try {
    const assistant = await Assistant.findById(assistantId);
    
    if (!assistant) {
      throw new Error('Assistant not found');
    }
    
    // Check if user has permission to update
    if (assistant.createdBy.toString() !== userId) {
      throw new Error('Unauthorized to update this assistant');
    }
    
    // Update fields
    Object.keys(updateData).forEach(key => {
      assistant[key] = updateData[key];
    });
    
    // Update last modified date
    assistant.lastModified = Date.now();
    
    await assistant.save();
    return assistant;
  } catch (error) {
    console.error('Error in updateAssistant service:', error);
    throw error;
  }
};

/**
 * Increment assistant usage count
 * @param {string} assistantId - Assistant ID
 * @returns {Promise<void>}
 */
const incrementUsageCount = async (assistantId) => {
  try {
    await Assistant.findByIdAndUpdate(
      assistantId,
      { $inc: { usageCount: 1 } }
    );
  } catch (error) {
    console.error('Error incrementing usage count:', error);
    // Don't throw this error as it's not critical
  }
};

/**
 * List assistants with access control
 * @param {string} userId - User ID (optional)
 * @param {Object} filters - Query filters (optional)
 * @returns {Promise<Array>} Array of assistant objects
 */
const listAssistants = async (userId = null, filters = {}) => {
  try {
    // Build query - always include public assistants
    const query = { $or: [{ isPublic: true }] };
    
    // If user is authenticated, include their private assistants
    if (userId) {
      query.$or.push({ createdBy: userId });
    }
    
    // Add any additional filters
    if (filters.specialization) {
      query.specialization = filters.specialization;
    }
    
    // Get assistants
    const assistants = await Assistant.find(query)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'firstName lastName');
    
    return assistants;
  } catch (error) {
    console.error('Error in listAssistants service:', error);
    throw error;
  }
};

module.exports = {
  findById,
  hasAccess,
  createAssistant,
  updateAssistant,
  incrementUsageCount,
  listAssistants
}; 