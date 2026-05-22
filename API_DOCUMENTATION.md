# Complaint System API - Technical Documentation

**Version:** 2.0  
**Last Updated:** 2024  
**API Base URL:** `http://localhost:8000/api`

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Authentication](#authentication)
4. [API Reference](#api-reference)
5. [Tutorials & Workflows](#tutorials--workflows)
6. [Error Handling](#error-handling)
7. [Rate Limiting & Usage](#rate-limiting--usage)
8. [Release Notes](#release-notes)

---

## Overview

### What is the Complaint System API?

The Complaint System API is a robust RESTful web service built with PHP that enables organizations to manage and track user complaints efficiently. It provides a complete solution for complaint lifecycle management, from submission to resolution, with comprehensive reporting and administrative controls.

### Key Capabilities

- **User Management** - Secure authentication and profile management
- **Complaint Lifecycle** - Create, track, and manage complaints from submission to resolution
- **Category Organization** - Pre-defined complaint categories for better organization
- **Admin Dashboard** - Centralized view of all complaints with filtering and pagination
- **Response Management** - Admin responses to user complaints with timestamping
- **Advanced Reporting** - Analytics and reports by category, status, and resolution metrics
- **Security** - JWT-based authentication with AES encryption for sensitive data

### What the API Doesn't Do

- Real-time notifications (webhook support not yet implemented)
- File upload for complaint attachments
- Complaint escalation workflow automation
- Multi-language support

### Architecture

The API follows a layered MVC (Model-View-Controller) architecture:

```
┌─────────────────────────────────┐
│      HTTP Request/Response      │
├─────────────────────────────────┤
│      Middleware Stack           │
│  (Error, CORS, Auth, Feature)   │
├─────────────────────────────────┤
│  Routes & Controllers           │
│  (Request Handlers)             │
├─────────────────────────────────┤
│  Models & Business Logic        │
│  (Data Access & Processing)     │
├─────────────────────────────────┤
│      MySQL Database             │
└─────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- **PHP** 7.4 or higher
- **MySQL** 5.7 or higher
- **Web Server** Apache with mod_rewrite enabled
- **cURL** or Postman for testing API endpoints

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/surumeqt/complaint-system.git
cd complaint-system/complaint-api
```

#### 2. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your database credentials
```

**.env Configuration Example:**

```env
DB_HOST=localhost
DB_NAME=complaint_system_db
DB_USER=root
DB_PASSWORD=your_secure_password
DB_PORT=3306
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
AES_SECRET_KEY=your-aes-secret-key-32-chars-long
```

#### 3. Set Up Database

```bash
# Import the database schema
mysql -u root -p < cmps-db.sql
```

#### 4. Start the Development Server

```bash
# Using PHP's built-in server (development only)
php -S localhost:8000 -t .

# Or configure your production web server to serve the application
```

#### 5. Verify Installation

Test the API is running:

```bash
curl http://localhost:8000/api/auth/login -X POST
```

Expected response should include status code 400 (since no credentials provided).

### Project Structure

```
complaint-api/
├── config/
│   ├── DatabaseConfig.php      # Database connection setup
│   └── ConfigSensitiveFields.php
├── controllers/
│   ├── AuthController.php      # Authentication logic
│   ├── UserController.php      # User management
│   ├── ComplaintController.php # Complaint operations
│   └── ReportController.php    # Reporting & analytics
├── core/
│   ├── autoload.php            # Class autoloading
│   ├── http/
│   │   ├── Request.php
│   │   ├── Response.php
│   │   ├── Router.php
│   │   └── Validator.php
│   └── feature/
│       ├── Jwt.php             # JWT token handling
│       ├── Encryptor.php       # AES encryption
│       └── Decryptor.php       # AES decryption
├── middlewares/
│   ├── ErrorMiddleware.php
│   ├── CorsMiddleware.php
│   ├── AuthMiddleware.php
│   └── FeatureMiddleware.php
├── models/
│   ├── UserModel.php
│   ├── ComplaintModel.php
│   └── ReportModel.php
├── routes/
│   ├── AuthRoutes.php
│   ├── UserRoutes.php
│   ├── ComplaintRoutes.php
│   └── AdminRoutes.php
└── utils/
    └── generateId.php
```

---

## Authentication

### Overview

All protected endpoints require authentication using JWT (JSON Web Tokens). The API uses a stateless authentication model, meaning the server doesn't store session data.

### How Authentication Works

1. **Register or Login** - Obtain a JWT token
2. **Include Token** - Add token to the `Authorization` header in subsequent requests
3. **Token Validation** - Server validates token and grants access
4. **Token Expiration** - Tokens expire after 24 hours (configurable)

### Authentication Flow Diagram

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       │ 1. POST /auth/register or /auth/login
       ▼
┌─────────────────────────┐
│   Authentication Server │
│  (Validates credentials)│
└──────────┬──────────────┘
           │
           │ 2. Return JWT Token
           ▼
┌─────────────────────────┐
│      Client Stores      │
│    JWT Token Securely   │
└──────────┬──────────────┘
           │
           │ 3. Include Token in Header
           │    Authorization: Bearer <token>
           ▼
┌─────────────────────────┐
│   Protected Endpoints   │
│  (Returns resource)     │
└─────────────────────────┘
```

### JWT Token Structure

JWT tokens consist of three parts separated by dots:

```
header.payload.signature
```

**Example Token:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Token Payload Example:**
```json
{
  "user_id": 1,
  "email": "user@example.com",
  "role": "user",
  "iat": 1516239022,
  "exp": 1516325422
}
```

### Token Lifespan

- **Validity Period:** 24 hours from issuance
- **Refresh Strategy:** Obtain a new token by logging in again
- **Expired Token Response:** 401 Unauthorized

### Standard Authentication Header

All requests to protected endpoints must include:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Common Authentication Errors

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Missing Authorization header | Include `Authorization: Bearer <token>` header |
| 401 Unauthorized | Invalid or expired token | Obtain a new token by logging in |
| 403 Forbidden | Insufficient user role/permissions | Request admin-only endpoints with admin account |
| 400 Bad Request | Validation failed during registration/login | Ensure email format and password length requirements |

### Security Best Practices

1. **Store tokens securely** - Use secure HTTP-only cookies or secure local storage
2. **Transmit over HTTPS** - Always use HTTPS in production
3. **Don't expose tokens** - Never share tokens in URLs or unencrypted channels
4. **Rotate credentials** - Change JWT_SECRET_KEY regularly in production
5. **Implement logout** - Call logout endpoint to invalidate sessions client-side

---

## API Reference

### Response Format

#### Success Response Format

All successful API responses follow this standardized format:

```json
{
  "success": true,
  "message": "Operation description",
  "data": {
    // Endpoint-specific response data
  }
}
```

**Example Success Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user_id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Error Response Format

```json
{
  "success": false,
  "error": "Description of what went wrong",
  "statusCode": 400
}
```

**Example Error Response:**
```json
{
  "success": false,
  "error": "Validation failed: Email is required",
  "statusCode": 400
}
```

### HTTP Status Codes

| Code | Status | Meaning |
|------|--------|---------|
| 200 | OK | Request successful, resource returned |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input, validation failed, or malformed request |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | User lacks required permissions for this action |
| 404 | Not Found | Requested resource does not exist |
| 500 | Server Error | Internal server error (not client's fault) |

---

## Authentication Endpoints

### Register User

Create a new user account in the system.

**Endpoint:**
```http
POST /api/auth/register
```

**Authentication:** None (public endpoint)

**Request Headers:**
```http
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Request Validation Rules:**
- `name` - Required, string, 2-100 characters
- `email` - Required, valid email format, unique
- `password` - Required, string, minimum 6 characters

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user_id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input format or missing required fields
- `400 Bad Request` - Email already registered (user exists)
- `500 Internal Server Error` - Database or server error

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

**What Happens Next:**
1. API validates input format
2. Checks if email is already registered
3. Hashes password using bcrypt
4. Creates new user record in database
5. Generates JWT token valid for 24 hours
6. Returns token to client for future authenticated requests

---

### Login User

Authenticate a user and receive a JWT token.

**Endpoint:**
```http
POST /api/auth/login
```

**Authentication:** None (public endpoint)

**Request Headers:**
```http
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Request Validation Rules:**
- `email` - Required, valid email format
- `password` - Required, string

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user_id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400 Bad Request` - Missing email or password
- `401 Unauthorized` - Invalid email or password combination
- `404 Not Found` - User account does not exist
- `500 Internal Server Error` - Database error

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

**What Happens Next:**
1. API validates input format
2. Searches for user by email
3. Compares provided password with stored hash
4. On success, generates new JWT token
5. Returns token with user information

**Security Notes:**
- Tokens are valid for 24 hours
- Each login generates a new token
- Old tokens remain valid until expiration
- Store token securely on client-side

---

### Logout User

Invalidate the current user session.

**Endpoint:**
```http
POST /api/auth/logout
```

**Authentication:** Required (user or admin)

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Request Body:** Empty (no body required)

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid authentication token
- `500 Internal Server Error` - Server error

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**What Happens Next:**
1. API validates JWT token
2. Confirms user is authenticated
3. Invalidates token on server-side (if applicable)
4. Returns success message
5. Client should remove token from local storage

**Client-Side Implementation:**
After receiving success response, remove token from local storage:
```javascript
localStorage.removeItem('auth_token');
// Redirect to login page
window.location.href = '/login';
```

---

## User Endpoints

### Get User Profile

Retrieve the authenticated user's profile information.

**Endpoint:**
```http
GET /api/users/profile
```

**Authentication:** Required (user or admin)

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Query Parameters:** None

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone_number": "+1234567890",
    "role": "user",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-20T14:45:00Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - User not found
- `500 Internal Server Error` - Server error

**cURL Example:**
```bash
curl -X GET http://localhost:8000/api/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response Fields:**
- `user_id` - Unique user identifier
- `name` - Full name of the user
- `email` - Email address (unique)
- `phone_number` - Contact phone number (may be null)
- `role` - User role (user or admin)
- `created_at` - Account creation timestamp
- `updated_at` - Last profile update timestamp

---

### Update User Profile

Modify authenticated user's profile information.

**Endpoint:**
```http
PUT /api/users/profile
```

**Authentication:** Required (user or admin)

**Request Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "phone_number": "+9876543210"
}
```

**Updatable Fields:**
- `name` - User's full name (string, 2-100 characters)
- `phone_number` - Contact phone number (string, optional)

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user_id": 1,
    "name": "John Doe Updated",
    "email": "john@example.com",
    "phone_number": "+9876543210"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Missing or invalid token
- `500 Internal Server Error` - Database error

**cURL Example:**
```bash
curl -X PUT http://localhost:8000/api/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated",
    "phone_number": "+9876543210"
  }'
```

**Important Notes:**
- Email cannot be changed via this endpoint
- Password cannot be changed via this endpoint
- Empty fields are ignored (only provided fields are updated)
- Updated timestamp is automatically set by server

---

### Get User Dashboard

Retrieve dashboard data with complaint statistics for the authenticated user.

**Endpoint:**
```http
GET /api/users/dashboard
```

**Authentication:** Required (user only)

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Query Parameters:** None

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total_complaints": 5,
    "pending_complaints": 2,
    "resolved_complaints": 3,
    "in_progress_complaints": 1,
    "recent_complaints": [
      {
        "complaint_id": 1,
        "title": "Service Issue",
        "status": "pending",
        "created_at": "2024-01-20T10:00:00Z"
      },
      {
        "complaint_id": 2,
        "title": "Billing Problem",
        "status": "resolved",
        "created_at": "2024-01-19T15:30:00Z"
      }
    ]
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - User is admin (admin has different dashboard)
- `500 Internal Server Error` - Server error

**cURL Example:**
```bash
curl -X GET http://localhost:8000/api/users/dashboard \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Dashboard Statistics:**
- `total_complaints` - Total complaints submitted by user
- `pending_complaints` - Complaints awaiting admin response
- `in_progress_complaints` - Complaints being actively handled
- `resolved_complaints` - Complaints successfully resolved
- `recent_complaints` - Last 5 complaints ordered by creation date

---

## Complaint Endpoints

### Create Complaint

Submit a new complaint to the system.

**Endpoint:**
```http
POST /api/complaints
```

**Authentication:** Required (user role)

**Request Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "category_id": 2,
  "title": "Poor Service Quality",
  "description": "The service received was not up to the expected standard. The staff was unprofessional and unhelpful."
}
```

**Request Validation Rules:**
- `category_id` - Required, integer, positive number, 1-5 digits
- `title` - Required, string, 3-255 characters
- `description` - Required, string, 10-2000 characters

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Complaint created successfully",
  "data": {
    "complaint_id": 1,
    "user_id": 1,
    "category_id": 2,
    "title": "Poor Service Quality",
    "description": "The service received was not up to the expected standard...",
    "status": "pending",
    "created_at": "2024-01-20T10:00:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Validation failed or invalid category_id
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - User lacks permission to create complaints
- `500 Internal Server Error` - Server error

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/complaints \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "category_id": 2,
    "title": "Poor Service Quality",
    "description": "The service received was not up to the expected standard. The staff was unprofessional and unhelpful."
  }'
```

**Initial Status:** All new complaints start with status `pending`

**Valid Category IDs:** 1-5 (obtain from `/api/complaints/categories/all` endpoint)

**Best Practices:**
1. Fetch categories first to get valid category_id values
2. Provide descriptive, detailed explanations for faster resolution
3. Use clear, professional language in title and description
4. Include relevant dates, times, and transaction details if applicable

---

### Get Complaint by ID

Retrieve details of a specific complaint.

**Endpoint:**
```http
GET /api/complaints/{complaint_id}
```

**Authentication:** Required (user or admin)

**Request Headers:**
```http
Authorization: Bearer <token>
```

**URL Parameters:**
- `complaint_id` (required) - The numeric ID of the complaint

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "complaint_id": 1,
    "user_id": 1,
    "category_id": 2,
    "title": "Poor Service Quality",
    "description": "The service received was not up to the expected standard...",
    "status": "pending",
    "response": null,
    "created_at": "2024-01-20T10:00:00Z",
    "updated_at": "2024-01-20T10:00:00Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - User can only view own complaints; admin can view all
- `404 Not Found` - Complaint with specified ID does not exist
- `500 Internal Server Error` - Server error

**cURL Example:**
```bash
curl -X GET http://localhost:8000/api/complaints/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response Fields:**
- `complaint_id` - Unique complaint identifier
- `user_id` - ID of user who submitted complaint
- `category_id` - Category the complaint belongs to
- `title` - Complaint subject line
- `description` - Detailed complaint description
- `status` - Current status (pending, in_progress, resolved)
- `response` - Admin response (null if no response yet)
- `created_at` - Submission timestamp
- `updated_at` - Last modification timestamp

---

### Get User's Complaints

Retrieve all complaints submitted by a specific user.

**Endpoint:**
```http
GET /api/complaints/user/{user_id}
```

**Authentication:** Required (user)

**Request Headers:**
```http
Authorization: Bearer <token>
```

**URL Parameters:**
- `user_id` (required) - The ID of the user

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "complaint_id": 1,
      "title": "Poor Service Quality",
      "status": "pending",
      "created_at": "2024-01-20T10:00:00Z"
    },
    {
      "complaint_id": 2,
      "title": "Billing Issue",
      "status": "resolved",
      "created_at": "2024-01-19T09:30:00Z"
    }
  ]
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Users can only view own complaints
- `404 Not Found` - User not found
- `500 Internal Server Error` - Server error

**cURL Example:**
```bash
curl -X GET http://localhost:8000/api/complaints/user/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response Format:**
Returns an array of complaint summaries (note: simplified format compared to full complaint detail endpoint)

**Pagination:** Current implementation returns all complaints (future versions may add pagination)

---

### Get Complaint Categories

Retrieve all available complaint categories in the system.

**Endpoint:**
```http
GET /api/complaints/categories/all
```

**Authentication:** Required (user)

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Query Parameters:** None

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "category_id": 1,
      "name": "Service Quality",
      "description": "Issues related to service quality and customer experience"
    },
    {
      "category_id": 2,
      "name": "Billing",
      "description": "Billing and payment related issues"
    },
    {
      "category_id": 3,
      "name": "Technical Support",
      "description": "Technical issues and support"
    },
    {
      "category_id": 4,
      "name": "Product Issues",
      "description": "Problems with products or defects"
    },
    {
      "category_id": 5,
      "name": "Other",
      "description": "Other issues not covered by above categories"
    }
  ]
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `500 Internal Server Error` - Server error

**cURL Example:**
```bash
curl -X GET http://localhost:8000/api/complaints/categories/all \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response Details:**
Each category object contains:
- `category_id` - Numeric identifier (1-5)
- `name` - Category name for display
- `description` - Explanation of what issues belong to this category

**Usage:** Always fetch this endpoint before creating a complaint to provide users with category options.

---

## Admin Endpoints

### Get All Complaints

Retrieve all complaints in the system with pagination and filtering options.

**Endpoint:**
```http
GET /api/admin/complaints
```

**Authentication:** Required (admin role only)

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional) - Page number for pagination (default: 1)
- `limit` (optional) - Number of items per page (default: 10)
- `status` (optional) - Filter by status (pending, in_progress, resolved)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "complaints": [
      {
        "complaint_id": 1,
        "user_id": 1,
        "user_name": "John Doe",
        "title": "Poor Service Quality",
        "status": "pending",
        "created_at": "2024-01-20T10:00:00Z"
      },
      {
        "complaint_id": 2,
        "user_id": 2,
        "user_name": "Jane Smith",
        "title": "Billing Issue",
        "status": "in_progress",
        "created_at": "2024-01-19T14:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_items": 47
    }
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - User is not admin
- `500 Internal Server Error` - Server error

**cURL Examples:**

Get first page with default limit:
```bash
curl -X GET "http://localhost:8000/api/admin/complaints" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Get page 2 with 20 items per page:
```bash
curl -X GET "http://localhost:8000/api/admin/complaints?page=2&limit=20" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Get only pending complaints:
```bash
curl -X GET "http://localhost:8000/api/admin/complaints?status=pending" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Pagination Details:**
- Pagination only applies to query parameter `page` and `limit`
- Maximum recommended limit: 100 items per page
- Page numbering starts at 1
- Invalid page number returns empty complaints array

---

### Update Complaint Status

Change the status of a complaint.

**Endpoint:**
```http
PUT /api/complaints/{complaint_id}/status
```

**Authentication:** Required (admin role only)

**Request Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters:**
- `complaint_id` (required) - The ID of the complaint

**Request Body:**
```json
{
  "status": "in_progress"
}
```

**Allowed Status Values:**
- `pending` - Initial status for new complaints
- `in_progress` - Complaint is being actively handled
- `resolved` - Complaint has been resolved

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Complaint status updated successfully",
  "data": {
    "complaint_id": 1,
    "status": "in_progress",
    "updated_at": "2024-01-20T14:30:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid status value
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - User is not admin
- `404 Not Found` - Complaint not found
- `500 Internal Server Error` - Server error

**cURL Example:**
```bash
curl -X PUT "http://localhost:8000/api/complaints/1/status" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"status": "in_progress"}'
```

**Status Workflow:**
```
pending → in_progress → resolved
  ↑                         ↓
  └─────────────────────────┘
```

Valid transitions:
- pending → in_progress ✓
- pending → resolved ✓
- in_progress → resolved ✓
- in_progress → pending ✓
- resolved → in_progress ✓
- resolved → pending ✓

(Any transition is allowed; prefer to follow natural workflow)

---

### Add Response to Complaint

Submit an admin response to a user's complaint.

**Endpoint:**
```http
POST /api/complaints/{complaint_id}/response
```

**Authentication:** Required (admin role only)

**Request Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters:**
- `complaint_id` (required) - The ID of the complaint

**Request Body:**
```json
{
  "response": "We have reviewed your complaint thoroughly and are taking the following actions: [details]. We apologize for any inconvenience caused."
}
```

**Request Validation Rules:**
- `response` - Required, string, minimum 10 characters, maximum 2000 characters

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Response added successfully",
  "data": {
    "complaint_id": 1,
    "response": "We have reviewed your complaint and are taking action...",
    "responded_by": "admin_user",
    "responded_at": "2024-01-20T14:35:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Validation failed or response already exists
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - User is not admin
- `404 Not Found` - Complaint not found
- `500 Internal Server Error` - Server error

**cURL Example:**
```bash
curl -X POST "http://localhost:8000/api/complaints/1/response" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "response": "We have reviewed your complaint thoroughly and are taking the following actions: [details]. We apologize for any inconvenience caused."
  }'
```

**Best Practices:**
1. Keep response professional and empathetic
2. Acknowledge the user's concern
3. Explain what actions are being taken
4. Provide timeline for resolution if possible
5. Include contact information if follow-up is needed
6. Proofread before submitting

**Important Notes:**
- Each complaint can have only one response
- Response cannot be edited after submission
- Response timestamp is set by server
- User will see this response when viewing complaint

---

## Reporting Endpoints

### Get Complaint Category Report

Generate a report showing complaints grouped and counted by category.

**Endpoint:**
```http
GET /api/reports/complaint-category
```

**Authentication:** Required (admin role only)

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Query Parameters:**
- `start_date` (optional) - ISO 8601 format: YYYY-MM-DD
- `end_date` (optional) - ISO 8601 format: YYYY-MM-DD

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "category_id": 1,
      "category_name": "Service Quality",
      "total_complaints": 12,
      "percentage": 30.8
    },
    {
      "category_id": 2,
      "category_name": "Billing",
      "total_complaints": 18,
      "percentage": 46.2
    },
    {
      "category_id": 3,
      "category_name": "Technical Support",
      "total_complaints": 9,
      "percentage": 23.1
    }
  ]
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - User is not admin
- `500 Internal Server Error` - Server error

**cURL Examples:**

Get report for all time:
```bash
curl -X GET "http://localhost:8000/api/reports/complaint-category" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Get report for specific date range:
```bash
curl -X GET "http://localhost:8000/api/reports/complaint-category?start_date=2024-01-01&end_date=2024-01-31" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response Fields:**
- `category_id` - Numeric category identifier
- `category_name` - Human-readable category name
- `total_complaints` - Count of complaints in this category
- `percentage` - Percentage of total complaints (2 decimal places)

**Date Filter Notes:**
- If `start_date` is omitted, defaults to beginning of time
- If `end_date` is omitted, defaults to today
- Both parameters are optional
- Invalid date format defaults to include all data

---

### Get Resolution Status Report

Generate a report showing complaint distribution by resolution status with timing metrics.

**Endpoint:**
```http
GET /api/reports/resolution-status
```

**Authentication:** Required (admin role only)

**Request Headers:**
```http
Authorization: Bearer <token>
```

**Query Parameters:**
- `start_date` (optional) - ISO 8601 format: YYYY-MM-DD
- `end_date` (optional) - ISO 8601 format: YYYY-MM-DD

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "status": "resolved",
      "total_complaints": 28,
      "percentage": 71.8,
      "average_resolution_time_hours": 48.5
    },
    {
      "status": "in_progress",
      "total_complaints": 8,
      "percentage": 20.5,
      "average_response_time_hours": 2.3
    },
    {
      "status": "pending",
      "total_complaints": 3,
      "percentage": 7.7,
      "average_wait_time_hours": 12.1
    }
  ]
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - User is not admin
- `500 Internal Server Error` - Server error

