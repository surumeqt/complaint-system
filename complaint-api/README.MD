# Complaint System API v2

A robust RESTful API built with PHP for managing and tracking user complaints. Features user authentication, complaint lifecycle management, user profiles, and comprehensive admin reporting capabilities.

## Table of Contents
- [Features](#features)
- [System Requirements](#system-requirements)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Project Structure](#project-structure)

## Features

- ✅ **User Management** - Registration, login, profile management, and logout
- ✅ **Complaint Management** - Create, retrieve, and track complaint status
- ✅ **Categories** - Browse complaint categories
- ✅ **Admin Dashboard** - View all complaints and manage statuses
- ✅ **Admin Responses** - Add responses to complaints
- ✅ **Reporting** - Generate reports by complaint category and resolution status
- ✅ **Security** - JWT-based authentication and AES encryption for sensitive data
- ✅ **CORS** - Cross-Origin Resource Sharing support
- ✅ **Error Handling** - Comprehensive error handling middleware
- ✅ **Validation** - Request validation middleware

## System Requirements

- **PHP** 7.4 or higher
- **MySQL** 5.7 or higher
- **Web Server** Apache with mod_rewrite or similar

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd complaint-api-v2
```

### 2. Configure Environment Variables

Copy the example environment file and update it with your configuration:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
DB_HOST=localhost
DB_NAME=complaint_system_db
DB_USER=root
DB_PASSWORD=your_password
DB_PORT=3306
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this
AES_SECRET_KEY=your-aes-secret-key-32-chars-long
```

### 3. Set Up Database

Create the MySQL database and import the schema:

```bash
mysql -u root -p < database/schema.sql
```

Or manually create the database and tables as needed.

### 4. Start the API Server

Using PHP's built-in server (for development):

```bash
php -S localhost:8000 -t public
```

Or configure your web server to point to the project root.

---

## API Documentation

### Base URL
```
http://localhost:8000/api
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created):**
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

**Error Responses:**
- `400` - Invalid input or user already exists
- `500` - Server error

---

### Login User
**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user_id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error Responses:**
- `401` - Invalid credentials
- `404` - User not found

---

### Logout User
**POST** `/auth/logout`

Logout the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Authorization:** Required (user, admin)

---

## User Endpoints

### Get User Profile
**GET** `/users/profile`

Retrieve the authenticated user's profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
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

**Authorization:** Required (user, admin)

---

### Update User Profile
**PUT** `/users/profile`

Update authenticated user's profile information.

**Headers:**
```
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

**Response (200 OK):**
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

**Authorization:** Required (user, admin)

---

### Get User Dashboard
**GET** `/users/dashboard`

Get dashboard data with complaint statistics for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
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
      }
    ]
  }
}
```

**Authorization:** Required (user)

---

## Complaint Endpoints

### Create Complaint
**POST** `/complaints`

Submit a new complaint.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "category_id": 2,
  "title": "Poor Service Quality",
  "description": "The service received was not up to the expected standard..."
}
```

**Response (201 Created):**
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

**Authorization:** Required (user)

---

### Get Complaint by ID
**GET** `/complaints/{complaint_id}`

Retrieve details of a specific complaint.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `complaint_id` (required) - The ID of the complaint

**Response (200 OK):**
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

**Authorization:** Required (user, admin)

---

### Get User's Complaints
**GET** `/complaints/user/{user_id}`

Retrieve all complaints submitted by a specific user.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `user_id` (required) - The ID of the user

**Response (200 OK):**
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

**Authorization:** Required (user)

---

### Get Complaint Categories
**GET** `/complaints/categories/all`

Retrieve all available complaint categories.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "category_id": 1,
      "name": "Service Quality",
      "description": "Issues related to service quality"
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
    }
  ]
}
```

**Authorization:** Required (user)

---

## Admin Endpoints

### Get All Complaints
**GET** `/admin/complaints`

Retrieve all complaints in the system (paginated).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10)
- `status` (optional) - Filter by status (pending, in_progress, resolved)

**Response (200 OK):**
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

**Authorization:** Required (admin)

---

### Update Complaint Status
**PUT** `/complaints/{complaint_id}/status`

Update the status of a complaint.

**Headers:**
```
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
- `pending` - New complaint
- `in_progress` - Being handled
- `resolved` - Complaint resolved

