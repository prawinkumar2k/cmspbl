# Activity Logging System - UPDATED IMPLEMENTATION

## 🎯 Key Updates

### What Changed:
1. ✅ **Added `role` column** - Now logs user role with each action
2. ✅ **login_date now stores DATE + TIME** - Changed from CURDATE() to NOW()
3. ✅ **Simplified action messages** - "Logged in" instead of "User logged in as Admin"
4. ✅ **Focus on actual user actions** - Records what users CREATE, UPDATE, DELETE

---

## 📊 Database Structure

### log_details Table Columns:
```sql
id          - INT (Primary Key, Auto Increment)
username    - VARCHAR(255) - User who performed the action
role        - VARCHAR(255) - User's role (Admin, Staff, HOD, etc.)
login_date  - DATETIME - Date and time when action occurred
action      - VARCHAR(500) - Description of action taken
CreatedAt   - TIMESTAMP - Record creation timestamp
UpdatedAt   - TIMESTAMP - Record update timestamp
```

### Required SQL Update:
```sql
-- Add role column to existing table
ALTER TABLE log_details
ADD COLUMN role VARCHAR(255) AFTER username;
```

**Run the SQL script:** `server/database_updates.sql`

---

## 🚀 How to Use

### Function Signature:
```javascript
logActivity(username, role, action)
```

### Example Usage:

#### 1. **Creating a Record**
```javascript
import { logActivity } from '../utils/activityLogger.js';

export const createStudent = async (req, res) => {
  try {
    const username = req.user.username;
    const role = req.user.role_name;
    
    // Database operation
    const [result] = await db.query('INSERT INTO students...');
    
    // Log the activity
    await logActivity(username, role, 'Created student: John Doe (Roll: 12345)');
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};
```

#### 2. **Updating a Record**
```javascript
export const updateStudent = async (req, res) => {
  try {
    const username = req.user.username;
    const role = req.user.role_name;
    const { id } = req.params;
    
    // Get old data
    const [oldData] = await db.query('SELECT student_name FROM students WHERE id = ?', [id]);
    
    // Update
    await db.query('UPDATE students SET...');
    
    // Log the activity
    await logActivity(username, role, `Updated student ID: ${id} (${oldData[0].student_name})`);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};
```

#### 3. **Deleting a Record**
```javascript
export const deleteStudent = async (req, res) => {
  try {
    const username = req.user.username;
    const role = req.user.role_name;
    const { id } = req.params;
    
    // Get info before deletion
    const [students] = await db.query('SELECT student_name FROM students WHERE id = ?', [id]);
    
    // Delete
    await db.query('DELETE FROM students WHERE id = ?', [id]);
    
    // Log the activity
    await logActivity(username, role, `Deleted student: ${students[0].student_name} (ID: ${id})`);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};
```

---

## 🔐 Automatic Login/Logout Logging

### Login Activity
When user logs in via `/api/auth/login`:
```javascript
// Automatically logs:
username: "admin"
role: "Admin"
login_date: 2025-12-11 09:30:45
action: "Logged in"
```

### Logout Activity
When user logs out via `/api/auth/logout`:
```javascript
// Automatically logs:
username: "admin"
role: "Admin"
login_date: 2025-12-11 17:30:22
action: "Logged out"
```

---

## 📋 Sample Log Entries

| id | username | role  | login_date          | action                                    | CreatedAt           |
|----|----------|-------|---------------------|-------------------------------------------|---------------------|
| 1  | admin    | Admin | 2025-12-11 09:30:45 | Logged in                                | 2025-12-11 09:30:45 |
| 2  | admin    | Admin | 2025-12-11 09:35:12 | Created student: John Doe (Roll: 12345)  | 2025-12-11 09:35:12 |
| 3  | admin    | Admin | 2025-12-11 09:40:33 | Updated course: Computer Science (ID: 5) | 2025-12-11 09:40:33 |
| 4  | staff    | Staff | 2025-12-11 10:15:22 | Deleted fee record ID: 789               | 2025-12-11 10:15:22 |
| 5  | admin    | Admin | 2025-12-11 17:30:22 | Logged out                               | 2025-12-11 17:30:22 |

---

## 🎨 Action Message Examples

### ✅ Good Action Messages:
```javascript
"Created student: John Doe (Roll: 12345)"
"Updated course: Computer Science (ID: 101)"
"Deleted student record ID: 567"
"Changed status for Jane Smith (ID: 89): Active → Inactive"
"Approved admission: Peter Parker (Roll: 2023001)"
"Uploaded photo for student: Mary Jane (profile.jpg)"
"Bulk deleted 15 students"
"Promoted 45 students from Year 2 to Year 3"
```

### ❌ Avoid Vague Messages:
```javascript
"Updated record"           // Too generic
"Action performed"         // No context
"Changed data"            // Not descriptive
"Record modified"         // What record?
```

---

## 🔍 API Endpoints

### Authentication
```
POST /api/auth/login   - Login (auto-logs)
POST /api/auth/logout  - Logout (auto-logs) [Protected]
```

