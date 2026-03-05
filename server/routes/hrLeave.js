import express from 'express';
import {
    getLeaveApplications,
    createLeaveApplication,
    updateLeaveApplication,
    deleteLeaveApplication,
    approveLeave,
    rejectLeave,
    getLeaveTypes
} from '../controller/hrLeaveController.js';

const router = express.Router();

// Leave Types
router.get('/leave-types', getLeaveTypes);

// Leave Requests (Frontend uses /leave-requests)
router.post('/leave-requests', createLeaveApplication);
router.get('/leave-requests', getLeaveApplications); // Optional, for consistency

// Legacy Routes (keeping if used elsewhere)
router.get('/applications', getLeaveApplications);
router.post('/applications', createLeaveApplication);
router.put('/applications/:id', updateLeaveApplication);
router.delete('/applications/:id', deleteLeaveApplication);
router.put('/applications/:id/approve', approveLeave);
router.put('/applications/:id/reject', rejectLeave);

export default router;
