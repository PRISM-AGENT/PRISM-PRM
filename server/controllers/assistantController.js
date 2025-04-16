/**
 * Assistant Controller
 * Handles AI assistant operations
 */

const { responseUtil } = require('../utils');
const { assistantService } = require('../services');

// Mock data for demo
const assistants = [
  {
    id: '1',
    name: 'Crypto Analyst',
    description: 'Specialized in cryptocurrency market analysis and trends',
    creator: 'PRISM Team',
    category: 'Market Analysis',
    isVerified: true,
    rating: 4.8,
    usageCount: 12045
  },
  {
    id: '2',
    name: 'DeFi Expert',
    description: 'Focused on decentralized finance protocols and strategies',
    creator: 'PRISM Team',
    category: 'DeFi',
    isVerified: true,
    rating: 4.7,
    usageCount: 8932
  },
  {
    id: '3',
    name: 'NFT Guide',
    description: 'Knowledge base about NFT markets, creation, and trading',
    creator: 'PRISM Team',
    category: 'NFTs',
    isVerified: true,
    rating: 4.5,
    usageCount: 7281
  }
];

// Demo knowledge base for mock responses
const knowledgeBase = {
  'bitcoin': 'Bitcoin (BTC) is the first and most valuable cryptocurrency, created in 2009 by an anonymous person or group known as Satoshi Nakamoto. It operates on a proof-of-work consensus mechanism and has a maximum supply of 21 million coins.',
  'ethereum': 'Ethereum (ETH) is a programmable blockchain that enables the creation of smart contracts and decentralized applications (dApps). It was proposed by Vitalik Buterin in 2013 and launched in 2015. Ethereum has transitioned from proof-of-work to proof-of-stake consensus with "The Merge" upgrade.',
  'blockchain': 'Blockchain is a distributed ledger technology that enables secure, transparent, and immutable record-keeping across a network of computers. It forms the foundation of most cryptocurrencies and decentralized applications (dApps).',
  'defi': 'DeFi (Decentralized Finance) refers to financial services built on blockchain technology that aim to recreate and improve traditional financial systems in a decentralized manner. Key DeFi components include lending protocols, decentralized exchanges (DEXs), yield farming, and stablecoins.',
  'nft': 'NFTs (Non-Fungible Tokens) are unique digital assets that represent ownership of specific items on a blockchain. Unlike cryptocurrencies, each NFT has distinct properties and cannot be exchanged on a 1:1 basis. NFTs are commonly used for digital art, collectibles, gaming items, and virtual real estate.',
  'staking': 'Staking involves locking up cryptocurrency to support network operations in proof-of-stake blockchains. Stakers are typically rewarded with additional tokens, similar to interest. It\'s generally more energy-efficient than proof-of-work mining.',
  'dao': 'DAO (Decentralized Autonomous Organization) is an organization represented by rules encoded in a transparent computer program, controlled by organization members, and not influenced by a central government. DAOs use smart contracts to enforce rules and execute organizational decisions.',
  'layer2': 'Layer 2 solutions are scaling solutions built on top of existing blockchains (like Ethereum) to improve transaction speed and reduce costs. Examples include Optimistic Rollups, ZK-Rollups, Sidechains, and State Channels.',
};

/**
 * Assistant Controller
 * Handles AI assistant operations
 */
