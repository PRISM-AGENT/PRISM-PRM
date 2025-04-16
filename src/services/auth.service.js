import api from './api';

/**
 * Authentication Service
 * Handles user authentication and profile operations
 */
const AuthService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} API response
   */
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Error in register service:', error);
      throw error;
    }
  },

  /**
   * Login a user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} API response with token and user data
   */
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Store token and user data in local storage
      if (response.data.token) {
        localStorage.setItem('prism_token', response.data.token);
        localStorage.setItem('prism_user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error in login service:', error);
      throw error;
    }
  },

  /**
   * Logout the current user
   */
  logout: () => {
    localStorage.removeItem('prism_token');
    localStorage.removeItem('prism_user');
  },

  /**
   * Get the current user's profile
   * @returns {Promise} API response with user profile data
   */
  getProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      console.error('Error in getProfile service:', error);
      throw error;
    }
  },

  /**
   * Update the current user's profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} API response
   */
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/user/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error in updateProfile service:', error);
      throw error;
    }
  },

  /**
   * Check if the user is logged in
   * @returns {boolean} True if user is logged in
   */
  isLoggedIn: () => {
    return !!localStorage.getItem('prism_token');
  },

  /**
   * Get the current user data
   * @returns {Object|null} User data or null if not logged in
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('prism_user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }
};

export default AuthService; 