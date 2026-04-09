import { Router } from 'express';
import { getBranches, addBranch, editBranch, deleteBranch, checkCourseCode } from '../controller/branchController.js';
import Course from '../models/Course.js';
import CourseMaster from '../models/CourseMaster.js';
import Regulation from '../models/Regulation.js';

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
    const courseNames = (await CourseMaster.distinct('courseName'))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
    res.json(courseNames);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all institution types from ins_type_master
router.get('/institution-types', async (req, res) => {
  try {
    const institutionTypes = (await Course.distinct('insType'))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
    res.json(institutionTypes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all course modes from course_mode_master
router.get('/course-mode', async (req, res) => {
  try {
    const courseModes = (await Course.distinct('courseMode'))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
    res.json(courseModes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all regulations from regulation_master
router.get('/regulations', async (req, res) => {
  try {
    const regulations = (await Regulation.distinct('regulationName'))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
    res.json(regulations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
