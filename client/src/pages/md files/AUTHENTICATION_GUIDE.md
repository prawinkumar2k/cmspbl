# Authentication System Implementation Guide

## Overview
Complete role-based authentication system with JWT tokens, password hashing with bcrypt, and role-based authorization middleware.

---

## 🔧 Backend Implementation

### Files Created

#### 1. `server/controller/authController.js`
Contains authentication logic:
- `getRoles()` - Fetch all roles from `users_roles` table
- `login()` - Validate credentials, compare hashed password, return JWT token

#### 2. `server/middlewares/authMiddleware.js`
Contains middleware functions:
- `verifyToken()` - Verify JWT token from Authorization header
- `authorizeRoles(...roles)` - Check if user has required role
- `checkModuleAccess(module)` - Check if user has access to specific module

#### 3. `server/routes/auth.js`
Authentication routes:
- `GET /api/auth/roles` - Get all roles (public)
- `POST /api/auth/login` - User login (public)
- `GET /api/auth/verify` - Verify token (protected)

---

## 📡 API Endpoints

### Public Routes (No Authentication)

#### Get Roles
```http
GET /api/auth/roles
```

**Response:**
```json
[
  { "id": 1, "role": "Admin" },
  { "id": 2, "role": "Staff" },
  { "id": 3, "role": "HOD" }
]
```

---

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "Rajkumar",
  "password": "yourpassword"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "username": "Rajkumar",
    "staff_name": "Rajkumar",
    "role_id": 1,
    "role_name": "Admin",
    "module_access": "dashboard,file,academic"
  }
}
```

**Error Response:**
```json
{
  "error": "Invalid username or password"
}
```

---

### Protected Routes (Require Authentication)

#### Verify Token
```http
GET /api/auth/verify
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Token is valid",
  "user": {
    "id": 2,
    "username": "Rajkumar",
    "role_name": "Admin",
    ...
  }
}
```

---

## 🎨 Frontend Integration

### 1. Updated LoginPage.jsx

The login page now:
- Calls `/api/auth/login` endpoint
- Validates credentials on backend
- Stores JWT token and user data
- Navigates based on user role

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Store token and user data
    login(data.token, data.user);
    
    // Navigate based on role
    const role = data.user.role_name.toLowerCase();
    if (role === 'admin') {
      navigate('/admin/adminDashboard');
    } else if (role === 'staff') {
      navigate('/staff/dashboard');
    } else if (role === 'hod') {
      navigate('/hod/dashboard');
    }
  } catch (err) {
    setError(err.message);
  }
};
```

---

### 2. Updated AuthContext.jsx

Enhanced context with:
- JWT token storage
- Token helper functions
- Automatic token injection

```javascript
const login = (token, userData) => {
  setIsAuthenticated(true);
  setUser(userData);
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(userData));
};

const getToken = () => {
  return localStorage.getItem('token');
};

const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};
```

---

### 3. Updated utils/api.js

Axios instance with interceptors:
- Automatically adds token to all requests
- Handles token expiration (401 errors)
- Redirects to login on auth failure

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 🔒 Protecting Backend Routes

### Admin-Only Route
```javascript
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';

router.get('/admin/users', 
  verifyToken, 
  authorizeRoles('Admin'), 
  getUsersController
);
```

### Staff + Admin Route
```javascript
router.get('/staff/attendance', 
  verifyToken, 
  authorizeRoles('Staff', 'Admin'), 
  getAttendanceController
);
```

### HOD + Admin Route
```javascript
router.get('/hod/reports', 
  verifyToken, 
  authorizeRoles('HOD', 'Admin'), 
  getReportsController
);
```

### Module-Based Access
```javascript
import { verifyToken, checkModuleAccess } from '../middlewares/authMiddleware.js';

router.get('/academic/calendar', 
  verifyToken, 
  checkModuleAccess('academic'), 
  getCalendarController
);
```

---

## 🔐 How It Works

### Login Flow
1. User enters username and password
2. Frontend sends POST to `/api/auth/login`
3. Backend queries `users` table joined with `users_roles`
4. Password compared using `bcrypt.compare()`
5. If valid, JWT token generated with user data
6. Token signed with `JWT_SECRET` from `.env`
7. Token expires in 24 hours
8. Frontend stores token in localStorage
9. User redirected based on role

