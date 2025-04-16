/**
 * Integration tests for authentication routes
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server/app');
const User = require('../../server/models/User');
const testDb = require('../utils/testDb');
const userTestUtil = require('../utils/userTestUtil');

describe('Authentication Routes', () => {
  // Setup connection to test database
  beforeAll(async () => {
    await testDb.connect();
  });

  // Clear database after each test
  afterEach(async () => {
    await testDb.clearDatabase();
  });

  // Close database connection after all tests
  afterAll(async () => {
    await testDb.closeDatabase();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'Password123!',
        walletAddress: '0x1234567890123456789012345678901234567890'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).toHaveProperty('username', userData.username);
      expect(response.body.data.user).toHaveProperty('email', userData.email);
      expect(response.body.data.user).toHaveProperty('walletAddress', userData.walletAddress);
      expect(response.body.data.user).not.toHaveProperty('password');

      // Verify user was created in database
      const userInDb = await User.findOne({ email: userData.email });
      expect(userInDb).toBeTruthy();
      expect(userInDb.username).toBe(userData.username);
    });

    it('should return error if email is already in use', async () => {
      // Create a user first
      await userTestUtil.createTestUser({
        email: 'duplicate@example.com'
      });

      // Try to register with the same email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'duplicate@example.com',
          password: 'Password123!',
          walletAddress: '0x1234567890123456789012345678901234567890'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeTruthy();
      expect(response.body.error.toLowerCase()).toContain('email');
    });

    it('should return validation errors for invalid inputs', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'a', // Too short
          email: 'notanemail', // Invalid email
          password: '123', // Too short
          walletAddress: 'not-a-wallet' // Invalid wallet address
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeTruthy();
      expect(response.body.errors.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      // Create a test user with known password
      const plainPassword = 'TestPassword123!';
      const testUser = await userTestUtil.createTestUser({
        email: 'logintest@example.com',
        password: plainPassword
      });

      // Attempt to login
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'logintest@example.com',
          password: plainPassword
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).toHaveProperty('username', testUser.username);
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should return error with invalid credentials', async () => {
      // Create a test user
      await userTestUtil.createTestUser({
        email: 'logintest@example.com',
        password: 'CorrectPassword123!'
      });

      // Attempt to login with wrong password
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'logintest@example.com',
          password: 'WrongPassword123!'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeTruthy();
    });

    it('should return error when user does not exist', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'SomePassword123!'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeTruthy();
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user data when authenticated', async () => {
      // Create a test user with token
      const { user, token } = await userTestUtil.createTestUserWithToken();

      // Request user profile
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user).toHaveProperty('_id', user._id.toString());
      expect(response.body.data.user).toHaveProperty('username', user.username);
      expect(response.body.data.user).toHaveProperty('email', user.email);
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should return error if not authenticated', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeTruthy();
    });

    it('should return error if token is invalid', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtokenhere');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeTruthy();
    });
  });
}); 