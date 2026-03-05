import express from 'express';
import { getDepartments, getChecklistReport } from '../controller/checklistController.js';

const router = express.Router();

router.get('/departments', getDepartments);
router.get('/report', getChecklistReport);

export default router;