**cURL Examples:**

Get report for all time:
```bash
curl -X GET "http://localhost:8000/api/reports/resolution-status" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Get report for specific month:
```bash
curl -X GET "http://localhost:8000/api/reports/resolution-status?start_date=2024-01-01&end_date=2024-01-31" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response Fields:**
- `status` - Complaint status (pending, in_progress, resolved)
- `total_complaints` - Count of complaints in this status
- `percentage` - Percentage of total complaints
- `average_resolution_time_hours` - For resolved: avg hours from creation to resolution
- `average_response_time_hours` - For in_progress: avg hours from creation to first response
- `average_wait_time_hours` - For pending: avg hours since creation

**Metrics Interpretation:**
- Lower `average_resolution_time_hours` = faster resolution (good)
- Lower `average_response_time_hours` = faster admin response (good)
- Higher `percentage` of resolved = better completion rate (good)

---

## Tutorials & Workflows

### Getting Started: User Registration and Login Workflow

This tutorial shows how a new user registers, logs in, and begins using the system.

**What You'll Learn:**
- How to register a new account
- How to authenticate and get a JWT token
- How to store and use the token for subsequent requests

**Prerequisites:**
- API base URL: `http://localhost:8000/api`
- cURL or HTTP client (Postman, Insomnia, etc.)

