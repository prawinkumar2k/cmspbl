import express from 'express';
import {
  getCourses,
  getDepartments,
  getSemesters,
  getRegulations,
  getSections,
  getSubjects,
  getAssessmentConfigs,
  createAssessmentConfig,
  updateAssessmentConfig,
  deleteAssessmentConfig,
  getNextTestNumber
} from '../controller/assConfigControlller.js';

const router = express.Router();

// Master data routes
router.get('/courses', getCourses);
router.get('/departments', getDepartments);
router.get('/semesters', getSemesters);
router.get('/regulations', getRegulations);
router.get('/sections', getSections);
router.get('/subjects', getSubjects);
router.get('/next-test-number', getNextTestNumber);

// Assessment configuration CRUD routes
router.get('/configs', getAssessmentConfigs);
router.post('/configs', createAssessmentConfig);
router.put('/configs/:id', updateAssessmentConfig);
router.delete('/configs/:id', deleteAssessmentConfig);

export default router;
