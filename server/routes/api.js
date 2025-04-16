const express = require('express');
const router = express.Router();

// Import controllers
const assistantController = require('../controllers/assistantController');
const userController = require('../controllers/userController');
const tokenController = require('../controllers/tokenController');

// Import middleware
const { requireAuth, validator } = require('../middleware');

// Health check route - keep this at root level
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'PRISM API is running' });
});

// API versioning - v1 routes
const v1Router = express.Router();

// Assistant routes
v1Router.post('/assistant/query', 
  validator.validateRequiredFields(['query']),
  assistantController.queryAssistant
);

v1Router.post('/assistant/create', 
  requireAuth,
  validator.validateRequiredFields(['name', 'description']),
  assistantController.createAssistant
);

v1Router.get('/assistant/list', assistantController.listAssistants);

// Auth routes
v1Router.post('/auth/register', 
  validator.validateRequiredFields(['firstName', 'lastName', 'email', 'password']),
  validator.validateEmail(),
  validator.validatePassword(),
  userController.register
);

v1Router.post('/auth/login', 
  validator.validateRequiredFields(['email', 'password']),
  validator.validateEmail(),
  userController.login
);

// User routes
v1Router.get('/user/profile', requireAuth, userController.getProfile);

v1Router.put('/user/profile', 
  requireAuth,
  validator.validateEmail(),
  validator.validateWalletAddress(),
  userController.updateProfile
);

// Token routes
v1Router.get('/token/info', requireAuth, tokenController.getTokenInfo);

v1Router.post('/token/airdrop', 
  requireAuth,
  validator.validateRequiredFields(['walletAddress']),
  validator.validateWalletAddress(),
  tokenController.requestAirdrop
);

// Mount v1 routes
router.use('/v1', v1Router);

// For backward compatibility during transition, also mount at root level
router.use('/', v1Router);

module.exports = router; 