import express from 'express';
import { getReportData, getFilterOptions } from '../controller/consolidateReportController.js';

const router = express.Router();

// Route to get consolidated report data
router.get('/data', getReportData);

// Route to get filter options
router.get('/filters', getFilterOptions);

export default router;