**Step 1: Register a New User**

Send a POST request to create a new account:

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "john.smith@example.com",
    "password": "MySecurePassword123"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user_id": 1,
    "name": "John Smith",
    "email": "john.smith@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiam9obi5zbWl0aEB..."
  }
}
```

**Save the token** - You'll need it for the next steps.

**Step 2: Store the Token Securely**

In your client application, store the token:

**JavaScript Example:**
```javascript
const response = await fetch('http://localhost:8000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "John Smith",
    email: "john.smith@example.com",
    password: "MySecurePassword123"
  })
});

const data = await response.json();
const token = data.data.token;

// Store token in secure storage
localStorage.setItem('auth_token', token);
```

**Step 3: Use the Token for Authenticated Requests**

Now use the token to access protected endpoints:

```bash
curl -X GET http://localhost:8000/api/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiam9obi5zbWl0aEB..."
```

**What Happens Next:**
1. Server validates the token signature
2. Server extracts user ID from token
3. Server returns authenticated user's profile
4. Client receives profile data

**Complete Flow Diagram:**

```
┌─────────────────────────────────────────────────────────────┐
│  1. User Registers                                          │
│     POST /auth/register                                    │
│     {name, email, password}                               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Server Validates Credentials                           │
│     - Check email uniqueness                              │
│     - Hash password with bcrypt                           │
│     - Create user record                                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  3. Generate & Return JWT Token                            │
│     {user_id, email, role, iat, exp}                     │
│     Token expires in 24 hours                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Client Stores Token                                    │
│     localStorage or secure HTTP-only cookie               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  5. Use Token for Future Requests                          │
│     GET /users/profile                                    │
│     Header: Authorization: Bearer <token>                 │
└─────────────────────────────────────────────────────────────┘
```

---

### Workflow: Submit and Track a Complaint

This workflow shows how to create a complaint, check its status, and monitor for admin responses.

**What You'll Learn:**
- How to fetch available complaint categories
- How to submit a complaint
- How to retrieve complaint status
- How to view admin responses

**Prerequisites:**
- Valid JWT token from login/registration
- Base URL: `http://localhost:8000/api`