**Response (200 OK):**
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

**Authorization:** Required (admin)

---

### Add Response to Complaint
**POST** `/complaints/{complaint_id}/response`

Add an admin response to a complaint.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters:**
- `complaint_id` (required) - The ID of the complaint

**Request Body:**
```json
{
  "response": "We have reviewed your complaint and are taking action..."
}
```

**Response (201 Created):**
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

**Authorization:** Required (admin)

---

## Admin Reporting Endpoints

### Get Complaint Category Report
**GET** `/reports/complaint-category`

Generate a report of complaints grouped by category.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `start_date` (optional) - ISO 8601 date format (YYYY-MM-DD)
- `end_date` (optional) - ISO 8601 date format (YYYY-MM-DD)

**Response (200 OK):**
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

**Authorization:** Required (admin)

---

### Get Resolution Status Report
**GET** `/reports/resolution-status`

Generate a report of complaints grouped by resolution status.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `start_date` (optional) - ISO 8601 date format (YYYY-MM-DD)
- `end_date` (optional) - ISO 8601 date format (YYYY-MM-DD)

**Response (200 OK):**
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

**Authorization:** Required (admin)

---

## Authentication

### JWT Token

All protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Lifespan:** Tokens are valid for 24 hours (configurable).

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message describing what went wrong",
  "statusCode": 400
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or validation error |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

### Common Error Messages

- `"Invalid credentials"` - Email or password is incorrect
- `"User already exists"` - Email is already registered
- `"Unauthorized"` - Token is missing or invalid
- `"Access denied"` - User role doesn't have permission
- `"Validation failed"` - Required fields are missing
- `"Complaint not found"` - Complaint ID doesn't exist

---

## Project Structure

```
complaint-api-v2/
├── config/                 # Configuration files
│   ├── DatabaseConfig.php
│   └── ConfigSensitiveFields.php
├── controllers/            # Request handlers
│   ├── AuthController.php
│   ├── UserController.php
│   ├── ComplaintController.php
│   └── ReportController.php
├── core/                   # Core framework components
│   ├── autoload.php
│   ├── http/
│   │   ├── Request.php
│   │   ├── Response.php
│   │   ├── Router.php
│   │   └── Validator.php
│   └── feature/
│       ├── Jwt.php
│       ├── Encryptor.php
│       └── Decryptor.php
├── middlewares/            # Middleware components
│   ├── ErrorMiddleware.php
│   ├── CorsMiddleware.php
│   ├── AuthMiddleware.php
│   └── FeatureMiddleware.php
├── models/                 # Data models
│   ├── UserModel.php
│   ├── ComplaintModel.php
│   └── ReportModel.php
├── routes/                 # Route definitions
│   ├── AuthRoutes.php
│   ├── UserRoutes.php
│   ├── ComplaintRoutes.php
│   └── AdminRoutes.php
├── services/               # Business logic
├── utils/                  # Utility functions
│   └── generateId.php
├── .env.example            # Environment variables example
├── .htaccess               # Apache configuration
├── main.php                # Application entry point
└── README.md               # This file
```

---

## Development Notes

### Middleware Stack

The API uses the following middleware stack (in order):

1. **ErrorMiddleware** - Catches and handles exceptions
2. **CorsMiddleware** - Handles CORS requests
3. **FeatureMiddleware** - Handles encryption/decryption
4. **AuthMiddleware** - Validates JWT tokens and user roles

### Authentication Flow

1. User registers or logs in
2. API returns JWT token
3. Client includes token in `Authorization: Bearer <token>` header
4. AuthMiddleware validates token and attaches user context to request
5. Controller checks user permissions

### Security Features

- **JWT Authentication** - Stateless, secure token-based auth
- **Password Hashing** - Bcrypt for secure password storage
- **AES Encryption** - Sensitive data encryption
- **CORS Protection** - Cross-origin request validation
- **Input Validation** - Request validation middleware

---

## License

This project is licensed under the MIT License

---

## Support

For issues, questions, or contributions, please contact the development team or open an issue in the repository.