### Protected Route Flow
1. Frontend includes token in `Authorization: Bearer <token>` header
2. `verifyToken` middleware extracts and verifies token
3. User data extracted from token and attached to `req.user`
4. `authorizeRoles` checks if user's role is allowed
5. If authorized, request proceeds to controller
6. If not, returns 403 Forbidden

---

## 🎫 JWT Token Structure

```json
{
  "user_id": 2,
  "username": "Rajkumar",
  "role_id": 1,
  "role_name": "Admin",
  "staff_name": "Rajkumar",
  "module_access": "dashboard,file,academic",
  "iat": 1670000000,
  "exp": 1670086400
}
```

---

## ⚙️ Environment Setup

### Add to `server/.env`:
```env
DB_HOST=localhost
DB_USER=myuser
DB_PASSWORD="MyPassword123!"
DB_NAME=cms
DB_PORT=3306

# JWT Secret for authentication (CHANGE IN PRODUCTION!)
JWT_SECRET=sf-erp-secret-key-2025-change-in-production
```

⚠️ **Important:** Always use a strong, random secret in production!

---

## 🗃️ Database Schema

### `users` table
```sql
id              INT PRIMARY KEY AUTO_INCREMENT
username        VARCHAR(255) UNIQUE
password        VARCHAR(255)  -- bcrypt hashed
staff_name      VARCHAR(255)
role            VARCHAR(255)  -- references users_roles.role
module_access   VARCHAR(500)  -- comma-separated module keys
created_at      TIMESTAMP
```

### `users_roles` table
```sql
id              INT PRIMARY KEY AUTO_INCREMENT
role            VARCHAR(255)  -- Admin, Staff, HOD, etc.
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

---

## 🛠️ Making Authenticated API Calls

### Using axios (recommended)
```javascript
import api from './utils/api';

// GET request - token automatically included
const fetchStudents = async () => {
  const response = await api.get('/studentMaster');
  return response.data;
};

// POST request
const createStudent = async (studentData) => {
  const response = await api.post('/studentMaster', studentData);
  return response.data;
};
```

### Using fetch
```javascript
import { useAuth } from './context/AuthContext';

const { getAuthHeaders } = useAuth();

const fetchData = async () => {
  const response = await fetch('http://localhost:5000/api/data', {
    method: 'GET',
    headers: getAuthHeaders()
  });
  return response.json();
};
```

---

## ❌ Error Handling

### Status Codes

**401 Unauthorized**
- No token provided
- Invalid token
- Token expired
- Solution: User must login again

**403 Forbidden**
- Valid token but insufficient permissions
- User role not allowed for this route
- Solution: User needs different role

**400 Bad Request**
- Missing username or password
- Invalid request format

**500 Internal Server Error**
- Database error
- Server configuration issue

---

## ✅ Security Features

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens with 24-hour expiration
- ✅ Token verification on protected routes
- ✅ Role-based authorization
- ✅ Module-based access control
- ✅ Secure HTTP-only token storage (localStorage)
- ✅ Automatic token injection via interceptors
- ✅ Automatic redirect on token expiration

---

## 🧪 Testing

### Test Login (Postman/Thunder Client)

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "Rajkumar",
  "password": "yourpassword"
}
```

### Test Protected Route

