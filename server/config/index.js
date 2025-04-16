/**
 * Application Configuration
 * Centralizes all configuration settings
 */

require('dotenv').config();

const config = {
  // Server settings
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database settings
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/prism',
  
  // Authentication settings
  jwtSecret: process.env.JWT_SECRET || 'prism_secret_key',
  jwtExpiry: process.env.JWT_EXPIRY || '24h',
  
  // Token settings
  airdropAmount: process.env.AIRDROP_AMOUNT || 100,
  
  // API limits
  rateLimitMax: process.env.RATE_LIMIT_MAX || 100,
  rateLimitWindowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
  
  // Logging
  logFormat: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  
  // Security
  corsOrigins: process.env.CORS_ORIGINS 
    ? process.env.CORS_ORIGINS.split(',') 
    : ['http://localhost:3000'],
    
  // Validation settings
  validation: {
    passwordMinLength: 8,
    usernameMinLength: 3
  }
};

module.exports = config;