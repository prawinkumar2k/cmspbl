import express from 'express';
import {
  getAllStaff,
  getDepartmentsByStaff,
  getDepartments,
  getSemesters,
  getRegulations,
  getClasses,
  getSubjects,
  getPeriods,
  getStaffBySubject,
  getDayOrder,
  getStudents,
  saveAttendance,
  getAttendanceHistory
} from '../controller/dailyAttController.js';

const router = express.Router();

// Get all staff from staff_master
router.get('/staff/all', getAllStaff);

// Get departments handled by staff
router.get('/departments/bystaff', getDepartmentsByStaff);

// Get departments from course_details
router.get('/departments', getDepartments);

// Get semesters from semester_master
router.get('/semesters', getSemesters);

// Get regulations from regulation_master
router.get('/regulations', getRegulations);

// Get classes from student_master
router.get('/classes', getClasses);

// Get day order based on date
router.get('/dayorder', getDayOrder);

// Get subjects from timetable_period (filtered by date, day order, staff, dept, semester, regulation, class)
router.get('/subjects', getSubjects);

// Get periods from timetable_period
router.get('/periods', getPeriods);

// Get staff by subject allocation
router.get('/staff', getStaffBySubject);

// Get students for attendance
router.get('/students', getStudents);

// Save attendance data
router.post('/attendance', saveAttendance);

// Get attendance history (optional)
router.get('/attendance/history', getAttendanceHistory);

export default router;
