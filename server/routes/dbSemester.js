import express from 'express';
import { getAllSemesters } from '../controller/semesterMasterController.js';

const router = express.Router();

// Match /api/dbSemester/list
router.get('/list', getAllSemesters);

console.log('dbSemester routes loaded');
export default router;
