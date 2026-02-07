<img width="1920" height="1080" alt="Снимок экрана_20260207_171056" src="https://github.com/user-attachments/assets/0e8d1945-6c0e-4ee1-8916-126db840b547" /># Assignment 3: MongoDB CRUD API with Authentication & MVC Architecture

A full-stack web application with a MongoDB-based CRUD API featuring professional security measures, Role-Based Access Control (RBAC), and a scalable MVC (Model-View-Controller) architecture. This project demonstrates data persistence, complex object schemas, relationship management, authentication, and authorization.

## 🌟 Features

### Core Requirements
- **Product Management**: Full CRUD operations for products
  - Create, Read, Update, and Delete products
  - Product schema with name, price, description, category
  - Automatic timestamps (createdAt, updatedAt)
  
- **Review Management**: Secondary CRUD operations for product reviews
  - Create, Read, Update, and Delete reviews
  - Review schema with product reference, reviewer name, rating, and comment
  - Relationship management between products and reviews

### Security & Authentication
- **User Authentication**: Session-based authentication system using cookies (express-session)
- **Password Security**: Bcrypt password hashing (never store plain-text passwords)
- **Session Management**: Sessions stored in MongoDB with secure httpOnly cookies
- **Role-Based Access Control (RBAC)**:
  - **Public Access**: GET routes (read operations) are open to everyone
  - **Protected Access**: POST, PUT, DELETE routes require authentication
  - **Admin Access**: Only users with "admin" role can create, update, or delete products
  - **User Access**: Regular users can view products and place orders
- **User Roles**: "user" (default) and "admin"

### Architecture
- **MVC Pattern**: Clean separation of concerns
  - **Models**: MongoDB/Mongoose schemas
  - **Views**: Frontend HTML/CSS/JavaScript
  - **Controllers**: Business logic and request handling
- **Modular Structure**: Organized into routes, controllers, middleware, and models
- **Error Handling**: Centralized error handling middleware

### User Interface
- **Modern Design**: Clean, responsive interface with dark theme
- **Product List View**: Grid layout displaying all products
- **Add Product Form**: Simple form to create new products (requires admin authentication)
- **Real-time Updates**: Automatic refresh after creating/deleting products
- **Error Handling**: User-friendly error messages

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** (v14 or higher) installed on your system
- **npm** (Node Package Manager) installed
- **MongoDB** installed locally OR a MongoDB Atlas account (cloud)

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

#### Option A: MongoDB Atlas (Cloud - Recommended)

```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/productsdb
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
```

#### Option B: Local MongoDB

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/productsdb
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
```

**Important**: Change `SESSION_SECRET` to a strong, random string in production!

### 3. Start the Server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## 🏗️ Project Structure (MVC Architecture)

```
web2assign2-main/
│
├── server.js                 # Main server file (entry point)
├── package.json              # Project dependencies and scripts
├── .env                      # Environment variables (create this file)
├── README.md                 # This file
│
├── config/                   # Configuration files
│   └── database.js          # MongoDB connection configuration
│
├── models/                   # Mongoose schemas (Data Layer)
│   ├── Product.js           # Product model schema
│   ├── Review.js            # Review model schema
│   └── User.js              # User model schema (with password hashing)
│
├── controllers/              # Business logic (Controller Layer)
│   ├── productController.js # Product CRUD operations
│   ├── reviewController.js  # Review CRUD operations
│   └── authController.js    # Authentication operations
│
├── routes/                   # API route definitions
│   ├── products.js          # Product routes with auth middleware
│   ├── reviews.js           # Review routes with auth middleware
│   └── auth.js              # Authentication routes
│
├── middleware/               # Middleware functions
│   ├── auth.js              # Session authentication & RBAC middleware
│   ├── validation.js        # Input validation middleware
│   └── errorHandler.js      # Centralized error handling
│
└── public/                   # Frontend static files (View Layer)
    ├── index.html           # Main HTML file
    ├── css/
    │   └── style.css        # Stylesheet with responsive design
    └── js/
        └── app.js           # Frontend JavaScript logic
