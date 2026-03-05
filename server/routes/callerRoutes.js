
import express from 'express';
import { getAllCallers } from '../controller/callerController.js';

const router = express.Router();

// GET /api/callers
router.get('/', getAllCallers);

export default router;
