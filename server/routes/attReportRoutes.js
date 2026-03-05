import express from 'express';
import { 
  getAttendanceReport, 
  getAttendanceSummary, 
  getDetailedAttendanceReport, 
  getClassesByFilters,
  getAvailableMonths,
  getAvailableWeeks,
  getWeeklyAttendanceReport
} from '../controller/attReportController.js';

const router = express.Router();

// Get attendance report from student_attendance_view
router.get('/', getAttendanceReport);

// Get attendance summary statistics
router.get('/summary', getAttendanceSummary);

// Get detailed attendance report (date-wise or weekly)
router.get('/detailed', getDetailedAttendanceReport);

// Get distinct classes based on dept and semester
router.get('/classes', getClassesByFilters);

// Get available months for weekly report
router.get('/months', getAvailableMonths);

// Get available weeks for a specific month
router.get('/weeks', getAvailableWeeks);

// Get weekly attendance report from student_weekly_attendance table
router.get('/weekly', getWeeklyAttendanceReport);

export default router;
