# 🏗️ PRISM Architecture

## Overview

PRISM follows a layered architecture design that separates concerns and provides a clean structure for the application. This document outlines the key architectural decisions and patterns implemented in the system.

## Architecture Layers

The backend architecture is structured into the following layers:

1. **Route Layer** - Handles HTTP requests and routes them to the appropriate controllers
2. **Controller Layer** - Processes incoming requests and returns responses
3. **Service Layer** - Contains business logic and domain-specific operations
4. **Data Access Layer** - Manages interactions with the database using models

```
┌────────────────┐
│  Route Layer   │
└────────┬───────┘
         │
         ▼
┌────────────────┐
│ Controller Layer│
└────────┬───────┘
         │
         ▼
┌────────────────┐
│  Service Layer  │
└────────┬───────┘
         │
         ▼
┌────────────────┐
│Data Access Layer│
└────────────────┘
```

## Service Layer Architecture

The service layer is a key component of the PRISM architecture. It:

- Encapsulates all business logic
- Provides a clean API for controllers
- Acts as an abstraction over the data access layer
- Handles complex operations that span multiple models

### Core Services

PRISM implements the following core services:

#### User Service

Handles user-related business logic:
- User authentication
- User registration
- Profile management
- Password management

#### Token Service

Manages PRM token operations:
- Token balance retrieval
- Airdrop processing
- Token transfers between users
- Transaction history

#### Assistant Service

Provides AI assistant functionality:
- Assistant creation and management
- Query processing
- Knowledge base integration

## Request Flow

A typical request in PRISM follows this flow:

1. Client sends HTTP request to a route
2. Route middleware processes the request (authentication, validation)
3. Route handler delegates to the appropriate controller method
4. Controller calls one or more service methods to execute business logic
5. Service methods perform operations using models
6. Service returns data/results to controller
7. Controller formats the response and sends it back to the client

## Authentication Flow

The authentication mechanism uses JWT tokens:

1. User credentials are validated by the Auth Controller
2. Auth Controller uses User Service to authenticate
3. On successful authentication, a JWT token is generated
4. Token is returned to client and stored locally
5. For subsequent requests, token is included in the Authorization header
6. Auth middleware validates the token and extracts user ID
7. User ID is added to the request object for use in controllers

## Data Models

The primary data models in PRISM are:

- **User** - Stores user information and authentication details
- **Token** - Manages token balances and transaction history
- **Assistant** - Defines AI assistant configurations
- **Knowledge** - Stores knowledge base entries

## Error Handling

PRISM implements a centralized error handling approach:

- Service methods throw specific error types
- Controllers catch errors and translate them to HTTP responses
- A global error handler middleware catches uncaught exceptions

## Utility Structure

Utilities are organized by function:

- **Response Utilities** - Standardize API response formats
- **Validation Utilities** - Validate incoming request data
- **Authentication Utilities** - Handle JWT operations
- **Logger** - Centralized logging functionality

## Future Architecture Considerations

As PRISM evolves, the following architectural enhancements are planned:

1. **Event-driven architecture** - Implementing message queues for asynchronous operations
2. **Microservices** - Breaking down monolithic structure into specialized services
3. **Caching layer** - Adding Redis for performance optimization
4. **API Gateway** - Implementing a gateway for routing and request management 