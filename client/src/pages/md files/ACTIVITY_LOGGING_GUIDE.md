# Activity Logging System

## Overview
This system logs all user login activities and other actions into the `log_details` table in the database. Each entry stores the username, date, action description, and timestamps.

## Database Structure
The `log_details` table has the following columns:
- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `username` (VARCHAR(255))
- `login_date` (DATE) - Current date when action occurred
- `action` (VARCHAR(500)) - Description of the action taken
- `CreatedAt` (TIMESTAMP) - When the record was created
- `UpdatedAt` (TIMESTAMP) - When the record was last updated

## Features Implemented

### 1. Automatic Login Logging
Every successful user login is automatically logged with:
- Username
- Current date
- Action: "User logged in as [Role]"
- CreatedAt and UpdatedAt timestamps

### 2. Logout Logging
Users can logout through the `/api/auth/logout` endpoint, which logs:
- Username
- Current date
- Action: "User logged out"

### 3. Custom Activity Logging
You can log any custom activity using the utility functions provided.

## API Endpoints

### Authentication Endpoints

#### Login (with automatic logging)
```
POST /api/auth/login
Body: {
  "username": "admin",
  "password": "password",
  "role": "Admin"
}
```
**Logs:** "User logged in as Admin"

#### Logout (with logging)
```
POST /api/auth/logout
Headers: {
  "Authorization": "Bearer <token>"
}
```
**Logs:** "User logged out"

### Activity Log Management Endpoints (Admin Only)

#### Get All Logs (Paginated)
```
GET /api/logs?page=1&limit=50
Headers: {
  "Authorization": "Bearer <admin_token>"
}
```

#### Get Logs for Specific User
```
GET /api/logs/user/:username?page=1&limit=50
Headers: {
  "Authorization": "Bearer <admin_token>"
}
```

#### Get Logs by Date Range
```
GET /api/logs/date-range?startDate=2025-01-01&endDate=2025-12-31
Headers: {
  "Authorization": "Bearer <admin_token>"
}
```

#### Get Recent Login Activities
```
GET /api/logs/recent-logins?limit=20
Headers: {
  "Authorization": "Bearer <admin_token>"
}
```

#### Delete Old Logs (Cleanup)
```
DELETE /api/logs/cleanup?daysOld=90
Headers: {
  "Authorization": "Bearer <admin_token>"
}
```

## Usage in Code

### Import the Activity Logger
```javascript
import { logActivity, logLogin, logLogout } from '../utils/activityLogger.js';
```

### Log Custom Activities

#### Example 1: Log a specific action
```javascript
// In any controller
import { logActivity } from '../utils/activityLogger.js';

export const updateStudentRecord = async (req, res) => {
  try {
    const username = req.user.username; // From auth middleware
    const studentId = req.params.id;
    
    // Perform update operation
    // ...
    
    // Log the activity
    await logActivity(username, `Updated student record ID: ${studentId}`);
    
    res.json({ success: true, message: 'Student updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Update failed' });
  }
};
```

#### Example 2: Log data creation
```javascript
export const createCourse = async (req, res) => {
  try {
    const username = req.user.username;
    const { courseName } = req.body;
    
    // Create course
    const [result] = await db.query('INSERT INTO courses ...');
    
    // Log the activity
    await logActivity(username, `Created new course: ${courseName}`);
    
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create course' });
  }
};
```

#### Example 3: Log data deletion
```javascript
export const deleteStudent = async (req, res) => {
  try {
    const username = req.user.username;
    const studentId = req.params.id;
    
    // Delete student
    await db.query('DELETE FROM students WHERE id = ?', [studentId]);
    
    // Log the activity
    await logActivity(username, `Deleted student record ID: ${studentId}`);
    
    res.json({ success: true, message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Deletion failed' });
  }
};
```

### Using the Activity Logger Middleware (Optional)

If you want to log ALL requests to certain routes automatically, you can use the middleware:

```javascript
import { activityLoggerMiddleware } from '../utils/activityLogger.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

// Apply to specific routes
router.post('/students', verifyToken, activityLoggerMiddleware, createStudent);
router.put('/students/:id', verifyToken, activityLoggerMiddleware, updateStudent);
router.delete('/students/:id', verifyToken, activityLoggerMiddleware, deleteStudent);
```

