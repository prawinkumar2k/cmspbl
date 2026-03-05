import express from 'express';
import { getSeatAllocationReport } from '../controller/seatAllocationController.js';

const router = express.Router();

// Get seat allocation report
router.get('/seat-allocation-report', getSeatAllocationReport);

export default router;
