import express from 'express';
import { getAllLetters, addLetter } from '../controller/sendLetterController.js';

const router = express.Router();

// =======================
// Send Letter Routes
// =======================

// GET all letters
router.get('/', getAllLetters);

// ADD new letter
router.post('/', addLetter);

export default router;
