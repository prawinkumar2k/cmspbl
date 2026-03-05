import express from 'express';
import {
  getStudents,
  getCallers,
  getRoles,
  getStaffByRole,
  assignCall,
  getAssignedCalls,
  deleteAssignedCall,
  updateAssignedCall
} from '../controller/assignCallController.js';

const router = express.Router();

// Get students from student_enquiry
router.get('/students', getStudents);

// Get callers from tenant_data
router.get('/callers', getCallers);

// Get all roles
router.get('/roles', getRoles);

// Get staff by role
router.get('/staff-by-role', getStaffByRole);

// Assign call to student(s)
router.post('/assign', assignCall);

// Get assigned calls
router.get('/assignments', getAssignedCalls);

// Delete assigned call
router.delete('/:id', deleteAssignedCall);

// Update assigned call remarks
router.put('/:id', updateAssignedCall);

export default router;
