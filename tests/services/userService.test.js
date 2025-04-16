/**
 * User Service Tests
 * Tests for userService methods
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');
const userService = require('../../server/services/userService');
const User = require('../../server/models/User');

// Mock JWT functions
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock-token'),
}));

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
  jest.clearAllMocks();
});

describe('User Service', () => {
  describe('findById', () => {
    test('should find user by ID', async () => {
      // Create a test user
      const user = new User({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
      });
      await user.save();

      // Call the service method
      const result = await userService.findById(user._id);

      // Assert the result
      expect(result).toBeDefined();
      expect(result.email).toBe('test@example.com');
      expect(result.firstName).toBe('Test');
      expect(result.lastName).toBe('User');
      expect(result.password).toBeUndefined(); // Password should be excluded
    });

    test('should return null for non-existent user', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const result = await userService.findById(nonExistentId);
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    test('should find user by email', async () => {
      // Create a test user
      const user = new User({
        firstName: 'Email',
        lastName: 'User',
        email: 'email@example.com',
        password: 'password123',
      });
      await user.save();

      // Call the service method
      const result = await userService.findByEmail('email@example.com');

      // Assert the result
      expect(result).toBeDefined();
      expect(result.email).toBe('email@example.com');
      expect(result.firstName).toBe('Email');
      // Password should be included for auth purposes
      expect(result.password).toBeDefined();
    });

    test('should return null for non-existent email', async () => {
      const result = await userService.findByEmail('nonexistent@example.com');
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    test('should create a new user with hashed password', async () => {
      // Call the service method
      const userData = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
      };
      
      const result = await userService.createUser(userData);

      // Assert the result
      expect(result).toBeDefined();
      expect(result.email).toBe('newuser@example.com');
      expect(result.name).toBe('New User');
      expect(result.password).toBeUndefined(); // Password should be excluded from result

      // Verify user was created in the database
      const dbUser = await User.findOne({ email: 'newuser@example.com' });
      expect(dbUser).toBeDefined();
      expect(dbUser.password).not.toBe('password123'); // Password should be hashed
    });

    test('should throw error for duplicate email', async () => {
      // Create a user
      const user = new User({
        firstName: 'Existing',
        lastName: 'User',
        email: 'duplicate@example.com',
        password: 'password123',
      });
      await user.save();

      // Attempt to create another user with the same email
      const userData = {
        name: 'Duplicate User',
        email: 'duplicate@example.com',
        password: 'password123',
      };
      
      await expect(userService.createUser(userData))
        .rejects
        .toThrow();
    });
  });

  describe('authenticate', () => {
    test('should authenticate user with valid credentials', async () => {
      // Create a test user with hashed password
      const password = 'password123';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const user = new User({
        firstName: 'Auth',
        lastName: 'User',
        email: 'auth@example.com',
        password: hashedPassword,
      });
      await user.save();

      // Call the service method
      const result = await userService.authenticate('auth@example.com', 'password123');

      // Assert the result
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('auth@example.com');
      expect(result.token).toBe('mock-token');

      // Check that JWT was called correctly
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: user._id },
        expect.any(String),
        { expiresIn: expect.any(String) }
      );
    });

    test('should return error for invalid email', async () => {
      const result = await userService.authenticate('nonexistent@example.com', 'password');
      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid email or password');
      expect(result.token).toBeUndefined();
    });

    test('should return error for invalid password', async () => {
      // Create a test user with hashed password
      const password = 'correctpassword';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const user = new User({
        firstName: 'Wrong',
        lastName: 'Password',
        email: 'wrongpass@example.com',
        password: hashedPassword,
      });
      await user.save();

      // Call with wrong password
      const result = await userService.authenticate('wrongpass@example.com', 'wrongpassword');
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid email or password');
      expect(result.token).toBeUndefined();
    });
  });

  describe('updateUser', () => {
    test('should update user information', async () => {
      // Create a test user
      const user = new User({
        firstName: 'Original',
        lastName: 'Name',
        email: 'original@example.com',
        password: 'password123',
      });
      await user.save();

      // Call the service method
      const result = await userService.updateUser(user._id, {
        name: 'Updated Name',
        email: 'updated@example.com',
      });

      // Assert the result
      expect(result).toBeDefined();
      expect(result.name).toBe('Updated Name');
      expect(result.email).toBe('updated@example.com');

      // Verify user was updated in the database
      const dbUser = await User.findById(user._id);
      expect(dbUser.name).toBe('Updated Name');
      expect(dbUser.email).toBe('updated@example.com');
    });

    test('should return null for non-existent user', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const result = await userService.updateUser(nonExistentId, {
        name: 'Updated Name',
      });
      
      expect(result).toBeNull();
    });
  });

  describe('changePassword', () => {
    test('should change password with valid current password', async () => {
      // Create a test user with hashed password
      const currentPassword = 'currentpass';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(currentPassword, salt);
      
      const user = new User({
        firstName: 'Password',
        lastName: 'Change',
        email: 'password@example.com',
        password: hashedPassword,
      });
      await user.save();

      // Call the service method
      const result = await userService.changePassword(
        user._id,
        'currentpass',
        'newpassword'
      );

      // Assert the result
      expect(result).toBeDefined();
      expect(result.success).toBe(true);

      // Verify password was updated in the database
      const dbUser = await User.findById(user._id);
      const isMatch = await bcrypt.compare('newpassword', dbUser.password);
      expect(isMatch).toBe(true);
    });

    test('should return error for incorrect current password', async () => {
      // Create a test user with hashed password
      const currentPassword = 'currentpass';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(currentPassword, salt);
      
      const user = new User({
        firstName: 'Wrong',
        lastName: 'Current',
        email: 'wrongcurrent@example.com',
        password: hashedPassword,
      });
      await user.save();

      // Call with wrong current password
      const result = await userService.changePassword(
        user._id,
        'wrongcurrent',
        'newpassword'
      );
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('Current password is incorrect');

      // Verify password was not updated
      const dbUser = await User.findById(user._id);
      const isMatch = await bcrypt.compare('currentpass', dbUser.password);
      expect(isMatch).toBe(true);
    });

    test('should return error for non-existent user', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const result = await userService.changePassword(
        nonExistentId,
        'currentpass',
        'newpassword'
      );
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('User not found');
    });
  });
}); 