**Step 1: Get Available Categories**

First, see what categories are available:

```bash
TOKEN="your_jwt_token_here"

curl -X GET http://localhost:8000/api/complaints/categories/all \
  -H "Authorization: Bearer $TOKEN"
```

Response:
```json
{
  "success": true,
  "data": [
    {"category_id": 1, "name": "Service Quality", ...},
    {"category_id": 2, "name": "Billing", ...},
    {"category_id": 3, "name": "Technical Support", ...},
    {"category_id": 4, "name": "Product Issues", ...},
    {"category_id": 5, "name": "Other", ...}
  ]
}
```

**Save the category_id** for the category that matches your complaint.

**Step 2: Submit a Complaint**

Create a new complaint with category and description:

```bash
curl -X POST http://localhost:8000/api/complaints \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category_id": 2,
    "title": "Unexpected Billing Charge",
    "description": "I was charged $50 on January 15th for a service I did not request. I have been a customer for 2 years and never authorized additional services. Please review my account and refund this charge immediately."
  }'
```

Response:
```json
{
  "success": true,
  "message": "Complaint created successfully",
  "data": {
    "complaint_id": 5,
    "user_id": 1,
    "category_id": 2,
    "title": "Unexpected Billing Charge",
    "status": "pending",
    "created_at": "2024-01-22T10:30:00Z"
  }
}
```

