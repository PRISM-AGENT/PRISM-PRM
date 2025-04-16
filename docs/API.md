# PRISM API Documentation

## Introduction

The PRISM API provides a set of endpoints for interacting with the PRISM platform. This document outlines the available endpoints, their purposes, request/response formats, and authentication requirements.

## Base URL

All API endpoints are prefixed with:

```
/api/v1
```

For local development, the full URL would be:
```
http://localhost:5000/api/v1
```

## Authentication

Most API endpoints require authentication. Authentication is handled through JSON Web Tokens (JWT).

### Authentication Flow

1. Client authenticates using `/auth/login` or `/auth/register`
2. Server returns a JWT token
3. Client includes token in subsequent requests

### Using JWT Token

Add the token to the `Authorization` header of your requests:

```
Authorization: Bearer <token>
```

## Common Response Format

All API responses follow a standard format:

### Success Response

```json
{
  "success": true,
  "message": "Operation successful message",
  "data": {
    // Response data varies by endpoint
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    // Detailed error information (optional)
  }
}
```

## Status Codes

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

## API Endpoints

### Auth API

#### Register User

```
POST /auth/register
```

Creates a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "60d21b4667d0d8992e610c85",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "createdAt": "2023-06-22T15:21:26.012Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User

```
POST /auth/login
```

Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "60d21b4667d0d8992e610c85",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Current User

```
GET /auth/me
```

Retrieves the authenticated user's information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "id": "60d21b4667d0d8992e610c85",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "createdAt": "2023-06-22T15:21:26.012Z",
      "walletAddress": "0x12345..."
    }
  }
}
```

### User API

#### Get User Profile

```
GET /users/profile
```

Retrieves the authenticated user's profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "user": {
      "id": "60d21b4667d0d8992e610c85",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "walletAddress": "0x12345...",
      "createdAt": "2023-06-22T15:21:26.012Z"
    }
  }
}
```

#### Update User Profile

```
PUT /users/profile
```

Updates the authenticated user's profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "Johnny",
  "lastName": "Doe",
  "walletAddress": "0x45678..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "60d21b4667d0d8992e610c85",
      "firstName": "Johnny",
      "lastName": "Doe",
      "email": "john@example.com",
      "walletAddress": "0x45678..."
    }
  }
}
```

### Token API

#### Get Token Information

```
GET /tokens
```

Retrieves token information for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token information retrieved",
  "data": {
    "balance": 1000,
    "transactions": [
      {
        "type": "airdrop",
        "amount": 100,
        "timestamp": "2023-06-22T15:30:45.012Z",
        "description": "Initial airdrop tokens"
      },
      {
        "type": "transfer_in",
        "amount": 50,
        "timestamp": "2023-06-23T10:15:22.542Z",
        "description": "Payment for services",
        "sender": "jane@example.com"
      }
    ]
  }
}
```

#### Request Token Airdrop

```
POST /tokens/airdrop
```

Requests an airdrop of tokens to the specified wallet address.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "walletAddress": "0x1234567890abcdef1234567890abcdef12345678"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Airdrop processed successfully",
  "data": {
    "transaction": {
      "type": "airdrop",
      "amount": 100,
      "timestamp": "2023-06-24T09:45:30.128Z",
      "description": "Initial airdrop tokens"
    },
    "currentBalance": 1100
  }
}
```

#### Transfer Tokens

```
POST /tokens/transfer
```

Transfers tokens from the authenticated user to another user.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "recipientId": "60d21b4667d0d8992e610c86",
  "amount": 50,
  "description": "Payment for article review"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Transfer successful",
  "data": {
    "transaction": {
      "type": "transfer_out",
      "amount": -50,
      "timestamp": "2023-06-24T14:22:18.763Z",
      "description": "Payment for article review",
      "recipient": "jane@example.com"
    },
    "currentBalance": 1050
  }
}
```

### Assistant API

#### Query Assistant

```
POST /assistant/query
```

Sends a query to an AI assistant.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "assistantId": "60d21b4667d0d8992e610c87",
  "query": "What is the current price of Bitcoin?",
  "context": {
    "previousMessages": []
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Query processed successfully",
  "data": {
    "response": "As of my last update, the price of Bitcoin (BTC) is approximately $50,000 USD. However, cryptocurrency prices are highly volatile and can change rapidly. For the most current price, I recommend checking a reliable cryptocurrency exchange or price tracking website.",
    "sources": [
      {
        "title": "Bitcoin Price Data",
        "url": "https://example.com/bitcoin-price"
      }
    ]
  }
}
```

#### Create Assistant

```
POST /assistant/create
```

Creates a new custom assistant.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Crypto Market Analyst",
  "description": "Specialized in cryptocurrency market analysis",
  "specialization": "crypto",
  "isPublic": false,
  "configuration": {
    "knowledgeSources": ["market_data", "news"],
    "responseStyle": "concise"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Assistant created successfully",
  "data": {
    "assistant": {
      "id": "60d21b4667d0d8992e610c88",
      "name": "Crypto Market Analyst",
      "description": "Specialized in cryptocurrency market analysis",
      "specialization": "crypto",
      "isPublic": false,
      "createdAt": "2023-06-25T11:30:45.128Z"
    }
  }
}
```

#### List Assistants

```
GET /assistant/list
```

Retrieves a list of available assistants.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
specialization=crypto (optional)
```

**Response (200):**
```json
{
  "success": true,
  "message": "Assistants retrieved successfully",
  "data": {
    "assistants": [
      {
        "id": "60d21b4667d0d8992e610c88",
        "name": "Crypto Market Analyst",
        "description": "Specialized in cryptocurrency market analysis",
        "specialization": "crypto",
        "isPublic": false,
        "createdBy": {
          "firstName": "John",
          "lastName": "Doe"
        }
      },
      {
        "id": "60d21b4667d0d8992e610c89",
        "name": "General Crypto Assistant",
        "description": "General cryptocurrency information and guidance",
        "specialization": "crypto",
        "isPublic": true,
        "createdBy": {
          "firstName": "PRISM",
          "lastName": "Team"
        }
      }
    ]
  }
}
```

## Rate Limiting

API requests are subject to rate limiting to ensure fair usage and system stability:

- **Authenticated users**: 100 requests per minute
- **Anonymous users**: 20 requests per minute

When rate limit is exceeded, the API will respond with status code `429` (Too Many Requests).

## Versioning

The API uses URL versioning (e.g., `/api/v1/`). Major changes to the API will be released under a new version number.

## Deprecation Policy

Deprecated endpoints will be announced at least 6 months before removal. Deprecated endpoints will continue to function but will return a deprecation warning header. 