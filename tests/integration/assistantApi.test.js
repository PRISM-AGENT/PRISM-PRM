/**
 * Assistant API Integration Tests
 */

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../server/app');
const User = require('../../server/models/User');
const Assistant = require('../../server/models/Assistant');
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

// Clear assistants collection between tests
beforeEach(async () => {
  await Assistant.deleteMany({});
});

describe('Assistant API', () => {
  describe('POST /api/assistant/create', () => {
    test('should create a new assistant', async () => {
      const response = await request(app)
        .post('/api/assistant/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Assistant',
          description: 'Test description',
          isPublic: true,
          specialization: 'crypto',
        });
        
      expect(response.status).toBe(201);
      expect(response.body.message).toContain('created successfully');
      expect(response.body.assistant).toBeDefined();
      expect(response.body.assistant.name).toBe('Test Assistant');
      expect(response.body.assistant.createdBy.toString()).toBe(testUser._id.toString());

      // Verify assistant was created in database
      const assistantId = response.body.assistant._id;
      const dbAssistant = await Assistant.findById(assistantId);
      expect(dbAssistant).toBeDefined();
      expect(dbAssistant.name).toBe('Test Assistant');
    });

    test('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/assistant/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          // Missing name and description
          isPublic: true,
          specialization: 'crypto',
        });
        
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('required');
    });

    test('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .post('/api/assistant/create')
        .send({
          name: 'Test Assistant',
          description: 'Test description',
        });
        
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/assistant/list', () => {
    beforeEach(async () => {
      // Create some test assistants
      const assistants = [
        {
          name: 'Public Assistant',
          description: 'Public description',
          isPublic: true,
          specialization: 'crypto',
          createdBy: testUser._id,
        },
        {
          name: 'Private Assistant',
          description: 'Private description',
          isPublic: false,
          specialization: 'defi',
          createdBy: testUser._id,
        },
        {
          name: 'Other Public Assistant',
          description: 'Other public description',
          isPublic: true,
          specialization: 'nft',
          createdBy: new mongoose.Types.ObjectId(),
        },
        {
          name: 'Other Private Assistant',
          description: 'Other private description',
          isPublic: false,
          specialization: 'general',
          createdBy: new mongoose.Types.ObjectId(),
        },
      ];

      await Assistant.insertMany(assistants);
    });

    test('should list public assistants for unauthenticated user', async () => {
      const response = await request(app)
        .get('/api/assistant/list');
        
      expect(response.status).toBe(200);
      expect(response.body.assistants).toBeDefined();
      expect(response.body.assistants.length).toBe(2); // Only public assistants
      
      // Check public assistants are included
      const assistantNames = response.body.assistants.map(a => a.name);
      expect(assistantNames).toContain('Public Assistant');
      expect(assistantNames).toContain('Other Public Assistant');
      
      // Check private assistants are excluded
      expect(assistantNames).not.toContain('Private Assistant');
      expect(assistantNames).not.toContain('Other Private Assistant');
    });

    test('should list public assistants and user\'s private assistants for authenticated user', async () => {
      const response = await request(app)
        .get('/api/assistant/list')
        .set('Authorization', `Bearer ${authToken}`);
        
      expect(response.status).toBe(200);
      expect(response.body.assistants).toBeDefined();
      expect(response.body.assistants.length).toBe(3); // Public + user's private
      
      // Check public assistants and user's private assistants are included
      const assistantNames = response.body.assistants.map(a => a.name);
      expect(assistantNames).toContain('Public Assistant');
      expect(assistantNames).toContain('Other Public Assistant');
      expect(assistantNames).toContain('Private Assistant');
      
      // Check other private assistants are excluded
      expect(assistantNames).not.toContain('Other Private Assistant');
    });
  });

  describe('POST /api/assistant/query', () => {
    let publicAssistant;
    let privateAssistant;
    let otherPrivateAssistant;

    beforeEach(async () => {
      // Create test assistants
      publicAssistant = new Assistant({
        name: 'Public Assistant',
        description: 'Public description',
        isPublic: true,
        usageCount: 0,
        createdBy: testUser._id,
      });

      privateAssistant = new Assistant({
        name: 'Private Assistant',
        description: 'Private description',
        isPublic: false,
        usageCount: 0,
        createdBy: testUser._id,
      });

      otherPrivateAssistant = new Assistant({
        name: 'Other Private Assistant',
        description: 'Other private description',
        isPublic: false,
        usageCount: 0,
        createdBy: new mongoose.Types.ObjectId(),
      });

      await Promise.all([
        publicAssistant.save(),
        privateAssistant.save(),
        otherPrivateAssistant.save(),
      ]);
    });

    test('should query public assistant successfully', async () => {
      const response = await request(app)
        .post('/api/assistant/query')
        .send({
          query: 'Test query',
          assistantId: publicAssistant._id.toString(),
        });
        
      expect(response.status).toBe(200);
      expect(response.body.message).toContain('Query processed successfully');
      expect(response.body.response).toBeDefined();
      expect(response.body.response.text).toBeDefined();
      
      // Check usage count was incremented
      const updatedAssistant = await Assistant.findById(publicAssistant._id);
      expect(updatedAssistant.usageCount).toBe(1);
    });

    test('should query private assistant when authenticated as owner', async () => {
      const response = await request(app)
        .post('/api/assistant/query')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: 'Test query',
          assistantId: privateAssistant._id.toString(),
        });
        
      expect(response.status).toBe(200);
      expect(response.body.message).toContain('Query processed successfully');
      
      // Check usage count was incremented
      const updatedAssistant = await Assistant.findById(privateAssistant._id);
      expect(updatedAssistant.usageCount).toBe(1);
    });

    test('should return 403 for private assistant when not authenticated as owner', async () => {
      const response = await request(app)
        .post('/api/assistant/query')
        .send({
          query: 'Test query',
          assistantId: privateAssistant._id.toString(),
        });
        
      expect(response.status).toBe(403);
      expect(response.body.message).toContain('Access denied');
      
      // Check usage count was not incremented
      const updatedAssistant = await Assistant.findById(privateAssistant._id);
      expect(updatedAssistant.usageCount).toBe(0);
    });

    test('should return 403 for other\'s private assistant even when authenticated', async () => {
      const response = await request(app)
        .post('/api/assistant/query')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: 'Test query',
          assistantId: otherPrivateAssistant._id.toString(),
        });
        
      expect(response.status).toBe(403);
      expect(response.body.message).toContain('Access denied');
      
      // Check usage count was not incremented
      const updatedAssistant = await Assistant.findById(otherPrivateAssistant._id);
      expect(updatedAssistant.usageCount).toBe(0);
    });

    test('should return 400 if query is missing', async () => {
      const response = await request(app)
        .post('/api/assistant/query')
        .send({
          assistantId: publicAssistant._id.toString(),
          // Missing query
        });
        
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Query is required');
    });

    test('should return 404 if assistant does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .post('/api/assistant/query')
        .send({
          query: 'Test query',
          assistantId: nonExistentId.toString(),
        });
        
      expect(response.status).toBe(404);
      expect(response.body.message).toContain('Assistant not found');
    });
  });
}); 