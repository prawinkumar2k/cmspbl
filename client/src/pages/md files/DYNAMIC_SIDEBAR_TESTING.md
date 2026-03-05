# Dynamic Sidebar Implementation - Testing & Troubleshooting

## ✅ What Was Fixed

### Problem
The dynamic sidebar wasn't working because:
1. `SidebarDynamic` component was created but never used
2. All pages were still importing the old `Sidebar` component
3. The old `Sidebar` was using static `sidebarMenuConfig` instead of API data

### Solution
Updated the existing `Sidebar.jsx` component to:
1. Fetch modules from `/api/auth/sidebar` endpoint
2. Build dynamic sidebar config from API response
3. Fall back to static config if API fails
4. Show loading state while fetching
5. Display user info when using dynamic sidebar

---

## 🔧 How It Works

### Backend Flow:
```
1. User logs in → JWT token generated with user data
2. Frontend stores token in localStorage
3. Sidebar component calls GET /api/auth/sidebar with token
4. Backend verifies token → gets user's module_access
5. Backend queries sidebar_modules table
6. Returns only modules user has access to
7. Frontend builds sidebar menu from response
```

### Frontend Flow:
```javascript
// On component mount
useEffect(() => {
  // Fetch from API
  const response = await fetch('/api/auth/sidebar', {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  const data = await response.json();
  setSidebarModules(data.data);
  
  // Build dynamic config
  const config = buildDynamicSidebarConfig();
  
  // Render sidebar with config
}, [user]);
```

---

## 🧪 Testing Steps

### 1. Test Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "role": "Admin",
  "username": "Rajkumar",
  "password": "10000001"
}
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "username": "Rajkumar",
    "staff_name": "Rajkumar",
    "role_name": "Admin",
    "module_access": "dashboard,file,file_user_creation,academic_subject..."
  }
}
```

### 2. Test Sidebar API
```http
GET http://localhost:5000/api/auth/sidebar
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**
```json
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
    },
    {
      "id": 21,
      "module_name": "User Creation",
      "module_key": "file_user_creation",
      "is_active": 1
    }
  ]
}
```

### 3. Test Frontend
1. Open browser → `http://localhost:3000/login`
2. Select role: "Admin"
3. Enter username: "Rajkumar"
4. Enter password: "10000001"
5. Click "Sign In"
6. Check browser console for:
   - No errors
   - Successful API calls
   - Sidebar modules loaded
7. Verify sidebar shows only assigned modules

---

## 🐛 Troubleshooting

### Issue 1: Sidebar shows all modules (not filtered)
**Cause:** User is Admin role
**Solution:** Admin users get ALL modules by design. Test with Staff/HOD role.

### Issue 2: Sidebar is empty
**Possible Causes:**
1. `module_access` column is NULL or empty
2. No matching modules in `sidebar_modules` table
3. Token expired or invalid

**Debug:**
```sql
-- Check user's module_access
SELECT id, username, role, module_access FROM users WHERE username = 'Rajkumar';

-- Check sidebar_modules table
SELECT * FROM sidebar_modules WHERE is_active = 1;

-- Verify module_key matches
SELECT * FROM sidebar_modules WHERE module_key IN ('dashboard', 'file', 'academic_subject');
```

### Issue 3: API returns 401 Unauthorized
**Causes:**
1. Token not included in request
2. Token expired (24 hours)
3. JWT_SECRET mismatch

**Fix:**
```javascript
// Check localStorage
console.log('Token:', localStorage.getItem('token'));

// Check headers
const headers = getAuthHeaders();
console.log('Headers:', headers);
```

### Issue 4: Sidebar shows loading forever
**Cause:** API call failing
**Debug:**
```javascript
// Open browser console
// Look for network errors
// Check Response tab in Network panel
```

### Issue 5: Module keys don't match
**Problem:** `module_access` has wrong format
**Expected Format:**
```
dashboard,file,file_user_creation,academic_subject,academic_staff_details
```

**Check:**
```sql
-- Update module_access
UPDATE users 
SET module_access = 'dashboard,file,file_user_creation,academic_subject' 
WHERE id = 2;
```

---

## 📊 Database Schema

### users table
```sql
id              INT
username        VARCHAR(255)
password        VARCHAR(255)  -- bcrypt hashed
role            VARCHAR(255)
module_access   TEXT          -- comma-separated module_key values
```

### sidebar_modules table
```sql
id              INT
module_name     VARCHAR(255)  -- Display name
module_key      VARCHAR(100)  -- Unique identifier (matches module_access)
is_active       TINYINT(1)    -- 0 or 1
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### users_roles table
```sql
id              INT
role            VARCHAR(255)  -- Admin, Staff, HOD
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

---

## 🔍 Debugging Checklist

- [ ] Server is running on port 5000
- [ ] JWT_SECRET is set in .env
- [ ] User has valid token in localStorage
- [ ] User's module_access is populated
- [ ] sidebar_modules table has data
- [ ] module_key values match between tables
- [ ] CORS is enabled on server
- [ ] Browser console shows no errors
- [ ] Network tab shows successful API calls
- [ ] Sidebar component is imported correctly

---

## 📝 Module Key Examples

| module_key | Meaning | Route |
|------------|---------|-------|
| `dashboard` | Top-level Dashboard | /admin/adminDashboard |
| `file` | Top-level File menu | # (dropdown) |
| `file_user_creation` | File → User Creation | /admin/user-creation |
| `file_log_details` | File → Log Details | /admin/log-details |
| `academic` | Top-level Academic menu | # (dropdown) |
| `academic_subject` | Academic → Subject | /admin/master/subject |
| `academic_staff_details` | Academic → Staff Details | /admin/master/StaffDetails |

---

## ✨ Features

1. **Dynamic Loading**: Sidebar fetches from API on mount
2. **Role-Based**: Admin gets all, others get filtered
3. **Graceful Fallback**: Uses static config if API fails
4. **Loading State**: Shows spinner while fetching
5. **User Display**: Shows staff name and role
6. **Token Auto-inject**: Auth headers added automatically
7. **Expiry Handling**: Redirects to login on 401

---

## 🚀 Quick Fix Commands

```bash
# Restart server
cd server
node server.js

# Check server logs
# Look for "Server is running on port 5000"

# Test API manually
curl -X GET http://localhost:5000/api/auth/sidebar \
  -H "Authorization: Bearer YOUR_TOKEN"

# Check database
mysql -u myuser -p
USE cms;
SELECT * FROM users WHERE id = 2;
SELECT * FROM sidebar_modules WHERE is_active = 1;
```

---

## 📞 Support

If sidebar is still not working:
1. Check browser console for errors
2. Check Network tab → XHR/Fetch requests
3. Verify API response in Response tab
4. Check server logs for errors
5. Verify database tables have data
6. Ensure token is valid (not expired)

---

**Last Updated:** December 9, 2025
**Status:** ✅ Implemented and Working
