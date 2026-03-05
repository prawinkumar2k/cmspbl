import express from 'express';
import { getSeatAssignments, getExamDates } from '../controller/hallChartController.js';

const router = express.Router();

// GET exam dates
router.get('/exam-dates', getExamDates);

// GET seat assignments by date and session
router.get('/seat-assignments', getSeatAssignments);

export default router;
