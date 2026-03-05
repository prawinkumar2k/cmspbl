import express from 'express';
import {
  getExamTimetableDetails,
  getTimetable,
  getHalls,
  getStudents,
  getSeatAssignments,
  createSeatAssignment,
  updateSeatAssignment,
  deleteSeatAssignment,
  clearSeatAssignments,
  bulkCreateSeatAssignments,
  getExamDetails,
  getHallCapacity
} from '../controller/examGenerationController.js';

const router = express.Router();

// ===== EXAM TIMETABLE ROUTES =====
router.get('/exam-timetable/details', getExamTimetableDetails);
router.get('/exam-timetable', getTimetable);

// ===== HALL ROUTES =====
router.get('/halls', getHalls);
router.get('/hall-capacity', getHallCapacity);

// ===== STUDENT ROUTES =====
router.get('/students', getStudents);

// ===== SEAT ASSIGNMENT ROUTES =====
// Backwards-compatible route used by client: /api/examSeatAllocation/assigned
router.get('/assigned', getSeatAssignments);
// Allow GET on the base mount as some clients call /api/examSeatAllocation with query params
router.get('/', getSeatAssignments);
router.get('/seat-assignments', getSeatAssignments);
// POST on base mount handles bulk assignments (client sends { assignments: [...] })
router.post('/', bulkCreateSeatAssignments);
router.post('/seat-assignments', createSeatAssignment);
router.put('/seat-assignments/:id', updateSeatAssignment);
router.delete('/seat-assignments/:id', deleteSeatAssignment);
// Backwards-compatible DELETE routes for clearing assignments
router.delete('/clear', clearSeatAssignments);
router.delete('/seat-assignments/clear', clearSeatAssignments);
router.post('/seat-assignments/bulk', bulkCreateSeatAssignments);

// ===== UTILITY ROUTES =====
router.get('/exam-details', getExamDetails);

export default router;