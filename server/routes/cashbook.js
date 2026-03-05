// server/routes/cashbook.js
import express from 'express';
import { getCashBookEntries } from '../controller/cashBookController.js';

const router = express.Router();

// GET /api/cashbook
router.get('/', getCashBookEntries);

export default router;