**Note:** The middleware logs the HTTP method and path (e.g., "POST request to /api/students"). For more descriptive logs, use manual logging with custom messages.

### Apply Middleware to All Routes (Global)

In `server.js`, add after authentication routes:

```javascript
// Add this AFTER auth routes but BEFORE other routes
app.use('/api/*', verifyToken, activityLoggerMiddleware);
```

**Warning:** This will log EVERY authenticated API call, which may create a lot of log entries. Use selectively.

## Best Practices

1. **Log Important Actions Only**: Don't log every single read operation. Focus on:
   - User authentication (login/logout) ✓ Already implemented
   - Data creation (INSERT)
   - Data modification (UPDATE)
   - Data deletion (DELETE)
   - Permission changes
   - Configuration changes

2. **Use Descriptive Action Messages**: Instead of "Updated record", use "Updated student record ID: 12345"

3. **Keep Messages Concise**: The action field is VARCHAR(500), so keep descriptions under 500 characters

4. **Async Logging**: The logger uses async/await but doesn't throw errors to prevent breaking main operations

5. **Regular Cleanup**: Set up a scheduled job to delete old logs (e.g., logs older than 90 days)

6. **Security**: Only admins should access log viewing endpoints (already enforced with `authorizeRoles('Admin')`)

## Example Implementation for Student Master

```javascript
// In studentMasterController.js
import { logActivity } from '../utils/activityLogger.js';

// Create student
export const createStudent = async (req, res) => {
  try {
    const username = req.user.username;
    const { studentName, rollNo } = req.body;
    
    const [result] = await db.query('INSERT INTO student_master ...');
    
    await logActivity(username, `Created student: ${studentName} (Roll: ${rollNo})`);
    
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create student' });
  }
};

// Update student
export const updateStudent = async (req, res) => {
  try {
    const username = req.user.username;
    const { id } = req.params;
    const { studentName } = req.body;
    
    await db.query('UPDATE student_master SET ... WHERE id = ?', [id]);
    
    await logActivity(username, `Updated student ID: ${id}`);
    
    res.json({ success: true, message: 'Student updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update student' });
  }
};

// Delete student
export const deleteStudent = async (req, res) => {
  try {
    const username = req.user.username;
    const { id } = req.params;
    
    await db.query('DELETE FROM student_master WHERE id = ?', [id]);
    
    await logActivity(username, `Deleted student ID: ${id}`);
    
    res.json({ success: true, message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete student' });
  }
};
```

## Testing the Implementation

### Test Login Logging
1. Login via `/api/auth/login`
2. Check the `log_details` table
3. You should see an entry with action: "User logged in as [Role]"

### Test Logout Logging
1. Logout via `/api/auth/logout` with valid token
2. Check the `log_details` table
3. You should see an entry with action: "User logged out"

### View Logs (Admin)
1. Login as Admin
2. Call `/api/logs` to see all logs
3. Call `/api/logs/user/admin` to see logs for admin user

## Maintenance

### Clean Up Old Logs
```sql
-- Manual cleanup in database (older than 90 days)
DELETE FROM log_details WHERE CreatedAt < DATE_SUB(NOW(), INTERVAL 90 DAY);
```

Or use the API endpoint:
```
DELETE /api/logs/cleanup?daysOld=90
```

## Files Modified/Created

### Created Files:
1. `server/utils/activityLogger.js` - Core logging utility
2. `server/controller/logController.js` - Log management controller
3. `server/routes/logs.js` - Log viewing routes

### Modified Files:
1. `server/controller/authController.js` - Added login/logout logging
2. `server/routes/auth.js` - Added logout route
3. `server/server.js` - Registered log routes

## Summary

✅ **Login activities are automatically logged**
✅ **Logout endpoint with logging is available**
✅ **Custom activity logging utility is ready to use**
✅ **Admin can view and manage logs via API**
✅ **All logs include: username, date, action, CreatedAt, UpdatedAt**

You can now start using `logActivity()` in any controller to log user actions throughout your application!
