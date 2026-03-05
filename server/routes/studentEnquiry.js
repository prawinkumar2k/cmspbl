import express from 'express';
import {
  getStudentEnquiries,
  getStudentEnquiryById,
  searchStudentEnquiries,
  addStudentEnquiry,
  updateStudentEnquiry,
  deleteStudentEnquiry,
  getStudentEnquiryStatistics,
  bulkDeleteStudentEnquiries
} from '../controller/studentEnquiryController.js';

const router = express.Router();

// Get all student enquiries
router.get('/', getStudentEnquiries);

// Get statistics
router.get('/statistics', getStudentEnquiryStatistics);

// Search student enquiries
router.get('/search', searchStudentEnquiries);

// Get single student enquiry by ID
router.get('/:id', getStudentEnquiryById);

// Add new student enquiry
router.post('/create', addStudentEnquiry);

// Update student enquiry
router.put('/:id', updateStudentEnquiry);

// Delete student enquiry
router.delete('/:id', deleteStudentEnquiry);

// Bulk delete student enquiries
router.post('/bulk-delete', bulkDeleteStudentEnquiries);

export default router;