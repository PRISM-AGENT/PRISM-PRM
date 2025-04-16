# PRISM

<div align="center">
  <img src="public/images/logo.png" alt="PRISM Logo" width="250" />
  <h1>Knowledge-Driven Crypto Asset Advisory Platform</h1>
  <p>Version 1.01</p>
</div>

## 🚀 Overview

PRISM is a knowledge-driven platform that leverages AI technology to provide personalized crypto asset advisory services. By combining high-quality knowledge, advanced AI, and a token-based incentive system, PRISM creates a trusted environment for crypto information and analysis.

## ✨ Features

- **🤖 AI Assistant**: Smart crypto asset advisory powered by contextualized knowledge
- **📚 Knowledge Management**: Collaborative platform for verified crypto information
- **💰 Token Rewards**: Incentivize high-quality contributions with PRM tokens
- **🎯 Personalized Experience**: Custom advisory tuned to your investment style
- **✅ Verified Information**: Transparent source attribution and community validation

## 🏗️ Architecture

PRISM follows a modern microservices architecture with a clear separation between the frontend client and backend services. The system is designed to be scalable, maintainable, and secure.

```
┌─────────────────┐      ┌──────────────────────────────┐
│                 │      │                              │
│   React Client  │◄────►│   Express.js API Server      │
│                 │      │                              │
└─────────────────┘      └───────────────┬──────────────┘
                                         │
                                         ▼
                         ┌──────────────────────────────┐
                         │                              │
                         │       MongoDB Database       │
                         │                              │
                         └───────────────┬──────────────┘
                                         │
                         ┌───────────────▼──────────────┐
                         │                              │
                         │   External AI/LLM Services   │
                         │                              │
                         └──────────────────────────────┘
```

### Core Components

- **🖥️ Frontend**: React-based SPA with Chakra UI for responsive design
- **🔄 API Layer**: Express.js RESTful API server with middleware-based architecture
- **💾 Data Layer**: MongoDB for flexible document storage with Mongoose ODM
- **🔐 Authentication**: JWT-based authentication system with secure token handling
- **🌐 AI Integration**: Custom AI assistants with domain-specific knowledge bases

## 🛠️ Tech Stack

- **Frontend**: 
  - React 18.x
  - Chakra UI for component library
  - React Router for navigation
  - Context API for state management

- **Backend**: 
  - Node.js 18.x
  - Express.js for API framework
  - MongoDB for database
  - Mongoose for ODM
  - JWT for authentication

- **Testing**:
  - Jest for unit testing
  - SuperTest for API testing
  - MongoDB Memory Server for test database

- **DevOps**:
  - Git for version control
  - GitHub Actions for CI/CD
  - Docker for containerization

## 📊 Data Flow

The platform follows a comprehensive data flow pattern that ensures efficient processing and security:

```
┌──────────┐     ┌──────────┐     ┌───────────┐     ┌─────────────┐
│          │     │          │     │           │     │             │
│  Client  │────►│  Routes  │────►│Controllers│────►│  Services   │
│          │     │          │     │           │     │             │
└──────────┘     └──────────┘     └───────────┘     └──────┬──────┘
                                                           │
┌──────────┐     ┌──────────┐     ┌───────────┐     ┌──────▼──────┐
│          │     │          │     │           │     │             │
│  Client  │◄────│ Response │◄────│  Utils    │◄────│   Models    │
│          │     │          │     │           │     │             │
└──────────┘     └──────────┘     └───────────┘     └─────────────┘
```

1. **📥 Request Processing**: Client requests are processed through middleware for validation and authentication
2. **🔍 Controller Logic**: Controllers parse requests and delegate business logic to service layers
3. **⚙️ Service Layer**: Services implement business logic and interact with data models
4. **📤 Response Formatting**: Standardized response utilities provide consistent API responses

## 🗂️ Project Structure

