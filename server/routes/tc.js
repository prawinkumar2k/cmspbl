import express from 'express';
import { saveTC, getAllTC, getTCByRegNo, updateTC } from '../controller/tcController.js';

const router = express.Router();

router.get('/all', getAllTC);
router.get('/by-regno', getTCByRegNo);
router.post('/save', saveTC);
router.put('/update/:id', updateTC);

export default router;
