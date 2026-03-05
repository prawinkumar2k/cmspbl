import express from 'express';
import { getTheoryNameListReport } from '../controller/theoryNameListController.js';

const router = express.Router();

// Get theory name list report
router.get('/theory-name-list-report', getTheoryNameListReport);

export default router;
