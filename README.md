# 🏢 Priya Tech Agency - Software Solutions Portal

A full-stack web application for managing software development projects with role-based access control. The platform enables seamless collaboration between admins, employees, and clients with features for project management, service offerings, messaging, and service requests.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Folder Structure Explanation](#folder-structure-explanation)
- [User Roles & Permissions](#user-roles--permissions)
- [Development Guidelines](#development-guidelines)
- [Deployment](#deployment)

---

## 🎯 Project Overview

**Priya Tech Agency** is a comprehensive Software Solutions Portal built with the MERN stack (MongoDB, Express, React, Node.js). It provides a platform for:

- **Admins** to manage users, services, projects, and view analytics
- **Employees** to manage assigned projects, communicate with clients, and track work
- **Clients** to request services, view projects, and communicate with the team

The application implements role-based access control (RBAC) with JWT authentication, ensuring secure and organized access to features based on user roles.

---

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login with email verification
- JWT-based token authentication
- Role-based access control (Admin, Employee, Client)
- Separate login portals for different user types
- Secure password hashing with bcryptjs

### 👥 User Management
- Admin dashboard for user management
- User role assignment
- User profile management
- User activity tracking

### 🛠️ Service Management
- Define and manage services offered
- Service categorization
- Admin can create/edit/delete services
- Clients can browse available services

### 📊 Project Management
- Create and manage projects
- Assign projects to employees
- Track project progress and status
- Real-time updates
- Project timeline and milestones

### 💬 Messaging System
- Real-time messaging between users
- Message history
- Notification system
- Multi-user conversations

### 📋 Service Requests
- Clients can request services
- Track request status
- Admin approval workflow
- Service request history

### 📱 Responsive Dashboard
- Role-specific dashboards
- Admin analytics and overview
- Employee task management
- Client project tracking

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI library
- **React Router DOM 6.20** - Client-side routing
- **Vite 5.0** - Build tool and dev server
- **Tailwind CSS 3.3** - Utility-first CSS framework
- **Axios 1.6** - HTTP client
- **React Hot Toast 2.4** - Toast notifications
- **PostCSS & Autoprefixer** - CSS processing

### Backend
- **Node.js** - JavaScript runtime
- **Express 4.18** - Web framework
- **MongoDB & Mongoose 8.0** - NoSQL database
- **JWT (jsonwebtoken 9.0)** - Token-based authentication
- **bcryptjs 2.4** - Password hashing
- **CORS 2.8** - Cross-origin resource sharing
- **dotenv 16.3** - Environment variables
- **Nodemon 3.0** - Development auto-reload
- **express-async-handler 1.2** - Async error handling

---

## 📁 Project Structure

```
software/
├── client/                          # React frontend application
│   ├── src/
│   │   ├── App.jsx                 # Main app component with routing
│   │   ├── main.jsx                # React entry point
│   │   ├── index.css               # Global styles
│   │   ├── components/             # Reusable UI components
│   │   ├── context/                # React context (Auth)
│   │   ├── pages/                  # Page components
│   │   ├── routes/                 # Route protection logic
│   │   └── services/               # API service files
│   ├── index.html                  # HTML template
│   ├── package.json                # Frontend dependencies
│   ├── vite.config.js              # Vite configuration
│   ├── tailwind.config.js          # Tailwind CSS config
│   └── postcss.config.js           # PostCSS config
│
└── server/                          # Express backend application
    ├── config/                     # Database configuration
    ├── controllers/                # Request handlers
    ├── middlewares/                # Express middlewares
    ├── models/                     # Mongoose schemas
    ├── routes/                     # API endpoint definitions
    ├── utils/                      # Utility functions
    ├── server.js                   # Server entry point
    ├── package.json                # Backend dependencies
    ├── vercel.json                 # Vercel deployment config
    └── seed*.js                    # Database seed files
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas cloud database)
- Git

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd software
```

### Step 2: Setup Backend

```bash
cd server

# Install dependencies
npm install

# Create .env file in server directory
echo "MONGODB_URI=mongodb://localhost:27017/priya-tech" > .env
echo "JWT_SECRET=your_jwt_secret_key_here" >> .env
echo "PORT=5000" >> .env
echo "NODE_ENV=development" >> .env

# Seed initial data (optional)
npm run seed

# Start development server
npm run dev
```

### Step 3: Setup Frontend

```bash
cd ../client

# Install dependencies
npm install

# Create .env file in client directory (if needed)
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev
```

---

## 🎮 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173 (Vite default)
```

### Production Build

**Frontend Build:**
```bash
cd client
npm run build
# Generates optimized build in dist/ folder
```

**Frontend Preview:**
```bash
npm run preview
```

---

## 📡 API Endpoints

### Authentication Endpoints
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
GET    /api/auth/me            - Get current user (Protected)
```

### User Endpoints
```
GET    /api/users              - Get all users (Admin only)
GET    /api/users/:id          - Get user by ID
PUT    /api/users/:id          - Update user
DELETE /api/users/:id          - Delete user (Admin only)
```

### Service Endpoints
```
GET    /api/services           - Get all services
GET    /api/services/:id       - Get service by ID
POST   /api/services           - Create service (Admin only)
PUT    /api/services/:id       - Update service (Admin only)
DELETE /api/services/:id       - Delete service (Admin only)
```

### Project Endpoints
```
GET    /api/projects           - Get all projects
GET    /api/projects/:id       - Get project by ID
POST   /api/projects           - Create project
PUT    /api/projects/:id       - Update project
DELETE /api/projects/:id       - Delete project
```

### Message Endpoints
```
GET    /api/messages           - Get messages
POST   /api/messages           - Send message
GET    /api/messages/:id       - Get message thread
```

### Service Request Endpoints
```
GET    /api/service-requests   - Get all requests
POST   /api/service-requests   - Create request
PUT    /api/service-requests/:id - Update request status
GET    /api/service-requests/:id - Get request details
```

---

## 🗄️ Database Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  role: String (enum: 'admin', 'employee', 'client'),
  createdAt: Date,
  updatedAt: Date
}
```

### Service Model
```javascript
{
  name: String,
  description: String,
  price: Number, // stored in Indian Rupees (INR)
  category: String,
  features: [String],
  createdBy: ObjectId (Admin reference),
  createdAt: Date,
  updatedAt: Date
}
```

### Project Model
```javascript
{
  title: String,
  description: String,
  client: ObjectId (Client reference),
  assignedTo: [ObjectId] (Employee references),
  status: String (enum: 'planning', 'in-progress', 'completed'),
  startDate: Date,
  endDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Message Model
```javascript
{
  sender: ObjectId (User reference),
  receiver: ObjectId (User reference),
  content: String,
  read: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### ServiceRequest Model
```javascript
{
  client: ObjectId (Client reference),
  service: ObjectId (Service reference),
  status: String (enum: 'pending', 'approved', 'completed'),
  description: String,
  requestedAt: Date,
  completedAt: Date,
  assignedTo: ObjectId (Employee reference)
}
```

---

## 📂 Folder Structure Explanation

### Frontend Structure (`client/src/`)

| Folder | Purpose |
|--------|---------|
| `components/` | Reusable UI components (Card, Modal, Navbar, Sidebar, etc.) |
| `pages/` | Full page components for routing |
| `context/` | React Context API for state management (Auth) |
| `services/` | API calls and external service integration |
| `routes/` | Route protection and authorization logic |
| `pages/admin/` | Admin-specific dashboard pages |
| `pages/employee/` | Employee-specific pages |
| `pages/client/` | Client-specific pages |

### Backend Structure (`server/`)

| Folder | Purpose |
|--------|---------|
| `config/` | Database and environment configuration |
| `controllers/` | Business logic and request handlers |
| `middlewares/` | Auth, error handling, role-based access |
| `models/` | MongoDB/Mongoose data schemas |
| `routes/` | API endpoint definitions |
| `utils/` | Helper functions and custom error classes |

---

## 👥 User Roles & Permissions

### Admin Role
- ✅ Manage all users
- ✅ Create and manage services
- ✅ View all projects and assignments
- ✅ Manage service requests
- ✅ View system analytics
- ✅ Manage all messages

### Employee Role
- ✅ View assigned projects
- ✅ Update project status
- ✅ Communicate with clients and admins
- ✅ Browse available services
- ✅ View assigned service requests
- ❌ Cannot manage other employees
- ❌ Cannot manage services

### Client Role
- ✅ View own projects
- ✅ Request services
- ✅ Communicate with employees
- ✅ Track project progress
- ✅ View service requests history
- ❌ Cannot view other clients' data
- ❌ Cannot manage projects directly

---

## 🔧 Development Guidelines

### Frontend Development
1. Use functional components with React Hooks
2. Leverage Tailwind CSS for styling
3. Keep components modular and reusable
4. Use React Router for navigation
5. Implement error boundaries
6. Use toast notifications for user feedback

### Backend Development
1. Follow Express.js best practices
2. Use controllers for business logic
3. Implement proper error handling
4. Use middleware for authentication/authorization
5. Follow REST API conventions
6. Validate user input on server side
7. Log important operations

### Code Standards
- Use ES6+ JavaScript features
- Follow ESLint recommendations
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Use async/await over callbacks

---

## 🌐 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
# Build the application
cd client
npm run build

# The dist/ folder is ready to deploy
# Connect to Vercel/Netlify and deploy the dist folder
```

### Backend Deployment (Heroku/Railway/AWS)
```bash
# Ensure .env variables are set in deployment platform
# Recommended variables:
# - MONGODB_URI (Atlas URI)
# - JWT_SECRET
# - PORT
# - NODE_ENV=production

# Deploy using platform-specific tools
```

### Environment Variables

**Backend (.env)**
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5000/api
```

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev)

---

## 🐛 Troubleshooting

### Backend won't connect to MongoDB
- Verify MongoDB is running locally or connection string is correct
- Check firewall settings for MongoDB port (27017)
- Ensure .env file has correct MONGODB_URI

### Frontend development server won't start
- Delete `node_modules` and run `npm install` again
- Clear npm cache: `npm cache clean --force`
- Ensure port 5173 is not in use

### Authentication issues
- Verify JWT_SECRET is set in backend .env
- Check that token is being stored correctly in localStorage
- Clear localStorage and login again

### CORS errors
- Ensure backend has CORS enabled
- Verify frontend URL is allowed in backend CORS config
- Check API endpoint URLs in frontend

---

## 📝 License

This project is proprietary software for Priya Tech Agency.

---

## 👨‍💻 Contact & Support

For support or questions, contact the development team at your organization.

---

**Last Updated:** February 2026  
**Version:** 1.0.0

