import express from 'express';
import {
    getDashboardStats,
    getDashboardStatsByDate,
    getDepartmentWiseStudents,
    getAcademicYears,
    getTodayAttendance,
    getDeptAttendanceByDate,
    getAttendanceDetailsByDate,
    getAttendanceDetailsByType,
    getLibraryStats,
    getFeeMetrics,
    getExamAnalytics,
    getHealthStats,
    getAttendanceTrends,
    getQuickStats
} from '../controller/dashboardController.js';
import { authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', getDashboardStats);

// GET /api/dashboard/stats-by-date - Get dashboard statistics for a specific date
router.get('/stats-by-date', getDashboardStatsByDate);

// GET /api/dashboard/department-wise-students - Get department-wise student distribution
router.get('/department-wise-students', getDepartmentWiseStudents);

// GET /api/dashboard/academic-years - Get distinct academic years
router.get('/academic-years', getAcademicYears);

// GET /api/dashboard/today-attendance - Get today's attendance percentage
router.get('/today-attendance', getTodayAttendance);

// GET /api/dashboard/dept-attendance-by-date - Get department-wise attendance by date
router.get('/dept-attendance-by-date', getDeptAttendanceByDate);

// GET /api/dashboard/attendance-details-by-date - Get present/absent student lists and counts by date
router.get('/attendance-details-by-date', getAttendanceDetailsByDate);

// GET /api/dashboard/attendance-details-by-type - Get onDuty/medicalLeave student lists and counts by date
router.get('/attendance-details-by-type', getAttendanceDetailsByType);

// GET /api/dashboard/library-stats - Get library statistics
router.get('/library-stats', getLibraryStats);

// GET /api/dashboard/fee-metrics - Get fee collection metrics
router.get('/fee-metrics', getFeeMetrics);

// GET /api/dashboard/exam-analytics - Get exam performance analytics
router.get('/exam-analytics', getExamAnalytics);

// GET /api/dashboard/health-stats - Get health center statistics
router.get('/health-stats', getHealthStats);

// GET /api/dashboard/attendance-trends - Get 30-day attendance trends
router.get('/attendance-trends', getAttendanceTrends);

// GET /api/dashboard/quick-stats - Get quick statistics
router.get('/quick-stats', getQuickStats);

export default router;