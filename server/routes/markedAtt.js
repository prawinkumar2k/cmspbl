import express from 'express';
import {
  getMarkedAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  getAttendanceStats
} from '../controller/markedAttController.js';

const router = express.Router();

// Get all marked attendance with filters
router.get('/marked', getMarkedAttendance);

// Get attendance statistics
router.get('/stats', getAttendanceStats);

// Get attendance by ID
router.get('/:id', getAttendanceById);

// Update attendance status
router.put('/:id', updateAttendance);

// Delete attendance record
router.delete('/:id', deleteAttendance);

export default router;
