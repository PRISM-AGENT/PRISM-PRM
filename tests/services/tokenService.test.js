/**
 * Token Service Tests
 * Tests for tokenService methods
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const tokenService = require('../../server/services/tokenService');
const User = require('../../server/models/User');
const Token = require('../../server/models/Token');

let mongoServer;

// Setup test database
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clean up after tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear database between tests
beforeEach(async () => {
  await User.deleteMany({});
  await Token.deleteMany({});
});

describe('Token Service', () => {
  describe('getTokenInfo', () => {
    test('should return token info for existing user', async () => {
      // Create a test user
      const user = new User({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
      });
      await user.save();

      // Create a token record for the user
      const tokenRecord = new Token({
        userId: user._id,
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

      // Call the service method
      const result = await tokenService.getTokenInfo(user._id);

      // Assert the result
      expect(result).toBeDefined();
      expect(result.balance).toBe(500);
      expect(result.transactions).toHaveLength(1);
      expect(result.transactions[0].type).toBe('airdrop');
      expect(result.transactions[0].amount).toBe(500);
    });

    test('should create new token record if none exists', async () => {
      // Create a test user
      const user = new User({
        firstName: 'New',
        lastName: 'User',
        email: 'newuser@example.com',
        password: 'password123',
      });
      await user.save();

      // Call the service method
      const result = await tokenService.getTokenInfo(user._id);

      // Assert the result
      expect(result).toBeDefined();
      expect(result.balance).toBe(0);
      expect(result.transactions).toHaveLength(0);

      // Verify a new record was created in the database
      const tokenRecord = await Token.findOne({ userId: user._id });
      expect(tokenRecord).toBeDefined();
      expect(tokenRecord.balance).toBe(0);
    });

    test('should throw error for non-existent user', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await expect(tokenService.getTokenInfo(nonExistentId))
        .rejects
        .toThrow('User not found');
    });
  });

  describe('processAirdrop', () => {
    test('should process airdrop for user with existing token record', async () => {
      // Create a test user
      const user = new User({
        firstName: 'Airdrop',
        lastName: 'User',
        email: 'airdrop@example.com',
        password: 'password123',
      });
      await user.save();

      // Create a token record for the user
      const tokenRecord = new Token({
        userId: user._id,
        balance: 0,
        transactions: [],
      });
      await tokenRecord.save();

      // Process airdrop
      const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';
      const result = await tokenService.processAirdrop(
        user._id,
        walletAddress,
        100,
        'Test airdrop'
      );

      // Assert the result
      expect(result).toBeDefined();
      expect(result.tokenInfo.balance).toBe(100);
      expect(result.tokenInfo.transactions).toHaveLength(1);
      expect(result.transaction.type).toBe('airdrop');
      expect(result.transaction.amount).toBe(100);
      expect(result.transaction.description).toBe('Test airdrop');

      // Verify user wallet address was updated
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.walletAddress).toBe(walletAddress);
    });

    test('should create new token record for user without one', async () => {
      // Create a test user
      const user = new User({
        firstName: 'New',
        lastName: 'Airdrop',
        email: 'newairdrop@example.com',
        password: 'password123',
      });
      await user.save();

      // Process airdrop
      const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';
      const result = await tokenService.processAirdrop(
        user._id,
        walletAddress,
        100,
        'Test airdrop'
      );

      // Assert the result
      expect(result).toBeDefined();
      expect(result.tokenInfo.balance).toBe(100);

      // Verify a new record was created in the database
      const tokenRecord = await Token.findOne({ userId: user._id });
      expect(tokenRecord).toBeDefined();
      expect(tokenRecord.balance).toBe(100);
    });

    test('should throw error for non-existent user', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await expect(tokenService.processAirdrop(
        nonExistentId,
        '0x1234567890abcdef1234567890abcdef12345678',
        100,
        'Test airdrop'
      )).rejects.toThrow('User not found');
    });

    test('should throw error for missing wallet address', async () => {
      // Create a test user
      const user = new User({
        firstName: 'No',
        lastName: 'Wallet',
        email: 'nowallet@example.com',
        password: 'password123',
      });
      await user.save();

      await expect(tokenService.processAirdrop(
        user._id,
        null,
        100,
        'Test airdrop'
      )).rejects.toThrow('Wallet address is required');
    });
  });

  describe('transferTokens', () => {
    let sender, recipient;

    beforeEach(async () => {
      // Create sender and recipient users
      sender = new User({
        firstName: 'Sender',
        lastName: 'User',
        email: 'sender@example.com',
        password: 'password123',
      });
      
      recipient = new User({
        firstName: 'Recipient',
        lastName: 'User',
        email: 'recipient@example.com',
        password: 'password123',
      });
      
      await Promise.all([sender.save(), recipient.save()]);

      // Create a token record for the sender with initial balance
      const senderToken = new Token({
        userId: sender._id,
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
      
      await senderToken.save();
    });

    test('should transfer tokens between users', async () => {
      // Perform transfer
      const result = await tokenService.transferTokens(
        sender._id,
        recipient._id,
        200,
        'Test transfer'
      );

      // Assert the result
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.senderBalance).toBe(800);
      expect(result.transaction.type).toBe('transfer_out');
      expect(result.transaction.amount).toBe(-200);

      // Verify sender balance was updated
      const senderToken = await Token.findOne({ userId: sender._id });
      expect(senderToken.balance).toBe(800);
      expect(senderToken.transactions).toHaveLength(2);

      // Verify recipient received tokens
      const recipientToken = await Token.findOne({ userId: recipient._id });
      expect(recipientToken).toBeDefined();
      expect(recipientToken.balance).toBe(200);
      expect(recipientToken.transactions).toHaveLength(1);
      expect(recipientToken.transactions[0].type).toBe('transfer_in');
      expect(recipientToken.transactions[0].amount).toBe(200);
    });

    test('should throw error for insufficient balance', async () => {
      await expect(tokenService.transferTokens(
        sender._id,
        recipient._id,
        1500,
        'Too much'
      )).rejects.toThrow('Insufficient balance for transfer');
    });

    test('should throw error for invalid transfer amount', async () => {
      await expect(tokenService.transferTokens(
        sender._id,
        recipient._id,
        -100,
        'Negative amount'
      )).rejects.toThrow('Invalid transfer amount');

      await expect(tokenService.transferTokens(
        sender._id,
        recipient._id,
        0,
        'Zero amount'
      )).rejects.toThrow('Invalid transfer amount');
    });

    test('should throw error for non-existent sender', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await expect(tokenService.transferTokens(
        nonExistentId,
        recipient._id,
        100,
        'Test transfer'
      )).rejects.toThrow('Sender user not found');
    });

    test('should throw error for non-existent recipient', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await expect(tokenService.transferTokens(
        sender._id,
        nonExistentId,
        100,
        'Test transfer'
      )).rejects.toThrow('Recipient user not found');
    });
  });
}); 