const assistantController = {
  /**
   * Query an AI assistant
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  queryAssistant: async (req, res) => {
    try {
      const { query, assistantId } = req.body;
      
      if (!query) {
        return responseUtil.error(res, 400, 'Query is required');
      }
      
      // If assistantId is provided, find that assistant
      if (assistantId) {
        const assistant = await assistantService.findById(assistantId);
        
        if (!assistant) {
          return responseUtil.error(res, 404, 'Assistant not found');
        }
        
        // Check if user has access to this assistant
        const hasAccess = assistantService.hasAccess(assistant, req.userId);
        if (!hasAccess) {
          return responseUtil.error(res, 403, 'Access denied to this assistant');
        }
        
        // Increment usage count (non-blocking)
        assistantService.incrementUsageCount(assistantId);
        
        // TODO: Implement actual AI query processing using the assistant's configuration
        // For now, return a mock response
        const mockResponse = {
          text: generateMockResponse(query, assistant.specialization),
          source: assistant.name,
          timestamp: new Date()
        };
        
        return responseUtil.success(res, 200, 'Query processed successfully', {
          response: mockResponse
        });
      } else {
        // No assistant specified, use general assistant
        // TODO: Implement actual AI query processing
        // For now, return a mock response
        const mockResponse = {
          text: generateMockResponse(query),
          source: 'General Assistant',
          timestamp: new Date()
        };
        
        return responseUtil.success(res, 200, 'Query processed successfully', {
          response: mockResponse
        });
      }
    } catch (error) {
      console.error('Error in queryAssistant controller:', error);
      return responseUtil.error(res, 500, 'Server error', error);
    }
  },
  
  /**
   * Create a new AI assistant
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  createAssistant: async (req, res) => {
    try {
      const { name, description, isPublic, specialization, context, knowledgeBase } = req.body;
      
      if (!name || !description) {
        return responseUtil.error(res, 400, 'Name and description are required');
      }
      
      // Check if user is authenticated
      if (!req.userId) {
        return responseUtil.error(res, 401, 'Authentication required');
      }
      
      // Create new assistant using the service
      const assistantData = {
        name,
        description,
        isPublic: isPublic || false,
        specialization: specialization || 'general',
        context: context || '',
        knowledgeBase: knowledgeBase || []
      };
      
      const assistant = await assistantService.createAssistant(assistantData, req.userId);
      
      return responseUtil.success(res, 201, 'Assistant created successfully', {
        assistant
      });
    } catch (error) {
      console.error('Error in createAssistant controller:', error);
      return responseUtil.error(res, 500, 'Server error', error);
    }
  },
  
  /**
   * List available assistants
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  listAssistants: async (req, res) => {
    try {
      // Get filters from query parameters
      const filters = {};
      if (req.query.specialization) {
        filters.specialization = req.query.specialization;
      }
      
      // Get assistants using the service
      const assistants = await assistantService.listAssistants(req.userId, filters);
      
      return responseUtil.success(res, 200, 'Assistants retrieved successfully', {
        assistants
      });
    } catch (error) {
      console.error('Error in listAssistants controller:', error);
      return responseUtil.error(res, 500, 'Server error', error);
    }
  },
  
  /**
   * Update an existing assistant
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  updateAssistant: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      if (!id) {
        return responseUtil.error(res, 400, 'Assistant ID is required');
      }
      
      // Check if user is authenticated
      if (!req.userId) {
        return responseUtil.error(res, 401, 'Authentication required');
      }
      
      try {
        // Update assistant using the service
        const assistant = await assistantService.updateAssistant(id, updateData, req.userId);
        
        return responseUtil.success(res, 200, 'Assistant updated successfully', {
          assistant
        });
      } catch (error) {
        // Handle specific errors
        if (error.message === 'Assistant not found') {
          return responseUtil.error(res, 404, 'Assistant not found');
        }
        
        if (error.message === 'Unauthorized to update this assistant') {
          return responseUtil.error(res, 403, 'You do not have permission to update this assistant');
        }
        
        throw error;
      }
    } catch (error) {
      console.error('Error in updateAssistant controller:', error);
      return responseUtil.error(res, 500, 'Server error', error);
    }
  }
};

/**
 * Generate a mock response based on the query and specialization
 * @param {string} query - User query
 * @param {string} specialization - Assistant specialization
 * @returns {string} Mock response
 */
function generateMockResponse(query, specialization = 'general') {
  // Convert query to lowercase for matching
  const lowercaseQuery = query.toLowerCase();
  
  // Check if query contains any keywords from knowledge base
  for (const [keyword, info] of Object.entries(knowledgeBase)) {
    if (lowercaseQuery.includes(keyword)) {
      return info;
    }
  }
  
  // Default responses based on specialization
  const responses = {
    'crypto': `This is a mock response from a crypto specialist assistant. Your query was: "${query}"`,
    'defi': `This is a mock response from a DeFi specialist assistant. Your query was: "${query}"`,
    'nft': `This is a mock response from an NFT specialist assistant. Your query was: "${query}"`,
    'general': `This is a mock response from a general assistant. Your query was: "${query}"`
  };
  
  return responses[specialization] || responses.general;
}

module.exports = assistantController; 