### Log Management (Admin Only)
```
GET    /api/logs                           - Get all logs (paginated)
GET    /api/logs/user/:username            - Get user logs
GET    /api/logs/date-range                - Get logs by date
GET    /api/logs/recent-logins             - Get recent logins
DELETE /api/logs/cleanup?daysOld=90       - Delete old logs
```

### Example API Calls:

#### Get All Logs
```bash
GET /api/logs?page=1&limit=50
Headers: { "Authorization": "Bearer <admin_token>" }

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "admin",
      "role": "Admin",
      "login_date": "2025-12-11T09:30:45.000Z",
      "action": "Logged in",
      "CreatedAt": "2025-12-11T09:30:45.000Z",
      "UpdatedAt": "2025-12-11T09:30:45.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "totalPages": 3
  }
}
```

#### Get User Logs
```bash
GET /api/logs/user/admin?page=1&limit=20
Headers: { "Authorization": "Bearer <admin_token>" }
```

#### Get Logs by Date Range
```bash
GET /api/logs/date-range?startDate=2025-12-01&endDate=2025-12-31
Headers: { "Authorization": "Bearer <admin_token>" }
```

---

## 📦 Files Modified/Created

### ✨ Created:
1. `server/utils/activityLogger.js` - Logging utility (UPDATED)
2. `server/controller/logController.js` - Log management (UPDATED)
3. `server/routes/logs.js` - Log routes
4. `server/controller/EXAMPLE_LOGGING_IMPLEMENTATION.js` - Examples (UPDATED)
5. `server/database_updates.sql` - SQL update script (NEW)
6. `ACTIVITY_LOGGING_UPDATED.md` - This file (NEW)

### 🔧 Modified:
1. `server/controller/authController.js` - Login/logout logging (UPDATED)
2. `server/routes/auth.js` - Logout route
3. `server/server.js` - Log routes

---

## 🛠️ Setup Instructions

### Step 1: Update Database
Run the SQL script to add the `role` column:
```sql
ALTER TABLE log_details
ADD COLUMN role VARCHAR(255) AFTER username;
```

Or run the complete script:
```bash
# In your database tool (Navicat, MySQL Workbench, etc.)
Execute: server/database_updates.sql
```

### Step 2: Restart Server
```bash
# In server directory
node server.js
```

### Step 3: Test Login Logging
1. Login via `/api/auth/login`
2. Check `log_details` table
3. Should see: username, role, login_date (with time), action "Logged in"

### Step 4: Add Logging to Your Controllers
Use the examples in `EXAMPLE_LOGGING_IMPLEMENTATION.js` to add logging to your CRUD operations.

---

## 💡 What to Log

### ✅ DO LOG:
- ✅ User login/logout (automatic)
- ✅ Record creation (INSERT)
- ✅ Record updates (UPDATE)
- ✅ Record deletion (DELETE)
- ✅ Status changes
- ✅ Approvals/rejections
- ✅ File uploads
- ✅ Bulk operations
- ✅ Permission changes

### ❌ DON'T LOG:
- ❌ Read operations (SELECT) - unless security required
- ❌ Health checks
- ❌ Static file requests
- ❌ Failed operations (unless for security audit)

---

## 🧪 Testing Checklist

- [ ] Run `database_updates.sql` to add role column
- [ ] Restart the server
- [ ] Test login - check log_details table for "Logged in" entry with role
- [ ] Test logout - check log_details table for "Logged out" entry
- [ ] Add logActivity to a controller (e.g., student creation)
- [ ] Test the operation and verify log entry
- [ ] Test admin endpoints to view logs
- [ ] Verify role column is populated in all new logs

---

## 📚 Quick Reference

### Import:
```javascript
import { logActivity } from '../utils/activityLogger.js';
```

### Usage:
```javascript
await logActivity(req.user.username, req.user.role_name, 'Action description');
```

### Three Parameters:
1. **username** - `req.user.username`
2. **role** - `req.user.role_name`
3. **action** - Descriptive message of what was done

---

## 🆘 Troubleshooting

### Error: "Unknown column 'role'"
- **Solution:** Run `ALTER TABLE log_details ADD COLUMN role VARCHAR(255) AFTER username;`

### Logs not showing role
- **Solution:** Make sure you're passing 3 parameters: `logActivity(username, role, action)`

### login_date showing only date, not time
- **Solution:** Check that table uses DATETIME, not DATE. Query uses NOW() not CURDATE()

---

## ✨ Summary

**Updated Activity Logging Features:**
- ✅ Logs username, role, date+time, and action
- ✅ Automatic login/logout tracking
- ✅ Simple 3-parameter function: `logActivity(username, role, action)`
- ✅ Tracks CREATE, UPDATE, DELETE operations
- ✅ Admin API to view and manage logs
- ✅ Descriptive action messages
- ✅ Complete code examples provided

**Next Steps:**
1. Run `database_updates.sql`
2. Test login/logout logging
3. Add `logActivity()` to your controllers
4. Monitor logs via admin API

**All set! Start logging user activities! 🎉**
