# 🚀 QUICK SETUP - Activity Logging System

## Step 1: Update Database (REQUIRED)
Run this SQL command in your database:

```sql
ALTER TABLE log_details
ADD COLUMN role VARCHAR(255) AFTER username;
```

**Or use Navicat:**
1. Open Navicat and connect to your database
2. Select the `log_details` table
3. Right-click → Design Table
4. Add new column after `username`:
   - Name: `role`
   - Type: `VARCHAR(255)`
   - Allow NULL: Yes
5. Save changes

## Step 2: Test Login Logging

### Login Test:
```javascript
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "your_password",
  "role": "Admin"
}
```

### Check Database:
```sql
SELECT * FROM log_details ORDER BY CreatedAt DESC LIMIT 5;
```

**Expected Result:**
| username | role  | login_date          | action     |
|----------|-------|---------------------|------------|
| admin    | Admin | 2025-12-11 09:30:45 | Logged in  |

## Step 3: Add Logging to Your Controllers

### Example: Student Creation
```javascript
// In studentMasterController.js
import { logActivity } from '../utils/activityLogger.js';

export const createStudent = async (req, res) => {
  try {
    const username = req.user.username;
    const role = req.user.role_name;
    const { studentName, rollNo } = req.body;
    
    // Your database operation
    const [result] = await db.query('INSERT INTO student_master...');
    
    // Add this line to log the activity
    await logActivity(username, role, `Created student: ${studentName} (Roll: ${rollNo})`);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create student' });
  }
};
```

### Example: Student Update
```javascript
export const updateStudent = async (req, res) => {
  try {
    const username = req.user.username;
    const role = req.user.role_name;
    const { id } = req.params;
    
    // Your update operation
    await db.query('UPDATE student_master SET...');
    
    // Log the activity
    await logActivity(username, role, `Updated student ID: ${id}`);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update' });
  }
};
```

### Example: Student Deletion
```javascript
export const deleteStudent = async (req, res) => {
  try {
    const username = req.user.username;
    const role = req.user.role_name;
    const { id } = req.params;
    
    // Get info before deletion
    const [students] = await db.query('SELECT student_name FROM student_master WHERE id = ?', [id]);
    
    // Delete operation
    await db.query('DELETE FROM student_master WHERE id = ?', [id]);
    
    // Log the activity
    await logActivity(username, role, `Deleted student: ${students[0].student_name} (ID: ${id})`);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete' });
  }
};
```

## Step 4: View Logs (Admin Only)

### Get All Logs:
```javascript
GET http://localhost:5000/api/logs?page=1&limit=20
Authorization: Bearer YOUR_ADMIN_TOKEN
```

### Get User Specific Logs:
```javascript
GET http://localhost:5000/api/logs/user/admin
Authorization: Bearer YOUR_ADMIN_TOKEN
```

### Get Recent Logins:
```javascript
GET http://localhost:5000/api/logs/recent-logins?limit=10
Authorization: Bearer YOUR_ADMIN_TOKEN
```

## Summary

✅ **What's Working Now:**
1. Login activities are automatically logged with username, role, date+time
2. Logout activities are logged
3. You can add custom logging to any controller with 3 parameters

✅ **Function to Use:**
```javascript
logActivity(username, role, action)
```

✅ **Where to Get Parameters:**
- `username`: `req.user.username`
- `role`: `req.user.role_name`
- `action`: Your custom description string

✅ **Complete Examples Available:**
- See: `server/controller/EXAMPLE_LOGGING_IMPLEMENTATION.js`
- See: `ACTIVITY_LOGGING_UPDATED.md`

## Need Help?

1. **Check the examples:** `EXAMPLE_LOGGING_IMPLEMENTATION.js`
2. **Read full guide:** `ACTIVITY_LOGGING_UPDATED.md`
3. **Verify database:** Make sure `role` column exists in `log_details` table
4. **Check parameters:** Ensure you're passing 3 parameters to `logActivity()`

---

## Testing Checklist

- [ ] Database column `role` added to `log_details` table
- [ ] Login works and creates log entry with role
- [ ] Logout works and creates log entry
- [ ] Added logActivity to at least one CRUD operation
- [ ] Verified logs are being saved with all fields
- [ ] Tested admin API to view logs

**You're all set! Start logging user activities! 🎉**
