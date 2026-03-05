/**
 * Example: Adding Activity Logging to Student Master Controller
 * 
 * This file shows how to add activity logging to existing CRUD operations
 */

import db from '../db.js';
import { logActivity } from '../utils/activityLogger.js';

// ==============================================
// CREATE OPERATION - Log student creation
// ==============================================
export const createStudent = async (req, res) => {
  try {
    const username = req.user.username; // Get username from auth middleware
    const role = req.user.role_name; // Get role from auth middleware
    const { studentName, rollNo, course } = req.body;
    
    // Perform the database operation
    const [result] = await db.query(
      'INSERT INTO student_master (student_name, roll_no, course) VALUES (?, ?, ?)',
      [studentName, rollNo, course]
    );
    
    // Log the activity
    await logActivity(
      username,
      role,
      `Created student: ${studentName} (Roll: ${rollNo}, Course: ${course})`
    );
    
    res.json({
      success: true,
      message: 'Student created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
};

// ==============================================
// READ OPERATION - Usually no logging needed
// ==============================================
export const getStudent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [students] = await db.query(
      'SELECT * FROM student_master WHERE id = ?',
      [id]
    );
    
    // No logging for read operations (optional)
    // If you want to log: await logActivity(req.user.username, `Viewed student ID: ${id}`);
    
    res.json({ success: true, data: students[0] });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
};

// ==============================================
// UPDATE OPERATION - Log student updates
// ==============================================
export const updateStudent = async (req, res) => {
  try {
    const username = req.user.username;
    const role = req.user.role_name;
    const { id } = req.params;
    const { studentName, rollNo, course } = req.body;
    
    // Get old data first (optional, for detailed logging)
    const [oldData] = await db.query(
      'SELECT student_name FROM student_master WHERE id = ?',
      [id]
    );
    
    // Perform the update
    await db.query(
      'UPDATE student_master SET student_name = ?, roll_no = ?, course = ? WHERE id = ?',
      [studentName, rollNo, course, id]
    );
    
    // Log the activity
    await logActivity(
      username,
      role,
      `Updated student ID: ${id} (${oldData[0]?.student_name || 'Unknown'} → ${studentName})`
    );
    
    res.json({ success: true, message: 'Student updated successfully' });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
};

// ==============================================
// DELETE OPERATION - Log student deletion
// ==============================================
export const deleteStudent = async (req, res) => {
  try {
    const username = req.user.username;
    const role = req.user.role_name;
    const { id } = req.params;
    
    // Get student info before deletion (optional, for better logging)
    const [students] = await db.query(
      'SELECT student_name, roll_no FROM student_master WHERE id = ?',
      [id]
    );
    
    const studentInfo = students[0];
    
    // Perform the deletion
    await db.query('DELETE FROM student_master WHERE id = ?', [id]);
    
    // Log the activity
    await logActivity(
      username,
      role,
      `Deleted student: ${studentInfo?.student_name || 'ID: ' + id} (Roll: ${studentInfo?.roll_no || 'N/A'})`
    );
    
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
};

// ==============================================
// BULK OPERATION - Log bulk actions
// ==============================================
export const bulkDeleteStudents = async (req, res) => {
  try {
    const username = req.user.username;
    const role = req.user.role_name;
    const { ids } = req.body; // Array of student IDs
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Invalid IDs' });
    }
    
    // Perform bulk deletion
    const placeholders = ids.map(() => '?').join(',');
    const [result] = await db.query(
      `DELETE FROM student_master WHERE id IN (${placeholders})`,
      ids
    );
    
    // Log the activity
    await logActivity(
      username,
      role,
      `Bulk deleted ${result.affectedRows} students (IDs: ${ids.join(', ')})`
    );
    
    res.json({
      success: true,
      message: `${result.affectedRows} students deleted`
    });
  } catch (error) {
    console.error('Error in bulk deletion:', error);
    res.status(500).json({ error: 'Failed to delete students' });
  }
};

// ==============================================
// STATUS CHANGE - Log status updates
// ==============================================
export const changeStudentStatus = async (req, res) => {
  try {
    const username = req.user.username;
    const role = req.user.role_name;
    const { id } = req.params;
    const { status } = req.body; // e.g., 'active', 'inactive', 'graduated'
    
    // Get current status
    const [students] = await db.query(
      'SELECT student_name, status FROM student_master WHERE id = ?',
      [id]
    );
    
    const oldStatus = students[0]?.status;
    const studentName = students[0]?.student_name;
    
    // Update status
    await db.query(
      'UPDATE student_master SET status = ? WHERE id = ?',
      [status, id]
    );
    
    // Log the activity
    await logActivity(
      username,
      role,
      `Changed status for ${studentName} (ID: ${id}): ${oldStatus} → ${status}`
    );
    
    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
};

// ==============================================
// FILE UPLOAD - Log file uploads
// ==============================================
export const uploadStudentPhoto = async (req, res) => {
  try {
    const username = req.user.username;
    const role = req.user.role_name;
    const { id } = req.params;
    const filename = req.file?.filename;
    
    if (!filename) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Update photo in database
    await db.query(
      'UPDATE student_master SET photo = ? WHERE id = ?',
      [filename, id]
    );
    
    // Get student name for logging
    const [students] = await db.query(
      'SELECT student_name FROM student_master WHERE id = ?',
      [id]
    );
    
    // Log the activity
    await logActivity(
      username,
      role,
      `Uploaded photo for student: ${students[0]?.student_name || 'ID: ' + id} (${filename})`
    );
    
    res.json({ success: true, message: 'Photo uploaded successfully' });
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ error: 'Failed to upload photo' });
  }
};

// ==============================================
// APPROVAL WORKFLOW - Log approvals
// ==============================================
export const approveStudent = async (req, res) => {
  try {
    const username = req.user.username;
    const role = req.user.role_name;
    const { id } = req.params;
    const { remarks } = req.body;
    
    // Get student info
    const [students] = await db.query(
      'SELECT student_name, roll_no FROM student_master WHERE id = ?',
      [id]
    );
    
    const student = students[0];
    
    // Update approval status
    await db.query(
      'UPDATE student_master SET approved = 1, approved_by = ?, approval_date = NOW() WHERE id = ?',
      [username, id]
    );
    
    // Log the activity
    await logActivity(
      username,
      role,
      `Approved student: ${student?.student_name} (Roll: ${student?.roll_no})${remarks ? ' - ' + remarks : ''}`
    );
    
    res.json({ success: true, message: 'Student approved successfully' });
  } catch (error) {
    console.error('Error approving student:', error);
    res.status(500).json({ error: 'Failed to approve student' });
  }
};

// ==============================================
// BATCH PROCESSING - Log batch operations
// ==============================================
export const promoteStudents = async (req, res) => {
  try {
    const username = req.user.username;
    const role = req.user.role_name;
    const { fromYear, toYear, count } = req.body;
    
    // Perform promotion logic
    const [result] = await db.query(
      'UPDATE student_master SET current_year = ? WHERE current_year = ?',
      [toYear, fromYear]
    );
    
    // Log the activity
    await logActivity(
      username,
      role,
      `Promoted ${result.affectedRows} students from Year ${fromYear} to Year ${toYear}`
    );
    
    res.json({
      success: true,
      message: `${result.affectedRows} students promoted`,
      count: result.affectedRows
    });
  } catch (error) {
    console.error('Error promoting students:', error);
    res.status(500).json({ error: 'Failed to promote students' });
  }
};

// ==============================================
// QUICK TIPS
// ==============================================
/*
1. Always get username from req.user.username and role from req.user.role_name (set by auth middleware)
2. Log AFTER successful operations, not before
3. Include relevant identifiers (ID, name, roll no) in log messages
4. For bulk operations, log the count of affected records
5. For status changes, log both old and new values
6. Keep log messages under 500 characters
7. Don't log read operations unless specifically needed
8. Use try-catch to prevent logging errors from breaking operations
9. Be descriptive but concise in action messages
10. Include context that would help in auditing (who did what to which record)

FUNCTION SIGNATURE:
logActivity(username, role, action)
- username: string - req.user.username
- role: string - req.user.role_name
- action: string - Description of what was done

WHAT TO LOG:
✓ Create operations (INSERT)
✓ Update operations (UPDATE)
✓ Delete operations (DELETE)
✓ Status changes
✓ Approvals/rejections
✓ File uploads
✓ Bulk operations
✓ Permission changes
✓ Configuration changes

WHAT NOT TO LOG:
✗ Simple read operations (SELECT) - unless required for security
✗ Health checks
✗ Static file requests
✗ Failed operations (unless specifically for security audit)
*/

export default {
  createStudent,
  getStudent,
  updateStudent,
  deleteStudent,
  bulkDeleteStudents,
  changeStudentStatus,
  uploadStudentPhoto,
  approveStudent,
  promoteStudents
};
