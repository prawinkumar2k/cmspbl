# Activity Logging Implementation - Quick Start

## ✅ What's Been Implemented

### 1. **Automatic Login Logging**
- Every successful login is automatically logged to the `log_details` table
- Logs include: username, date, "User logged in as [Role]", CreatedAt, UpdatedAt

### 2. **Logout Logging**
- New logout endpoint: `POST /api/auth/logout`
- Logs user logout activities automatically

### 3. **Custom Activity Logging Utility**
- Created `server/utils/activityLogger.js` with helper functions
- Functions: `logActivity()`, `logLogin()`, `logLogout()`, `activityLoggerMiddleware`

### 4. **Log Management API (Admin Only)**
- View all logs (paginated)
- View logs by user
- View logs by date range
- View recent logins
- Delete old logs

### 5. **Documentation & Examples**
- Complete guide: `docs/ACTIVITY_LOGGING_GUIDE.md`
- Code examples: `server/controller/EXAMPLE_LOGGING_IMPLEMENTATION.js`

---

## 🚀 How to Use

### For Login/Logout (Already Working!)
Login and logout activities are **automatically logged**. No additional code needed!

### For Other Actions

#### Step 1: Import the utility
```javascript
import { logActivity } from '../utils/activityLogger.js';
```

#### Step 2: Log the activity after successful operations
```javascript
export const createStudent = async (req, res) => {
  try {
    const username = req.user.username;
    
    // Your database operation
    const [result] = await db.query('INSERT INTO students...');
    
    // Log the activity
    await logActivity(username, 'Created student: John Doe (Roll: 12345)');
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};
```

---

## 📁 Files Created/Modified

### ✨ New Files:
1. `server/utils/activityLogger.js` - Logging utility
2. `server/controller/logController.js` - Log management
3. `server/routes/logs.js` - Log API routes
4. `docs/ACTIVITY_LOGGING_GUIDE.md` - Complete documentation
5. `server/controller/EXAMPLE_LOGGING_IMPLEMENTATION.js` - Code examples

### 🔧 Modified Files:
1. `server/controller/authController.js` - Added login/logout logging
2. `server/routes/auth.js` - Added logout route
3. `server/server.js` - Registered log routes

---

## 🎯 API Endpoints

### Authentication (Public/Protected)
```
POST /api/auth/login          - Login (auto-logs)
POST /api/auth/logout         - Logout (auto-logs) [Protected]
```

### Log Management (Admin Only)
```
GET    /api/logs                              - Get all logs (paginated)
GET    /api/logs/user/:username               - Get user logs
GET    /api/logs/date-range                   - Get logs by date
GET    /api/logs/recent-logins                - Get recent logins
DELETE /api/logs/cleanup?daysOld=90          - Delete old logs
```

---

## 🧪 Testing

### Test Login Logging
1. Login via `/api/auth/login` with credentials
2. Check `log_details` table in database
3. Should see: "User logged in as [Role]"

### Test Logout Logging
1. Logout via `/api/auth/logout` with Bearer token
2. Check `log_details` table
3. Should see: "User logged out"

### View Logs (Admin)
1. Login as Admin
2. GET `/api/logs` with Bearer token
3. See all logged activities

---

## 💡 Best Practices

### ✅ DO Log:
- User authentication (login/logout) ✓
- Data creation (INSERT)
- Data updates (UPDATE)
- Data deletion (DELETE)
- Status changes
- Approvals/rejections
- File uploads
- Permission changes

### ❌ DON'T Log:
- Simple read operations
- Health checks
- Static file requests

### 📝 Log Message Format:
```javascript
// Good examples:
await logActivity(username, 'Created student: John Doe (Roll: 12345)');
await logActivity(username, 'Updated course: Computer Science (ID: 101)');
await logActivity(username, 'Deleted fee record ID: 567');
await logActivity(username, 'Approved student admission: Jane Smith');

// Avoid:
await logActivity(username, 'Updated record');  // Too vague
await logActivity(username, 'Action performed'); // Too generic
```

---

## 🔍 Database Query Examples

### View Recent Logs
```sql
SELECT * FROM log_details 
ORDER BY CreatedAt DESC 
LIMIT 20;
```

### View Logs by User
```sql
SELECT * FROM log_details 
WHERE username = 'admin' 
ORDER BY CreatedAt DESC;
```

### View Login Activities
```sql
SELECT * FROM log_details 
WHERE action LIKE '%logged in%' 
ORDER BY CreatedAt DESC;
```

### Delete Old Logs (90+ days)
```sql
DELETE FROM log_details 
WHERE CreatedAt < DATE_SUB(NOW(), INTERVAL 90 DAY);
```

---

## 📊 Sample Log Entries

| id | username | login_date | action | CreatedAt | UpdatedAt |
|----|----------|------------|--------|-----------|-----------|
| 1 | admin | 2025-12-11 | User logged in as Admin | 2025-12-11 09:30:00 | 2025-12-11 09:30:00 |
| 2 | admin | 2025-12-11 | Created student: John Doe (Roll: 12345) | 2025-12-11 09:35:00 | 2025-12-11 09:35:00 |
| 3 | admin | 2025-12-11 | Updated course: Computer Science (ID: 101) | 2025-12-11 09:40:00 | 2025-12-11 09:40:00 |
| 4 | admin | 2025-12-11 | User logged out | 2025-12-11 10:00:00 | 2025-12-11 10:00:00 |

---

## 🛠️ Troubleshooting

### Logs not appearing?
1. Check database connection
2. Verify `log_details` table exists
3. Check console for error messages
4. Ensure username is available in `req.user.username`

### Permission denied when viewing logs?
- Only Admin users can view logs
- Check if your role is 'Admin' in the database

### Too many logs?
- Use the cleanup endpoint: `DELETE /api/logs/cleanup?daysOld=90`
- Or set up a scheduled job for automatic cleanup

---

## 📚 Next Steps

1. **Test the Implementation**
   - Try logging in and check the database
   - Try the logout endpoint
   - View logs via the API

2. **Add Logging to Your Controllers**
   - Start with critical operations (create, update, delete)
   - Use the examples in `EXAMPLE_LOGGING_IMPLEMENTATION.js`
   - Be descriptive in your log messages

3. **Set Up Log Cleanup**
   - Schedule automatic cleanup of old logs
   - Decide on retention period (e.g., 90 days)

4. **Create Frontend Interface (Optional)**
   - Build an admin page to view logs
   - Add filters (by user, date, action type)
   - Display in a table with pagination

---

## 🆘 Need Help?

Refer to:
- `docs/ACTIVITY_LOGGING_GUIDE.md` - Complete guide
- `server/controller/EXAMPLE_LOGGING_IMPLEMENTATION.js` - Code examples
- `server/utils/activityLogger.js` - Utility source code

---

## ✨ Summary

**You now have a complete activity logging system that:**
- ✅ Automatically logs all login and logout activities
- ✅ Stores username, date, action, and timestamps
- ✅ Provides admin API to view and manage logs
- ✅ Is ready to be used in any controller
- ✅ Includes comprehensive documentation and examples

**Start logging activities by importing `logActivity()` in your controllers!**
