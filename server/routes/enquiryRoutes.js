import express from 'express';

import { getAllEnquiries, getTodaysEnquiries } from '../controller/enquiryController.js';
import { getEnquiryReportData } from '../controller/enquiryReportController.js';

const router = express.Router();

// GET all enquiry_call_notes_tenant records
router.get('/all', getAllEnquiries);
router.get('/today', getTodaysEnquiries);
router.get('/report', getEnquiryReportData);

export default router;