**Save the complaint_id** (in this case, 5) to track this complaint.

**Step 3: Check Complaint Status**

Retrieve the full details of your complaint:

```bash
curl -X GET http://localhost:8000/api/complaints/5 \
  -H "Authorization: Bearer $TOKEN"
```

Response:
```json
{
  "success": true,
  "data": {
    "complaint_id": 5,
    "title": "Unexpected Billing Charge",
    "status": "pending",
    "response": null,
    "created_at": "2024-01-22T10:30:00Z",
    "updated_at": "2024-01-22T10:30:00Z"
  }
}
```

**Status Meanings:**
- `pending` - Awaiting admin review
- `in_progress` - Admin is actively working on it
- `resolved` - Issue has been resolved

**Step 4: Monitor for Admin Response**

Periodically check your complaint (or set up polling) to see if admin has responded:

```bash
# Check status every few hours
curl -X GET http://localhost:8000/api/complaints/5 \
  -H "Authorization: Bearer $TOKEN"
```

Once admin responds, the response field will contain their message:

```json
{
  "success": true,
  "data": {
    "complaint_id": 5,
    "title": "Unexpected Billing Charge",
    "status": "in_progress",
    "response": "Thank you for reporting this issue. We have reviewed your account and found an unauthorized service addition. We are processing a refund of $50 which should appear in 3-5 business days. Your billing has been corrected to prevent future unauthorized charges. Please contact us if you have any questions.",
    "updated_at": "2024-01-23T14:00:00Z"
  }
}
```