```

## 📊 Database Schema

### User Schema
- `email` (String, required, unique): User email address
- `password` (String, required, hashed): User password (hashed with bcrypt)
- `role` (String, enum: ['user', 'admin'], default: 'user'): User role
- `createdAt` (Date, auto): Creation timestamp
- `updatedAt` (Date, auto): Last update timestamp

### Product Schema
- `name` (String, required): Product name
- `price` (Number, required): Product price (must be >= 0)
- `description` (String, required): Product description
- `category` (String, required): Product category
- `createdAt` (Date, auto): Creation timestamp
- `updatedAt` (Date, auto): Last update timestamp

### Review Schema
- `productId` (ObjectId, required, ref: Product): Reference to product
- `reviewerName` (String, required): Name of reviewer
- `rating` (Number, required): Rating between 1-5
- `comment` (String, required): Review comment
- `createdAt` (Date, auto): Creation timestamp
- `updatedAt` (Date, auto): Last update timestamp

## 📡 API Endpoints

### Authentication API

#### Register a New User
**POST** `/api/auth/register`

**Access**: Public

Request Body:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}
```

Response (201 Created):
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "role": "user"
  }
}
```

**Note**: Session cookie is automatically set in the response. No token needed!

#### Login
**POST** `/api/auth/login`

**Access**: Public

Request Body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response (200 OK):
```json
{
  "message": "Login successful",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "role": "user"
  }
}
```

**Note**: Session cookie is automatically set in the response. No token needed!

#### Get Current User Profile
**GET** `/api/auth/profile`

**Access**: Protected (requires authentication)

**Note**: Session cookie is automatically sent with requests. No headers needed!

Response (200 OK):
```json
{
  "user": {
    "id": "...",
    "email": "user@example.com",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Products API

#### Create a Product
**POST** `/api/products`

**Access**: Admin only (requires authentication + admin role)

**Note**: Session cookie is automatically sent with requests. Make sure you're logged in as an admin!

**Note**: Session cookie is automatically sent with requests. Make sure you're logged in as an admin!

Request Body:
```json
{
  "name": "Laptop",
  "price": 999.99,
  "description": "High-performance laptop for work and gaming",
  "category": "Electronics"
}
```

Response (201 Created):
```json
{
  "message": "Product created successfully",
  "product": {
    "_id": "...",
    "name": "Laptop",
    "price": 999.99,
    "description": "High-performance laptop for work and gaming",
    "category": "Electronics",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Get All Products
**GET** `/api/products`

**Access**: Public (no authentication required)

Response (200 OK):
```json
{
  "count": 2,
  "products": [
    {
      "_id": "...",
      "name": "Laptop",
      "price": 999.99,
      "description": "High-performance laptop",
      "category": "Electronics",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### Get Product by ID
**GET** `/api/products/:id`

**Access**: Public (no authentication required)

#### Update Product
**PUT** `/api/products/:id`

**Access**: Admin only (requires authentication + admin role)

**Note**: Session cookie is automatically sent with requests. Make sure you're logged in as an admin!

**Note**: Session cookie is automatically sent with requests. Make sure you're logged in as an admin!

#### Delete Product
**DELETE** `/api/products/:id`

**Access**: Admin only (requires authentication + admin role)

**Note**: Session cookie is automatically sent with requests. Make sure you're logged in as an admin!

**Note**: Session cookie is automatically sent with requests. Make sure you're logged in as an admin!

### Reviews API

#### Create a Review
**POST** `/api/reviews`

**Access**: Admin only (requires authentication + admin role)

**Note**: Session cookie is automatically sent with requests. Make sure you're logged in as an admin!

#### Get All Reviews
**GET** `/api/reviews`

**Access**: Public (no authentication required)

#### Get Review by ID
**GET** `/api/reviews/:id`

**Access**: Public (no authentication required)

#### Update Review
**PUT** `/api/reviews/:id`

**Access**: Admin only (requires authentication + admin role)

**Note**: Session cookie is automatically sent with requests. Make sure you're logged in as an admin!

#### Delete Review
**DELETE** `/api/reviews/:id`

**Access**: Admin only (requires authentication + admin role)

**Note**: Session cookie is automatically sent with requests. Make sure you're logged in as an admin!

## 🔐 Authentication & Authorization

### How Authentication Works

1. **Register/Login**: User registers or logs in and a session is created
2. **Session Cookie**: A secure httpOnly cookie is automatically set in the browser
3. **Automatic Authentication**: The session cookie is automatically sent with every request
4. **Session Expiration**: Sessions expire after 14 days (configurable in server.js)
5. **No Manual Token Management**: Unlike JWT, you don't need to manually include tokens in headers

### Access Control

| Operation | Route Type | Access Level |
|-----------|-----------|--------------|
| GET (Read) | Products, Reviews | Public (No auth required) |
| POST (Create) | Products, Reviews | Admin only |
| PUT (Update) | Products, Reviews | Admin only |
| DELETE | Products, Reviews | Admin only |

### Creating an Admin User

To create an admin user, register with `role: "admin"`:

```bash
POST /api/auth/register
{
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```

**Note**: After registration, you'll be automatically logged in via session cookie.

## 🧪 Testing the API

### Using Postman

1. **Register a User**:
   - Method: POST
   - URL: `http://localhost:3000/api/auth/register`
   - Headers: `Content-Type: application/json`
   - Body (JSON):
     ```json
     {
       "email": "test@example.com",
       "password": "password123",
       "role": "admin"
     }
     ```
   - **Note**: Session cookie is automatically set. No token to copy!

2. **Create a Product** (Admin only):
   - Method: POST
   - URL: `http://localhost:3000/api/products`
   - Headers: `Content-Type: application/json`
   - **Note**: Session cookie is automatically sent. Make sure you're logged in as admin!
   - Body (JSON):
     ```json
     {
       "name": "Test Product",
       "price": 29.99,
       "description": "This is a test product",
       "category": "Test Category"
     }
     ```

3. **Get All Products** (Public):
   - Method: GET
   - URL: `http://localhost:3000/api/products`
   - No authentication required

### Using cURL

```bash
# Register a user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","role":"admin"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Create a product (use -c cookies.txt to save session cookie, -b cookies.txt to use it)
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -b cookies.txt \
  -d '{"name":"Test Product","price":29.99,"description":"Test","category":"Test"}'

# Get all products (no auth required)
curl http://localhost:3000/api/products
```

## 🔧 Error Handling

The API returns appropriate HTTP status codes:

- `200 OK`: Successful GET, PUT, DELETE
- `201 Created`: Successful POST
- `400 Bad Request`: Validation errors or invalid input
- `401 Unauthorized`: Authentication required or invalid token
- `403 Forbidden`: Insufficient permissions (not admin)
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server errors

Error Response Format:
```json
{
  "error": "Error message",
  "details": ["Detail 1", "Detail 2"]
}
```

## 🔧 Troubleshooting

### Server won't start
- Ensure Node.js is installed: `node --version`
- Check if port 3000 is already in use
- Verify all dependencies are installed: `npm install`
- Check MongoDB connection string in `.env` file
- Verify SESSION_SECRET is set in `.env` file

### Authentication errors
- Verify you're logged in (check session cookie)
- Try logging out and logging back in
- Clear browser cookies and try again
- Check that SESSION_SECRET is set in `.env` file

### Authorization errors (403 Forbidden)
- Ensure user has "admin" role for POST, PUT, DELETE operations
- Verify you're logged in as an admin user
- Check user role in database or via `/api/auth/profile` endpoint

### MongoDB connection errors
- Verify MongoDB is running (if using local instance)
- Check MongoDB Atlas connection string (if using cloud)
- Ensure network access is configured in MongoDB Atlas
- Verify database user credentials

### Validation errors
- Ensure all required fields are provided
- Check data types match schema requirements
- Verify email format for user registration/login
- Ensure password is at least 6 characters

## 📝 Security Best Practices

1. **Session Secret**: Always use a strong, random SESSION_SECRET in production
2. **Password Hashing**: Passwords are automatically hashed using bcrypt (never stored in plain text)
3. **Session Expiration**: Sessions expire after 14 days (configurable in server.js)
4. **HttpOnly Cookies**: Session cookies are httpOnly to prevent XSS attacks
5. **Environment Variables**: Never commit `.env` file to version control
6. **HTTPS**: Use HTTPS in production to protect session cookies in transit (secure flag enabled)
7. **Input Validation**: All inputs are validated before processing
8. **Session Storage**: Sessions are stored in MongoDB for persistence across server restarts

## 🎯 MVC Architecture Benefits

- **Separation of Concerns**: Clear division between data (models), logic (controllers), and presentation (views)
- **Maintainability**: Easy to locate and modify specific functionality
- **Scalability**: Can easily add new features without affecting existing code
- **Testability**: Controllers and models can be tested independently
- **Reusability**: Middleware and controllers can be reused across routes

<img width="1920" height="1080" alt="Снимок экрана_20260207_171112" src="https://github.com/user-attachments/assets/f064f2fa-59c2-4ddf-8b35-8ccfcf2d11c3" /><img width="1920" height="1080" alt="Снимок экрана_20260207_171051" src="https://github.com/user-attachments/assets/cb161f5c-187f-4767-b25a-1db7a70234c5" />
<img width="1920" height="1080" alt="Снимок экрана_20260207_172329" src="https://github.com/user-attachments/assets/c1a40ebc-3971-4306-925c-7477a2204d48" />
<img width="1920" height="1080" alt="Снимок экрана_20260207_171903" src="https://github.com/user-attachments/assets/25d6a30e-ddd6-46b0-af17-a7435d4bc2c2" />
<img width="1920" height="1080" alt="Снимок экрана_20260207_171900" src="https://github.com/user-attachments/assets/ce0280a2-0335-4731-85ee-139ade3be523" />
<img width="1920" height="1080" alt="Снимок экрана_20260207_171857" src="https://github.com/user-attachments/assets/822754f7-c978-4432-bd94-83dca5d69657" />
<img width="1920" height="1080" alt="Снимок экрана_20260207_171848" src="https://github.com/user-attachments/assets/807f35c9-909a-447f-bd87-34e8e4eb6f78" />
<img width="1920" height="1080" alt="Снимок экрана_20260207_171601" src="https://github.com/user-attachments/assets/5a8af171-0d78-44dc-9ace-53d70df3f99f" />
<img width="1920" height="1080" alt="Снимок экрана_20260207_171553" src="https://github.com/user-attachments/assets/c82f050e-5d8b-4f84-91ea-172484fcecf3" />
<img width="1920" height="1080" alt="Снимок экрана_20260207_171549" src="https://github.com/user-attachments/assets/2420c935-f460-4ac6-b5ac-51621f81efc0" />
<img width="1920" height="1080" alt="Снимок экрана_20260207_171535" src="https://github.com/user-attachments/assets/6e8756af-af13-42e9-af2a-35be3bcdf0db" />
<img width="1920" height="1080" alt="Снимок экрана_20260207_171528" src="https://github.com/user-attachments/assets/ddfb6354-c2ad-42e4-b3eb-1a8e76b065e9" />
<img width="1920" height="1080" alt="Снимок экрана_20260207_171523" src="https://github.com/user-attachments/assets/99de58a6-6593-4e09-9621-f4375bf487c5" />
<img width="1920" height="1080" alt="Снимок экрана_20260207_171511" src="https://github.com/user-attachments/assets/f74e607d-5f08-4659-bd48-2e5a609d1826" />
<img width="1920" height="1080" alt="Снимок экрана_20260207_171415" src="https://github.com/user-attachments/assets/527a6872-0a5b-41e0-a168-b03c449eee0d" />
<img width="1920" height="1080" alt="Снимок экрана_20260207_171206" src="https://github.com/user-attachments/assets/c5e46639-bc0a-4d30-b639-ac4ecc6b1c55" />
<img width="1920" height="1080" alt="Снимок экрана_20260207_171200" src="https://github.com/user-attachments/assets/c7f98070-1715-4fb5-b27d-e0784b98b0d9" />
<img width="1920" height="1080" alt="Снимок экрана_20260207_171155" src="https://github.com/user-attachments/assets/18e01fec-dbae-40b9-95d8-7c7ba552b7b1" />
<img width="1920" height="1080" alt="Снимок экрана_20260207_171149" src="https://github.com/user-attachments/assets/736823e9-a3da-4c8e-9a6a-6feb57eac44e" />
<img width="1920" height="1080" alt="Снимок экрана_20260207_171145" src="https://github.com/user-attachments/assets/2c7566f8-8302-4ced-a9ae-fe538a27082a" />
<img width="1920" height="1080" alt="Снимок экрана_20260207_171139" src="https://github.com/user-attachments/assets/bccf17f0-b820-4338-8eac-1c8c55c033a8" />
<img width="1920" height="1080" alt="Снимок экрана_20260207_171136" src="https://github.com/user-attachments/assets/f1a71d0a-9979-40df-a95b-73a99021a5f1" />
<img width="1920" height="1080" alt="Снимок экрана_20260207_171128" src="https://github.com/user-attachments/assets/f57d0b03-2893-40d3-b376-cced0390e5f5" />
<img width="29" height="35" alt="Снимок экрана_20260207_171123" src="https://github.com/user-attachments/assets/0ab685d7-29a6-4946-bec1-7efe30c09bda" />
<img width="1920" height="1080" alt="Снимок экрана_20260207_171120" src="https://github.com/user-attachments/assets/4e0e75d0-a4af-4ce6-aa50-c951490923e8" />

