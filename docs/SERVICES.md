# ⚙️ PRISM Services

## Introduction

PRISM implements a robust service layer that encapsulates all business logic and provides clean interfaces for controllers. This document details the design, implementation, and usage of services in the PRISM architecture.

## Service Layer Principles

Our service layer is built on the following core principles:

1. **Separation of Concerns** - Separating business logic from controllers and data access
2. **Single Responsibility** - Each service focuses on a specific domain
3. **Reusability** - Business logic can be reused across different controllers
4. **Testability** - Services can be tested in isolation with mocked dependencies
5. **Maintainability** - Changes to business logic are localized to specific services

## Core Services

### User Service

The User Service manages all user-related operations and abstracts the user data model.

**Key Responsibilities:**
- User creation and registration
- User authentication and JWT token generation
- User profile retrieval and updates
- Password management

**Key Methods:**
- `findById(id)` - Find user by ID, excludes password
- `findByEmail(email)` - Find user by email address
- `createUser(userData)` - Create a new user
- `authenticate(email, password)` - Authenticate user and generate token
- `updateUser(userId, updateData)` - Update user profile
- `changePassword(userId, currentPassword, newPassword)` - Change user password

**Example Usage:**
```javascript
// In a controller:
const user = await userService.findById(req.userId);
if (!user) {
  return responseUtil.error(res, 404, 'User not found');
}
```

### Token Service

The Token Service handles all operations related to the PRM token, including balance management and transactions.

**Key Responsibilities:**
- Retrieving token balances and transaction history
- Processing token airdrops
- Managing token transfers between users
- Maintaining transaction records

**Key Methods:**
- `getTokenInfo(userId)` - Get token information for a user
- `processAirdrop(userId, walletAddress, amount, description)` - Process token airdrop
- `transferTokens(fromUserId, toUserId, amount, description)` - Transfer tokens between users

**Example Usage:**
```javascript
// In a controller:
const result = await tokenService.processAirdrop(
  userId,
  walletAddress,
  100,
  'Welcome bonus airdrop'
);
```

### Assistant Service

The Assistant Service manages AI assistants, their creation, and query processing.

**Key Responsibilities:**
- Assistant creation and configuration
- Processing user queries
- Managing assistant access controls
- Tracking assistant usage

**Key Methods:**
- `findById(assistantId)` - Find assistant by ID
- `hasAccess(assistant, userId)` - Check if user has access to an assistant
- `createAssistant(assistantData, userId)` - Create a new assistant
- `updateAssistant(assistantId, updateData, userId)` - Update assistant configuration
- `listAssistants(userId, filters)` - List assistants with access control
- `incrementUsageCount(assistantId)` - Track assistant usage

## Service Implementation Pattern

Each service follows a consistent implementation pattern:

1. **Module Structure**
   ```javascript
   /**
    * Service Name
    * Brief description of the service
    */
   
   // Import dependencies
   const Model = require('../models/Model');
   
   // Export methods
   exports.methodName = async (param1, param2) => {
     try {
       // Business logic implementation
       return result;
     } catch (error) {
       console.error('Error message:', error);
       throw error;
     }
   };
   ```

2. **Error Handling**
   - Wrap operations in try/catch blocks
   - Log errors with detailed information
   - Re-throw errors for controller-level handling
   - For expected failures, return structured error objects

3. **Validation**
   - Validate parameters before accessing database
   - Check for existence of related entities
   - Verify permissions and access rights

4. **Consistent Returns**
   - Success responses contain expected data
   - Error responses include meaningful messages
   - Complex operations return structured objects

## Service Dependencies

Services may depend on:

1. **Models** - For data access
2. **Other Services** - For related business logic
3. **Utilities** - For common functions
4. **External APIs** - For third-party integrations

## Transactions and Data Integrity

For operations that modify multiple records:

1. Use MongoDB transactions when possible
2. Implement compensating operations for failure scenarios
3. Log all steps of complex operations
4. Use unique constraints and indexes at the database level

## Testing Services

Services are designed to be testable with both:

1. **Unit Tests** - Testing isolated methods with mocked dependencies
2. **Integration Tests** - Testing interaction with real database

Example test structure:
```javascript
// Unit test example
describe('User Service', () => {
  describe('authenticate', () => {
    it('should return success with valid credentials', async () => {
      // Mock dependencies and test
    });
    
    it('should return error with invalid password', async () => {
      // Mock dependencies and test
    });
  });
});
```

## Service Layer Evolution

The service layer is designed to evolve with the application:

1. **New Capabilities**
   - Add new methods to existing services
   - Create new services for new domains

2. **Performance Optimization**
   - Add caching for frequently used data
   - Implement pagination for large result sets
   - Optimize database queries

3. **Scaling**
   - Split large services into more focused ones
   - Prepare for microservice architecture 