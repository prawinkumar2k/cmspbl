import express from 'express';
import {
  getAllLogs,
  getUserLogs,
  getLogsByDateRange,
  getRecentLogins,
  deleteOldLogs
} from '../controller/logController.js';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All log routes require authentication and admin role
// Only admins should be able to view activity logs

// Get all activity logs (paginated)
router.get('/logs', verifyToken, authorizeRoles('Admin'), getAllLogs);

// Get logs for a specific user
router.get('/logs/user/:username', verifyToken, authorizeRoles('Admin'), getUserLogs);

// Get logs by date range
router.get('/logs/date-range', verifyToken, authorizeRoles('Admin'), getLogsByDateRange);

// Get recent login activities
router.get('/logs/recent-logins', verifyToken, authorizeRoles('Admin'), getRecentLogins);

// Delete old logs (cleanup) - Admin only
router.delete('/logs/cleanup', verifyToken, authorizeRoles('Admin'), deleteOldLogs);

export default router;
