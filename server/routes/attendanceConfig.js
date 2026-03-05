import express from 'express';
import {
  getCourses,
  getDepartmentsByCourse,
  getYearAndRegulation,
  getRegulations,
  getSubjectsFiltered,
  saveAttendanceConfig,
  listAttendanceConfigs,
  updateAttendanceConfig,
  deleteAttendanceConfig,
  checkSubjectCode,
  getSemesters
} from '../controller/attConfig.js';

const router = express.Router();

// Get all courses
router.get('/courses', getCourses);

// Get departments by course
router.get('/departments', getDepartmentsByCourse);

// Get year and regulation details
router.get('/year-regulation', getYearAndRegulation);

// Get all regulations
router.get('/regulations', getRegulations);

// Get subjects filtered by course code, semester, and regulation
router.get('/subjects-filtered', getSubjectsFiltered);

// Save attendance configuration
router.post('/save', saveAttendanceConfig);

// List attendance configurations
router.get('/list', listAttendanceConfigs);

// Update attendance configuration
router.put('/:id', updateAttendanceConfig);

// Delete attendance configuration
router.delete('/:id', deleteAttendanceConfig);

// Check subject code uniqueness
router.get('/check-subject-code', checkSubjectCode);

// Get all semesters
router.get('/semesters', getSemesters);

export default router;