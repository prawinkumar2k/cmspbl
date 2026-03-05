// server/routes/leadManagement.js
import express from 'express';

import {
  getAllLeads,
  getLeadById,
  updateLead,
  addCallNote
} from '../controller/leadManagementController.js';

const router = express.Router();

// GET all leads
router.get('/', getAllLeads);

// GET a single lead by id
router.get('/:id', getLeadById);

// PUT update a lead
router.put('/:id', updateLead);

// POST add call note to a lead
router.post('/:id/call-note', addCallNote);

export default router;
