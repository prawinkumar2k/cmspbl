import express from 'express';
import {
    getStaffAttendance,
    markStaffAttendance,
    updateStaffAttendance,
    getAttendanceReport,
    getAttendanceSummary
} from '../controller/hrAttendanceController.js';

const router = express.Router();

// Staff Attendance Routes
router.get('/staff', getStaffAttendance);
router.post('/staff', markStaffAttendance);
router.put('/staff/:id', updateStaffAttendance);
router.get('/report', getAttendanceReport);
router.get('/summary', getAttendanceSummary);

export default router;