```
PRISM/
├── public/               # Static files
│   └── images/           # Images and assets
│
├── src/                  # Frontend React application
│   ├── components/       # UI components
│   ├── context/          # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── services/         # API client services
│   ├── styles/           # CSS and styling
│   ├── utils/            # Utility functions
│   ├── App.js            # Main React component
│   └── index.js          # Entry point
│
├── server/               # Backend application
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── tokenController.js
│   │   └── assistantController.js
│   ├── middleware/       # Express middleware
│   │   ├── authMiddleware.js
│   │   ├── validationMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/           # MongoDB models
│   ├── routes/           # API route definitions
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── tokenRoutes.js
│   │   └── assistantRoutes.js
│   ├── services/         # Business logic layer
│   │   ├── userService.js
│   │   ├── tokenService.js
│   │   └── assistantService.js
│   ├── utils/            # Utility functions
│   │   └── responseUtil.js
│   ├── app.js            # Express application setup
│   └── index.js          # Server entry point
│
├── tests/                # Test files
│   ├── integration/      # Integration tests
│   │   ├── authApi.test.js
│   │   ├── authRoutes.test.js
│   │   └── assistantApi.test.js
│   ├── services/         # Service tests
│   │   └── assistantService.test.js
│   └── utils/            # Test utilities
│       ├── testDb.js
│       └── userTestUtil.js
│
├── docs/                 # Documentation
├── .env                  # Environment variables
├── .gitignore            # Git ignore file
├── LICENSE               # License file
├── package.json          # Project dependencies
└── README.md             # Project documentation
```

## 🔄 API Endpoints

### Authentication API

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user info

### Assistant API

- `POST /api/assistant/query` - Query an AI assistant
- `POST /api/assistant/create` - Create a new assistant
- `GET /api/assistant/list` - List available assistants
- `PUT /api/assistant/:id` - Update an assistant

### Token API

- `GET /api/tokens` - Get token info for authenticated user
- `POST /api/tokens/airdrop` - Request token airdrop
- `POST /api/tokens/transfer` - Transfer tokens to another user

### User API

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## 🔍 Key Implementation Details

### 🛡️ Authentication Flow

```
┌──────────┐     ┌──────────┐     ┌───────────┐     ┌─────────────┐
│          │     │          │     │           │     │             │
│  Client  │────►│Login API │────►│Verify User│────►│ Create JWT  │
│          │     │          │     │           │     │             │
└──────────┘     └──────────┘     └───────────┘     └──────┬──────┘
       ▲                                                    │
       │                                                    │
       │                                                    │
       └────────────────────────────────────────────────────┘
                            JWT Token
```

1. User submits credentials to the authentication endpoint
2. Server validates credentials against the stored (hashed) password
3. Upon success, a JWT token is generated and returned to the client
4. The client stores the token and includes it in subsequent request headers
5. Protected routes use the auth middleware to verify token validity

### 📱 Assistant Interaction

```
┌──────────┐     ┌───────────────┐     ┌──────────────┐
│          │     │               │     │              │
│  Client  │────►│ Assistant API │────►│Access Control│
│          │     │               │     │              │
└──────────┘     └───────────────┘     └──────┬───────┘
       ▲                                       │
       │                                       ▼
       │                               ┌───────────────┐
       │                               │               │
       │                               │AI Query Engine│
       │                               │               │
       │                               └───────┬───────┘
       │                                       │
       └───────────────────────────────────────┘
                     Response
```

1. User sends a query to a specific assistant
2. System checks user access rights for the requested assistant
3. The assistant's specialized knowledge base is utilized to generate a response
4. Usage statistics are updated and the response is returned to the client

### 🪙 Token System

```
┌──────────┐     ┌───────────────┐     ┌──────────────┐
│          │     │               │     │              │
│  Client  │────►│   Token API   │────►│Token Service │
│          │     │               │     │              │
└──────────┘     └───────────────┘     └──────┬───────┘
       ▲                                       │
       │                                       ▼
       │                               ┌───────────────┐
       │                               │               │
       │                               │ Token Model   │
       │                               │               │
       │                               └───────────────┘
       │                                       │
       └───────────────────────────────────────┘
                 Updated Balance
```

## 🧪 Testing Architecture

PRISM implements a robust testing strategy using modern testing frameworks and approaches:

### 🔬 Test Categories

- **Integration Tests**: Test complete API flows from HTTP request to database operations
- **Service Tests**: Focus on business logic in isolation with mocked dependencies
- **Utility Tests**: Ensure helper functions work correctly

### 🛠️ Testing Tools

- **Jest**: Primary test framework for running tests and assertions
- **SuperTest**: HTTP assertion library for API testing
- **MongoDB Memory Server**: In-memory MongoDB for isolated database testing

### 📊 Test Coverage Goals

- **Controllers**: 90%+ coverage for all API endpoints
- **Services**: 95%+ coverage for business logic
- **Models**: 80%+ coverage for database operations
- **Utilities**: 100% coverage for helper functions

