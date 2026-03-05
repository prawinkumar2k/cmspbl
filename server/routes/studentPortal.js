import express from 'express';
import { getStudentTimetable } from '../controller/studentTimetableController.js';
import { getStudentProfile, updateStudentProfile } from '../controller/studentProfileController.js';
import { getStudentAcademicDetails } from '../controller/studentAcademicController.js';
import { getStudentAttendance } from '../controller/studentAttController.js';
import { getStudentMarkDetails } from '../controller/studentMarkController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get student's timetable with resolved subject names
router.get('/timetable', verifyToken, getStudentTimetable);

// Get/Update student's detailed profile
router.get('/profile', verifyToken, getStudentProfile);
router.put('/profile', verifyToken, updateStudentProfile);

// Get student's academic history (Dept details, subjects, arrears)
router.get('/academic-history', verifyToken, getStudentAcademicDetails);

// Get student's attendance stats and logs
router.get('/attendance', verifyToken, getStudentAttendance);

// Get student's detailed marks (Assignment, unit tests, practicals)
router.get('/marks', verifyToken, getStudentMarkDetails);

export default router;
