import express from 'express';
import { getDigitalNumberingReport } from '../controller/digitalNumberingController.js';

const router = express.Router();

// Get digital numbering report
router.get('/digital-numbering-report', getDigitalNumberingReport);

export default router;
