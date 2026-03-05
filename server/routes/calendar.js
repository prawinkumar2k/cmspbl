import express from 'express';
import {
  getAllEvents,
  addEvent,
  editEvent,
  deleteEvent,
  getAcademicYearRange,
  saveAcademicYearRange
} from '../controller/academicCalendar.js';

const router = express.Router();

router.get('/', getAllEvents);
router.post('/', addEvent);
router.put('/:id', editEvent);
router.delete('/:id', deleteEvent);

// Academic year date range routes
router.get('/academic-year', getAcademicYearRange);
router.post('/academic-year', saveAcademicYearRange);

export default router;
