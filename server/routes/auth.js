import express from 'express';
import { getRoles, login, logout, getSidebar, getUserProfile, testUserPassword } from '../controller/authController.js';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/auth/roles', getRoles);
router.post('/auth/login', login);

// Logout route (requires authentication)
router.post('/auth/logout', verifyToken, logout);

// Test endpoint (should be removed in production)
router.get('/auth/test-password', testUserPassword);

// Protected routes (authentication required)
router.get('/auth/verify', verifyToken, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    user: req.user
  });
});

// Get user's sidebar modules based on module_access
router.get('/auth/sidebar', verifyToken, getSidebar);

// Get user profile with staff photo
router.get('/auth/profile', verifyToken, getUserProfile);

// Example: Admin-only route
router.get('/auth/admin-test', verifyToken, authorizeRoles('Admin'), (req, res) => {
  res.json({
    success: true,
    message: 'Admin access granted',
    user: req.user
  });
});

// Example: Staff + Admin route
router.get('/auth/staff-test', verifyToken, authorizeRoles('Staff', 'Admin'), (req, res) => {
  res.json({
    success: true,
    message: 'Staff/Admin access granted',
    user: req.user
  });
});

// Example: HOD + Admin route
router.get('/auth/hod-test', verifyToken, authorizeRoles('HOD', 'Admin'), (req, res) => {
  res.json({
    success: true,
    message: 'HOD/Admin access granted',
    user: req.user
  });
});

export default router;
