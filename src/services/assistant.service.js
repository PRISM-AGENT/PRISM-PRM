import api from './api';

/**
 * Assistant Service
 * Handles API communication related to AI assistants
 */
const AssistantService = {
  /**
   * Query an AI assistant
   * @param {string} query - User's question
   * @param {string} assistantId - ID of assistant to query (optional)
   * @returns {Promise} API response
   */
  queryAssistant: async (query, assistantId = null) => {
    try {
      const response = await api.post('/assistant/query', { query, assistantId });
      return response.data;
    } catch (error) {
      console.error('Error in queryAssistant service:', error);
      throw error;
    }
  },

  /**
   * Create a new AI assistant
   * @param {Object} assistantData - Assistant creation data
   * @returns {Promise} API response
   */
  createAssistant: async (assistantData) => {
    try {
      const response = await api.post('/assistant/create', assistantData);
      return response.data;
    } catch (error) {
      console.error('Error in createAssistant service:', error);
      throw error;
    }
  },

  /**
   * List available assistants
   * @returns {Promise} API response with list of assistants
   */
  listAssistants: async () => {
    try {
      const response = await api.get('/assistant/list');
      return response.data;
    } catch (error) {
      console.error('Error in listAssistants service:', error);
      throw error;
    }
  }
};

export default AssistantService; 