**Step 5: View All Your Complaints**

See a summary of all your complaints:

```bash
curl -X GET http://localhost:8000/api/users/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

Response shows statistics and recent complaints:
```json
{
  "success": true,
  "data": {
    "total_complaints": 3,
    "pending_complaints": 0,
    "resolved_complaints": 2,
    "in_progress_complaints": 1,
    "recent_complaints": [
      {"complaint_id": 5, "title": "Unexpected Billing Charge", "status": "in_progress", ...},
      {"complaint_id": 4, "title": "Product Defect", "status": "resolved", ...},
      {"complaint_id": 3, "title": "Late Delivery", "status": "resolved", ...}
    ]
  }
}
```

**Complete Workflow Diagram:**

```
START
  │
  ▼
┌─────────────────────────────────┐
│ Get Categories                  │
│ GET /complaints/categories/all  │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│ Submit Complaint                │
│ POST /complaints                │
│ {category_id, title, ...}      │
└──────────────┬──────────────────┘
               │
               ▼ Get complaint_id
┌─────────────────────────────────┐
│ Poll for Admin Response         │
│ GET /complaints/{id}            │
│ (Check periodically)            │
└──────────────┬──────────────────┘
               │
    ┌──────────┴──────────┐
    │ response == null?   │
    │ (Still waiting)     │
    └──────────┬──────────┘
               │
   NO (admin responded)
               │
               ▼
