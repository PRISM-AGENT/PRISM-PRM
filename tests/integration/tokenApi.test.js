/**
 * Token API Integration Tests
 */

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../server/app');
const User = require('../../server/models/User');
const Token = require('../../server/models/Token');
const jwt = require('jsonwebtoken');

let mongoServer;
let testUser;
let authToken;

// Setup test database
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  
  await mongoose.connect(uri, mongooseOpts);
  
  // Create test user
  testUser = new User({
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: '$2a$10$eCQGfsXJWKPDuEDCeKiXIOstpuQNBBwUr0XN1xHE4.TXUr5UaPUta', // hashed 'password123'
  });
  
  await testUser.save();
  
  // Generate auth token
  authToken = jwt.sign(
    { id: testUser._id }, 
    process.env.JWT_SECRET || 'prism_secret_key',
    { expiresIn: '1h' }
  );
});

// Clean up after tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear token collection between tests
beforeEach(async () => {
  await Token.deleteMany({});
});

describe('Token API', () => {
  describe('GET /api/tokens', () => {
    test('should return token info for authenticated user', async () => {
      // Create token record for test user
      const tokenRecord = new Token({
        userId: testUser._id,
        balance: 500,
        transactions: [
          {
            type: 'airdrop',
            amount: 500,
            description: 'Initial airdrop',
            timestamp: new Date(),
          },
        ],
      });
      
      await tokenRecord.save();
      
      const response = await request(app)
        .get('/api/tokens')
        .set('Authorization', `Bearer ${authToken}`);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.balance).toBe(500);
      expect(response.body.data.transactions).toHaveLength(1);
    });
    
    test('should create new token record if none exists', async () => {
      const response = await request(app)
        .get('/api/tokens')
        .set('Authorization', `Bearer ${authToken}`);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.balance).toBe(0);
      expect(response.body.data.transactions).toHaveLength(0);
      
      // Verify record was created in database
      const tokenRecord = await Token.findOne({ userId: testUser._id });
      expect(tokenRecord).toBeDefined();
      expect(tokenRecord.balance).toBe(0);
    });
    
    test('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .get('/api/tokens');
        
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('POST /api/tokens/airdrop', () => {
    test('should process airdrop successfully', async () => {
      const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';
      
      const response = await request(app)
        .post('/api/tokens/airdrop')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ walletAddress });
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.transaction).toBeDefined();
      expect(response.body.data.transaction.type).toBe('airdrop');
      expect(response.body.data.transaction.amount).toBe(100); // Default airdrop amount
      expect(response.body.data.currentBalance).toBe(100);
      
      // Verify user's wallet was updated
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.walletAddress).toBe(walletAddress);
    });
    
    test('should return 400 if wallet address is missing', async () => {
      const response = await request(app)
        .post('/api/tokens/airdrop')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});
        
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
    
    test('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .post('/api/tokens/airdrop')
        .send({ walletAddress: '0x1234567890abcdef1234567890abcdef12345678' });
        
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('POST /api/tokens/transfer', () => {
    let recipientUser;
    
    beforeEach(async () => {
      // Create recipient user
      recipientUser = new User({
        firstName: 'Recipient',
        lastName: 'User',
        email: 'recipient@example.com',
        password: '$2a$10$eCQGfsXJWKPDuEDCeKiXIOstpuQNBBwUr0XN1xHE4.TXUr5UaPUta', // hashed 'password123'
      });
      
      await recipientUser.save();
      
      // Create token record for test user with initial balance
      const tokenRecord = new Token({
        userId: testUser._id,
        balance: 1000,
        transactions: [
          {
            type: 'airdrop',
            amount: 1000,
            description: 'Initial balance',
            timestamp: new Date(),
          },
        ],
      });
      
      await tokenRecord.save();
    });
    
    test('should transfer tokens successfully', async () => {
      const response = await request(app)
        .post('/api/tokens/transfer')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          recipientId: recipientUser._id,
          amount: 250,
          description: 'Test transfer',
        });
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.transaction).toBeDefined();
      expect(response.body.data.transaction.type).toBe('transfer_out');
      expect(response.body.data.transaction.amount).toBe(-250);
      expect(response.body.data.currentBalance).toBe(750);
      
      // Verify sender balance was updated
      const senderToken = await Token.findOne({ userId: testUser._id });
      expect(senderToken.balance).toBe(750);
      
      // Verify recipient received tokens
      const recipientToken = await Token.findOne({ userId: recipientUser._id });
      expect(recipientToken).toBeDefined();
      expect(recipientToken.balance).toBe(250);
    });
    
    test('should return 400 if recipient ID is missing', async () => {
      const response = await request(app)
        .post('/api/tokens/transfer')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 250,
          description: 'Test transfer',
        });
        
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
    
    test('should return 400 if amount is missing', async () => {
      const response = await request(app)
        .post('/api/tokens/transfer')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          recipientId: recipientUser._id,
          description: 'Test transfer',
        });
        
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
    
    test('should return 400 if amount is invalid', async () => {
      const response = await request(app)
        .post('/api/tokens/transfer')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          recipientId: recipientUser._id,
          amount: -50,
          description: 'Test transfer',
        });
        
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
    
    test('should return 400 if balance is insufficient', async () => {
      const response = await request(app)
        .post('/api/tokens/transfer')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          recipientId: recipientUser._id,
          amount: 2000,
          description: 'Test transfer',
        });
        
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Insufficient balance');
    });
    
    test('should return 404 if recipient does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .post('/api/tokens/transfer')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          recipientId: nonExistentId,
          amount: 250,
          description: 'Test transfer',
        });
        
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Recipient not found');
    });
    
    test('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .post('/api/tokens/transfer')
        .send({
          recipientId: recipientUser._id,
          amount: 250,
          description: 'Test transfer',
        });
        
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
}); 