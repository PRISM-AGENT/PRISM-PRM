/**
 * Assistant Service Tests
 * Tests for assistantService methods
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const assistantService = require('../../server/services/assistantService');
const Assistant = require('../../server/models/Assistant');
const User = require('../../server/models/User');

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
  await Assistant.deleteMany({});
  await User.deleteMany({});
});

describe('Assistant Service', () => {
  describe('findById', () => {
    test('should find assistant by ID', async () => {
      // Create a test assistant
      const assistant = new Assistant({
        name: 'Test Assistant',
        description: 'Test description',
        isPublic: true,
        specialization: 'crypto',
        createdBy: new mongoose.Types.ObjectId(),
      });
      await assistant.save();

      // Call the service method
      const result = await assistantService.findById(assistant._id);

      // Assert the result
      expect(result).toBeDefined();
      expect(result.name).toBe('Test Assistant');
      expect(result.description).toBe('Test description');
      expect(result.isPublic).toBe(true);
    });

    test('should return null for non-existent assistant', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const result = await assistantService.findById(nonExistentId);
      expect(result).toBeNull();
    });
  });

  describe('hasAccess', () => {
    test('should return true for public assistant', () => {
      const assistant = {
        isPublic: true,
        createdBy: new mongoose.Types.ObjectId(),
      };
      const userId = new mongoose.Types.ObjectId();

      const result = assistantService.hasAccess(assistant, userId);
      expect(result).toBe(true);
    });

    test('should return true for private assistant created by user', () => {
      const userId = new mongoose.Types.ObjectId();
      const assistant = {
        isPublic: false,
        createdBy: userId.toString(),
      };

      const result = assistantService.hasAccess(assistant, userId);
      expect(result).toBe(true);
    });

    test('should return false for private assistant not created by user', () => {
      const userId = new mongoose.Types.ObjectId();
      const creatorId = new mongoose.Types.ObjectId();
      const assistant = {
        isPublic: false,
        createdBy: creatorId.toString(),
      };

      const result = assistantService.hasAccess(assistant, userId);
      expect(result).toBe(false);
    });

    test('should return false for null assistant', () => {
      const userId = new mongoose.Types.ObjectId();
      const result = assistantService.hasAccess(null, userId);
      expect(result).toBe(false);
    });
  });

  describe('createAssistant', () => {
    test('should create a new assistant', async () => {
      const userId = new mongoose.Types.ObjectId();
      const assistantData = {
        name: 'New Assistant',
        description: 'New description',
        isPublic: true,
        specialization: 'defi',
      };

      const result = await assistantService.createAssistant(assistantData, userId);

      expect(result).toBeDefined();
      expect(result.name).toBe('New Assistant');
      expect(result.description).toBe('New description');
      expect(result.isPublic).toBe(true);
      expect(result.specialization).toBe('defi');
      expect(result.createdBy.toString()).toBe(userId.toString());

      // Verify assistant was created in database
      const dbAssistant = await Assistant.findById(result._id);
      expect(dbAssistant).toBeDefined();
      expect(dbAssistant.name).toBe('New Assistant');
    });
  });

  describe('updateAssistant', () => {
    test('should update an existing assistant', async () => {
      const userId = new mongoose.Types.ObjectId();
      const assistant = new Assistant({
        name: 'Original Name',
        description: 'Original description',
        isPublic: false,
        specialization: 'general',
        createdBy: userId,
      });
      await assistant.save();

      const updateData = {
        name: 'Updated Name',
        description: 'Updated description',
        isPublic: true,
      };

      const result = await assistantService.updateAssistant(assistant._id, updateData, userId);

      expect(result).toBeDefined();
      expect(result.name).toBe('Updated Name');
      expect(result.description).toBe('Updated description');
      expect(result.isPublic).toBe(true);
      expect(result.specialization).toBe('general'); // Unchanged
      expect(result.lastModified).toBeDefined();

      // Verify assistant was updated in database
      const dbAssistant = await Assistant.findById(assistant._id);
      expect(dbAssistant.name).toBe('Updated Name');
    });

    test('should throw error if user is not the creator', async () => {
      const creatorId = new mongoose.Types.ObjectId();
      const otherId = new mongoose.Types.ObjectId();
      const assistant = new Assistant({
        name: 'Test Assistant',
        description: 'Test description',
        isPublic: false,
        createdBy: creatorId,
      });
      await assistant.save();

      await expect(assistantService.updateAssistant(
        assistant._id,
        { name: 'Updated Name' },
        otherId
      )).rejects.toThrow('Unauthorized to update this assistant');

      // Verify assistant was not updated
      const dbAssistant = await Assistant.findById(assistant._id);
      expect(dbAssistant.name).toBe('Test Assistant');
    });

    test('should throw error for non-existent assistant', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const userId = new mongoose.Types.ObjectId();

      await expect(assistantService.updateAssistant(
        nonExistentId,
        { name: 'Updated Name' },
        userId
      )).rejects.toThrow('Assistant not found');
    });
  });

  describe('incrementUsageCount', () => {
    test('should increment usage count of assistant', async () => {
      const assistant = new Assistant({
        name: 'Test Assistant',
        description: 'Test description',
        isPublic: true,
        usageCount: 10,
        createdBy: new mongoose.Types.ObjectId(),
      });
      await assistant.save();

      await assistantService.incrementUsageCount(assistant._id);

      const updatedAssistant = await Assistant.findById(assistant._id);
      expect(updatedAssistant.usageCount).toBe(11);
    });

    test('should not throw error for non-existent assistant', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      // This should not throw an error
      await assistantService.incrementUsageCount(nonExistentId);
    });
  });

  describe('listAssistants', () => {
    test('should list all public assistants for anonymous user', async () => {
      // Create some test assistants
      const assistants = [
        {
          name: 'Public Assistant 1',
          description: 'Public description 1',
          isPublic: true,
          specialization: 'crypto',
          createdBy: new mongoose.Types.ObjectId(),
        },
        {
          name: 'Public Assistant 2',
          description: 'Public description 2',
          isPublic: true,
          specialization: 'defi',
          createdBy: new mongoose.Types.ObjectId(),
        },
        {
          name: 'Private Assistant',
          description: 'Private description',
          isPublic: false,
          specialization: 'nft',
          createdBy: new mongoose.Types.ObjectId(),
        },
      ];

      await Assistant.insertMany(assistants);

      const result = await assistantService.listAssistants();

      expect(result).toBeDefined();
      expect(result.length).toBe(2); // Only public assistants
      expect(result.some(a => a.name === 'Public Assistant 1')).toBe(true);
      expect(result.some(a => a.name === 'Public Assistant 2')).toBe(true);
      expect(result.some(a => a.name === 'Private Assistant')).toBe(false);
    });

    test('should list public assistants and user\'s private assistants', async () => {
      const userId = new mongoose.Types.ObjectId();
      const otherUserId = new mongoose.Types.ObjectId();

      // Create some test assistants
      const assistants = [
        {
          name: 'Public Assistant',
          description: 'Public description',
          isPublic: true,
          specialization: 'crypto',
          createdBy: otherUserId,
        },
        {
          name: 'User Private Assistant',
          description: 'User private description',
          isPublic: false,
          specialization: 'defi',
          createdBy: userId,
        },
        {
          name: 'Other Private Assistant',
          description: 'Other private description',
          isPublic: false,
          specialization: 'nft',
          createdBy: otherUserId,
        },
      ];

      await Assistant.insertMany(assistants);

      const result = await assistantService.listAssistants(userId);

      expect(result).toBeDefined();
      expect(result.length).toBe(2); // Public + user's private
      expect(result.some(a => a.name === 'Public Assistant')).toBe(true);
      expect(result.some(a => a.name === 'User Private Assistant')).toBe(true);
      expect(result.some(a => a.name === 'Other Private Assistant')).toBe(false);
    });

    test('should filter assistants by specialization', async () => {
      // Create some test assistants
      const assistants = [
        {
          name: 'Crypto Assistant',
          description: 'Crypto description',
          isPublic: true,
          specialization: 'crypto',
          createdBy: new mongoose.Types.ObjectId(),
        },
        {
          name: 'DeFi Assistant',
          description: 'DeFi description',
          isPublic: true,
          specialization: 'defi',
          createdBy: new mongoose.Types.ObjectId(),
        },
        {
          name: 'NFT Assistant',
          description: 'NFT description',
          isPublic: true,
          specialization: 'nft',
          createdBy: new mongoose.Types.ObjectId(),
        },
      ];

      await Assistant.insertMany(assistants);

      const result = await assistantService.listAssistants(null, { specialization: 'defi' });

      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('DeFi Assistant');
    });
  });
}); 