┌─────────────────────────────────┐
│ Read Admin Response             │
│ View response field             │
└──────────────┬──────────────────┘
               │
               ▼
            SUCCESS
             (END)
```

**Best Practices:**
1. Be specific in your complaint description
2. Include dates, times, and reference numbers if applicable
3. Check status regularly (but not excessively)
4. Provide contact information for follow-up
5. Keep copies of complaints for your records

---

## Error Handling

### Common Error Scenarios

#### 1. Validation Error During Registration

**Scenario:** User tries to register with invalid email.

**Request:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "not-an-email",
    "password": "password123"
  }'
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Validation failed: Email must be a valid email address",
  "statusCode": 400
}
```

**What to do:**
- Check that email follows standard email format (user@domain.com)
- Verify all required fields are present
- Check field value types match expectations

#### 2. User Already Exists

**Scenario:** User tries to register with email that's already in system.

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "User already exists",
  "statusCode": 400
}
```

**What to do:**
- Use login endpoint instead if account already exists
- Use forgot password feature if you've lost password
- Use a different email address

#### 3. Invalid Credentials During Login

**Scenario:** User provides correct email but wrong password.

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Invalid credentials",
  "statusCode": 401
}
```

**What to do:**
- Double-check that password is entered correctly
- Ensure caps lock is not on
- Use forgot password feature if password is forgotten
- Verify email address is correct

#### 4. Missing Authentication Token

**Scenario:** User tries to access protected endpoint without Authorization header.

**Request:**
```bash
curl -X GET http://localhost:8000/api/users/profile
# No Authorization header!
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Unauthorized",
  "statusCode": 401
}
```

**What to do:**
- Include Authorization header with valid JWT token
- Format: `Authorization: Bearer <token>`
- Ensure token hasn't expired (24 hour limit)
- Log in again to get fresh token

#### 5. Expired or Invalid Token

**Scenario:** Token is more than 24 hours old or corrupted.

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Unauthorized",
  "statusCode": 401
}
```

**What to do:**
- Log in again to get a fresh token
- Verify token string wasn't corrupted during transmission
- Check that token wasn't manually edited

#### 6. Insufficient Permissions

**Scenario:** Regular user tries to access admin-only endpoint.

**Request:**
```bash
curl -X GET http://localhost:8000/api/admin/complaints \
  -H "Authorization: Bearer $USER_TOKEN"