### 🔄 Test Workflow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│              │     │              │     │              │
│ Setup Test DB│────►│Execute Tests │────►│ Clean Up DB  │
│              │     │              │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
```

1. Before tests run, the test utilities set up an isolated MongoDB instance
2. Tests are executed against this isolated database
3. After tests, the database is cleaned or destroyed

### 📝 Test Examples

**Integration Test (API Endpoint)**:
```javascript
it('should register a new user successfully', async () => {
  const userData = {
    username: 'newuser',
    email: 'newuser@example.com',
    password: 'Password123!'
  };

  const response = await request(app)
    .post('/api/auth/register')
    .send(userData);

  expect(response.status).toBe(201);
  expect(response.body.success).toBe(true);
  expect(response.body.data).toHaveProperty('token');
});
```

**Service Test (Business Logic)**:
```javascript
test('should create a new assistant', async () => {
  const userId = new mongoose.Types.ObjectId();
  const assistantData = {
    name: 'New Assistant',
    description: 'New description',
    isPublic: true
  };

  const result = await assistantService.createAssistant(assistantData, userId);

  expect(result).toBeDefined();
  expect(result.name).toBe('New Assistant');
  expect(result.createdBy.toString()).toBe(userId.toString());
});
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14.x or higher)
- MongoDB (v4.x or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/PRISM-AGENT/PRISM.git
   cd PRISM
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Run frontend tests
npm run test:client
```

## 🛣️ Roadmap

### Phase One: Core Platform (Q2-Q3 2025)
- Basic AI Q&A functionality
- Knowledge management system
- User experience optimization

### Phase Two: Token Economy (Q4 2025)
- Token system implementation
- Knowledge marketplace
- Community governance

### Phase Three: Ecosystem Expansion (Q1-Q2 2026)
- API and developer tools
- Cross-chain asset integration
- Enterprise solutions

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔗 Links

- Website: [https://www.prismn.xyz/](https://www.prismn.xyz/)
- Twitter: [@PRI_SM_AI](https://x.com/PRI_SM_AI)
- GitHub: [PRISM-AGENT/PRISM](https://github.com/PRISM-AGENT/PRISM)

## 🔌 Core Modules and Interactions

PRISM is organized into several key functional modules that work together:

### 🔐 Authentication Module

The authentication module handles user registration, login, and session management:

- **Components**: `authController`, `authMiddleware`, `userService`
- **Key Files**: 
  - `server/controllers/authController.js`
  - `server/middleware/authMiddleware.js` 
  - `server/routes/authRoutes.js`

The authentication flow utilizes JWT tokens with middleware validation for protected routes, ensuring secure access to the platform's features.

### 👤 User Management Module

This module manages user profiles, preferences, and account settings:

- **Components**: `userController`, `userService`, `User model`
- **Key Files**: 
  - `server/controllers/userController.js`
  - `server/services/userService.js`
  - `server/models/User.js`

User data is stored in MongoDB, with a service layer that encapsulates all business logic related to user operations.

### 🤖 Assistant Module

The AI assistant module provides the core advisory functionality:

- **Components**: `assistantController`, `assistantService`, `Assistant model`
- **Key Files**:
  - `server/controllers/assistantController.js`
  - `server/services/assistantService.js`
  - `server/models/Assistant.js`

This module implements the AI query processing, permission checks for private assistants, and usage tracking.

### 💰 Token System Module

The token module handles the platform's internal token economy:

- **Components**: `tokenController`, `tokenService`, `Token model`
- **Key Files**:
  - `server/controllers/tokenController.js`
  - `server/services/tokenService.js`
  - `server/models/Token.js`

This includes token balance management, airdrop functionality, and token transfers between users.

### 🛡️ Middleware Layer

A comprehensive middleware layer provides cross-cutting concerns:

- **Validation**: Input validation for all API endpoints
- **Error Handling**: Centralized error processing and standardized responses
- **Authentication**: JWT verification and user context extraction

### ⚙️ Module Interactions

The modules interact through well-defined interfaces:

1. The **Authentication Module** provides user identity to all other modules
2. The **User Module** manages profile data used by Assistants and Token modules
3. The **Assistant Module** records usage that affects the Token Module
4. The **Token Module** tracks balances that can unlock features across modules

Each module follows a consistent architecture pattern with:
- Controllers handling HTTP requests and responses
- Services implementing business logic
- Models defining data structures and database operations 

## 🔒 Security Design

PRISM implements multiple layers of security to protect user data and system integrity:

### 🛡️ Authentication & Authorization

- **Secure Password Handling**: Passwords are hashed using bcrypt with salt rounds
- **JWT Authentication**: JSON Web Tokens with appropriate expiration times
- **Role-Based Access Control**: Different permission levels for users and admins

### 🔐 API Security

- **Input Validation**: Comprehensive validation middleware for all endpoints
- **CORS Configuration**: Properly configured Cross-Origin Resource Sharing
- **Rate Limiting**: Protection against brute force and DoS attacks

### 🛑 Error Handling & Logging

- **Sanitized Error Responses**: Errors are filtered to avoid leaking sensitive information
- **Centralized Error Processing**: Consistent error handling across the application
- **Secure Logging**: Sensitive data is redacted from logs

### 🔒 Data Protection

- **Data Validation**: Schema-level validation for all database operations
- **Parameterized Queries**: Protection against injection attacks
- **Data Encryption**: Sensitive fields can be encrypted at rest

## ⚡ Performance Optimizations

PRISM includes various optimizations to ensure high performance even under load:

### 🚀 Database Performance

- **Indexing Strategy**: MongoDB indexes on frequently queried fields
- **Query Optimization**: Efficient queries with field projection
- **Connection Pooling**: Reuse database connections for better throughput

### 🔄 Caching

- **Response Caching**: Cache common responses to reduce database load
- **AI Response Caching**: Similar queries to assistants can leverage cached responses
- **Session Caching**: Efficient session management with Redis (planned)

### 📦 Code Optimizations

- **Asynchronous Processing**: Non-blocking I/O operations throughout the system
- **Modular Architecture**: Enables easy scaling of specific components
- **Service Layer**: Reusable business logic reduces code duplication

### 📊 Performance Monitoring

- **Request Timing**: Track API request execution times
- **Resource Utilization**: Monitor memory and CPU usage
- **Error Rates**: Track error occurrences and patterns 

## 📈 Scalability Strategy

PRISM is designed with scalability in mind to handle growing user bases and increasing demands:

### 🔄 Horizontal Scaling

- **Stateless API Design**: Enables adding more server instances behind a load balancer
- **Microservices Potential**: Architecture supports future splitting into microservices
- **Database Sharding**: MongoDB can be sharded for distributed data storage

### 🔀 Load Balancing

- **API Load Distribution**: Round-robin or dynamic load balancing across instances
- **Database Read Replicas**: Distribute read operations across database replicas
- **Static Asset CDN**: Deliver static content through Content Delivery Networks

### 📦 Containerization

- **Docker Containers**: Application components packaged as Docker containers
- **Container Orchestration**: Kubernetes support for advanced deployment scenarios
- **Autoscaling**: Dynamic scaling based on load metrics

### 🌐 Global Distribution

- **Multi-Region Deployment**: Strategic geographic distribution of resources
- **Data Replication**: Regional data replication for lower latency
- **Edge Computing**: Push computation closer to users when possible

## 🚢 Deployment Pipeline

The PRISM deployment strategy employs modern DevOps practices for reliable releases:

```
┌─────────────┐    ┌──────────┐    ┌───────────┐    ┌──────────┐    ┌──────────┐
│             │    │          │    │           │    │          │    │          │
│  Git Push   │───►│  CI/CD   │───►│ Automated │───►│ Staging  │───►│Production│
│             │    │  System  │    │  Testing  │    │ Deploy   │    │ Deploy   │
└─────────────┘    └──────────┘    └───────────┘    └──────────┘    └──────────┘
```

### 🚀 Deployment Environments

- **Development**: Local environment for developers
- **Testing**: Isolated environment for QA and testing
- **Staging**: Production-like environment for final verification
- **Production**: Live environment for end users

### 🔄 Continuous Integration/Deployment

- **Automated Testing**: Run tests on every code change
- **Code Quality Checks**: Static analysis and linting
- **Deployment Automation**: Zero-downtime deployments
- **Rollback Capability**: Quick recovery from problematic deployments

### 📊 Monitoring & Observability

- **Health Checks**: Regular verification of system components
- **Performance Metrics**: Track key performance indicators
- **Error Tracking**: Aggregated logging and error reporting
- **Usage Analytics**: Monitor user activity and system utilization 