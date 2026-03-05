import express from 'express';
import { getDaywarReport } from '../controller/daywarStatementsController.js';

const router = express.Router();

// Get daywar report
router.get('/daywar-report', getDaywarReport);

export default router;