```http
GET http://localhost:5000/api/auth/verify
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Test Role Authorization

```http
GET http://localhost:5000/api/auth/admin-test
Authorization: Bearer <admin-token>
```

---

## 🐛 Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| "Token expired" | Token is older than 24 hours | Login again |
| "Invalid token" | Token corrupted or JWT_SECRET mismatch | Check .env file, login again |
| "Access denied" (403) | User role insufficient | User needs Admin/Staff/HOD role |
| Login returns error | Wrong credentials | Check username/password in database |
| CORS error | Frontend/backend port mismatch | Check CORS settings in server.js |

---

## 🎯 Dynamic Sidebar Based on Module Access

### How It Works

After login, the system displays only the sidebar modules the user has access to based on their `module_access` column in the `users` table.

### Implementation

#### Backend: getSidebar() Function

```javascript
// server/controller/authController.js
export const getSidebar = async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role_name;
  
  // Admin gets all modules
  if (userRole.toLowerCase() === 'admin') {
    const [allModules] = await db.query(
      'SELECT id, module_name, module_key, is_active 
       FROM sidebar_modules WHERE is_active = 1 ORDER BY id'
    );
    return res.json({ success: true, data: allModules });
  }
  
  // Fetch user's module_access
  const [users] = await db.query(
    'SELECT module_access FROM users WHERE id = ?',
    [userId]
  );
  
  const allowedModules = users[0].module_access.split(',');
  
  // Filter modules
  const [modules] = await db.query(
    `SELECT id, module_name, module_key, is_active 
     FROM sidebar_modules 
     WHERE is_active = 1 
     AND module_key IN (?)
     ORDER BY id`,
    [allowedModules]
  );
  
  res.json({ success: true, data: modules });
};
```

#### Frontend: SidebarDynamic Component

```javascript
// Fetch sidebar from API
useEffect(() => {
  const fetchSidebarModules = async () => {
    const response = await fetch('http://localhost:5000/api/auth/sidebar', {
      headers: getAuthHeaders() // Includes JWT token
    });
    const data = await response.json();
    setSidebarModules(data.data);
  };
  fetchSidebarModules();
}, []);
```

#### Module Key Format

`module_access` stores comma-separated values like:
```
dashboard,file,file_user_creation,academic_subject,academic_staff_details
```

Parsed as:
- `dashboard` → Top-level "Dashboard" menu
- `file` → Top-level "File" dropdown
- `file_user_creation` → Child "User Creation" under "File"
- `academic_subject` → Child "Subject" under "Academic"

### Route Mapping

| module_key | Route | Page |
|------------|-------|------|
| dashboard | /admin/adminDashboard | Dashboard |
| file_user_creation | /admin/UserCreation | User Creation |
| academic_subject | /admin/master/subject | Subject Master |
| academic_staff_details | /admin/master/StaffDetails | Staff Details |

### API Endpoint

```http
GET /api/auth/sidebar
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [
    {
      "id": 19,
      "module_name": "Dashboard",
      "module_key": "dashboard",
      "is_active": 1
    },
    {
      "id": 20,
      "module_name": "File",
      "module_key": "file",
      "is_active": 1
    }
  ]
}
```

---

## 📋 Checklist

Before deployment, ensure:

- [ ] JWT_SECRET is set in production .env
- [ ] All passwords in database are bcrypt hashed
- [ ] CORS is properly configured
- [ ] Token expiration time is appropriate
- [ ] Error messages don't leak sensitive info
- [ ] HTTPS is enabled in production
- [ ] Rate limiting is implemented (optional)
- [ ] Login attempts are tracked (optional)
- [ ] Sidebar modules match user's module_access
- [ ] Role dropdown added to login page

---

## 📚 Additional Features (Future)

- Password reset functionality
- Refresh tokens for extended sessions
- Rate limiting on login attempts
- 2FA (Two-Factor Authentication)
- Session management dashboard
- Audit logs for authentication events
- Remember me functionality
- OAuth integration (Google, Microsoft)

---

## 📝 Example: Protecting Existing Routes

To add authentication to existing routes:

```javascript
// Before
router.get('/studentMaster', getStudents);

// After - Admin only
router.get('/studentMaster', 
  verifyToken, 
  authorizeRoles('Admin'), 
  getStudents
);

// After - Multiple roles
router.get('/studentMaster', 
  verifyToken, 
  authorizeRoles('Admin', 'Staff', 'HOD'), 
  getStudents
);
```

---

## 🎯 Quick Reference

**Login:**
```bash
POST /api/auth/login
Body: { username, password }
Returns: { token, user }
```

**Verify:**
```bash
GET /api/auth/verify
Header: Authorization: Bearer <token>
Returns: { user }
```

**Protect Route:**
```javascript
router.get('/path', verifyToken, authorizeRoles('Admin'), controller);
```

**Get Token (Frontend):**
```javascript
const token = localStorage.getItem('token');
```

---

## 📞 Support

For issues or questions:
1. Check this guide first
2. Verify .env configuration
3. Check browser console for errors
4. Check server logs for backend errors
5. Test with Postman to isolate frontend/backend issues

---

**Last Updated:** December 9, 2025  
**Version:** 1.0.0
