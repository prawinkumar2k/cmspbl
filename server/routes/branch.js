import { Router } from 'express';
import { getBranches, addBranch, editBranch, deleteBranch, checkCourseCode } from '../controller/branchController.js';
import db from '../db.js'; // Add this import if not present

const router = Router();

// Get all branches
router.get('/', getBranches);

// Add a new branch
router.post('/', addBranch);

// Edit branch
router.put('/:id', editBranch);

// Delete branch
router.delete('/:id', deleteBranch);

// Check if course code exists
router.get('/check-course-code', checkCourseCode);

// Get all course names from course_master
router.get('/course-names', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT Course_Name FROM course_master');
    res.json(rows.map(row => row.Course_Name));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all institution types from ins_type_master
router.get('/institution-types', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT Ins_Type FROM ins_type_master');
    res.json(rows.map(row => row.Ins_Type));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all course modes from course_mode_master
router.get('/course-mode', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT Course_Mode FROM course_mode_master');
    res.json(rows.map(row => row.Course_Mode));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all regulations from regulation_master
router.get('/regulations', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT Regulation FROM regulation_master');
    res.json(rows.map(row => row.Regulation));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