# User token from non-admin account
```

**Response (403 Forbidden):**
```json
{
  "success": false,
  "error": "Access denied",
  "statusCode": 403
}
```

**What to do:**
- Use an admin account to access admin endpoints
- Log in with admin credentials to get admin token
- Verify your account has admin role

#### 7. Resource Not Found

**Scenario:** User requests a complaint that doesn't exist or belongs to another user.

**Request:**
```bash
curl -X GET http://localhost:8000/api/complaints/999 \
  -H "Authorization: Bearer $TOKEN"
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Complaint not found",
  "statusCode": 404
}
```

**What to do:**
- Verify the complaint ID is correct
- Check that complaint belongs to your account
- Fetch list of your complaints to find correct ID

#### 8. Server Error

**Scenario:** Unexpected server-side error occurs.

**Response (500 Internal Server Error):**
```json
{
  "success": false,
  "error": "Internal Server Error",
  "statusCode": 500
}
```

**What to do:**
- Retry the request after a few moments
- Contact support with request details
- Check server logs for specific error information
- Verify database connection is working

### Error Response Reference Table

| Status | Code | Description | Common Causes | Solution |
|--------|------|-------------|---------------|----------|
| 400 | Bad Request | Invalid input or validation failed | Missing field, wrong data type, invalid format | Review request format, check validation rules |
| 401 | Unauthorized | Missing or invalid authentication | No token, expired token, invalid token | Include valid token in Authorization header |
| 403 | Forbidden | User lacks required permissions | User role not sufficient | Use appropriate account role |
| 404 | Not Found | Resource doesn't exist | Wrong ID, resource deleted, access forbidden | Verify ID, check resource ownership |
| 500 | Server Error | Internal server error | Database down, unhandled exception | Retry later, contact support |

### Error Handling Best Practices

1. **Always check the status code** - Different codes indicate different problem types
2. **Read the error message** - Specific error messages guide your next action
3. **Don't ignore 401 errors** - Usually means token expired; re-authenticate
4. **Handle 500 errors gracefully** - Implement retry logic with exponential backoff
5. **Log errors** - Store error details for debugging and troubleshooting
6. **Provide user feedback** - Don't expose raw API errors to end users; translate to user-friendly messages

### Client-Side Error Handling Example

**JavaScript:**
```javascript
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle different status codes
      if (response.status === 401) {
        // Token expired - log out and redirect to login
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      } else if (response.status === 403) {
        // Permission denied
        console.error('Access denied:', data.error);
      } else if (response.status === 404) {
        // Resource not found
        console.error('Not found:', data.error);
      } else {
        // Generic error
        console.error('Error:', data.error);
      }
      throw new Error(data.error);
    }

    return data.data;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}
```

---

## Rate Limiting & Usage

### Rate Limiting Policy

The Complaint System API currently does **not enforce rate limiting**, but it's recommended that clients implement responsible usage patterns.

**Recommended Rate Limits (self-imposed):**
- Maximum **100 requests per minute** per API token
- Maximum **10 requests per second** for intensive endpoints

### Recommended Usage Patterns

**Don't:**
```javascript
// ❌ DON'T - Polling too frequently
setInterval(() => {
  fetch('/api/complaints/123');
}, 1000); // Every 1 second!
```

**Do:**
```javascript
// ✓ DO - Reasonable polling interval
setInterval(() => {
  fetch('/api/complaints/123');
}, 300000); // Every 5 minutes
```

### Usage Limits by Endpoint

| Endpoint | Recommended Frequency | Notes |
|----------|----------------------|-------|
| Auth endpoints | Once per login | Minimal usage expected |
| User profile | Once per session | On app load or user request |
| Get complaints | Every 5-10 minutes | For polling changes |
| Create complaint | As needed | No frequent limits |
| Admin endpoints | As needed | Admin panel usage |
| Reports | Once daily | Heavy computation, use sparingly |

### Best Practices

1. **Cache responses** - Store data locally to reduce API calls
2. **Batch requests** - Combine multiple operations when possible
3. **Use pagination** - Don't fetch all items if you only need current page
4. **Implement backoff** - Wait before retrying failed requests
5. **Monitor usage** - Track your API call patterns

---

## Release Notes

### Version 2.0 (Current)

**Release Date:** January 2024

**New Features:**
- Complete RESTful API with authentication
- JWT-based stateless authentication
- User profile management
- Complaint lifecycle management
- Admin complaint management dashboard
- Comprehensive reporting and analytics
- AES encryption for sensitive data
- CORS support for cross-origin requests
- Request validation middleware
- Error handling middleware

**Improvements:**
- Secure password hashing with bcrypt
- Paginated admin dashboard
- Status-based filtering for complaints
- Date-range filtering for reports
- Detailed error messages
- Timestamp tracking for all operations

**Breaking Changes:**
- None (initial release)

**Known Limitations:**
- Webhook notifications not yet implemented
- File attachment support not available
- Real-time updates require polling
- Single response per complaint limitation

### Version 1.0 (Deprecated)

Earlier version - not supported. Upgrade to v2.0.

---

## Support & Contact

For issues, questions, or feature requests:

1. **Documentation** - Check this documentation first
2. **Repository Issues** - Open an issue on GitHub
3. **Contact Team** - Reach out to development team
4. **Email** - Send questions to api-support@example.com

---

## Glossary of Terms

| Term | Definition |
|------|-----------|
| **JWT** | JSON Web Token - A secure, stateless authentication method |
| **Token** | Authentication credential that proves user identity |
| **Endpoint** | A URL where an API resource is available |
| **Payload** | Data sent in request body or returned in response |
| **Status Code** | HTTP status number indicating request result |
| **Bearer** | Authentication scheme using JWT tokens |
| **CORS** | Cross-Origin Resource Sharing - allows requests from different domains |
| **Pagination** | Splitting large result sets into multiple pages |
| **Middleware** | Software that processes requests before reaching handlers |
| **Role** | User classification (user, admin) determining permissions |

---

## Document Information

**Document Title:** Complaint System API - Technical Documentation  
**Version:** 2.0  
**Last Updated:** January 2024  
**Author:** Development Team  
**Status:** Published  
**Audience:** Developers, API Consumers, System Administrators

---

**End of Documentation**
