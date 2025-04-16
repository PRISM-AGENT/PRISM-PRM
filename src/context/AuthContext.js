import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthService } from '../services';

// Create context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user is logged in on initial load
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);
  
  // Login function
  const login = async (email, password) => {
    try {
      const response = await AuthService.login(email, password);
      setCurrentUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };
  
  // Register function
  const register = async (userData) => {
    try {
      const response = await AuthService.register(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };
  
  // Logout function
  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
  };
  
  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      const response = await AuthService.updateProfile(profileData);
      setCurrentUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };
  
  // Context value
  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    register,
    logout,
    updateProfile
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 