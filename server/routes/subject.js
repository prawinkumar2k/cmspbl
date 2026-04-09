import { Router } from 'express';
import {
  getSubjects,
  addSubject,
  editSubject,
  deleteSubject,
  checkSubjectCode
} from '../controller/subjectController.js';
import Course from '../models/Course.js';
import Regulation from '../models/Regulation.js';
import Semester from '../models/Semester.js';

const router = Router();

router.get('/', getSubjects);
router.post('/', addSubject);
router.put('/:id', editSubject);
router.delete('/:id', deleteSubject);
router.get('/check-subject-code', checkSubjectCode);

// Master data endpoints
router.get('/master/semester', async (req, res) => {
  try {
    const semesters = (await Semester.distinct('semesterName'))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
    res.json(semesters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/master/regulation', async (req, res) => {
  try {
    const regulations = (await Regulation.distinct('regulationName'))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
    res.json(regulations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/master/subject-type', async (req, res) => {
  try {
    res.json(['Theory', 'Practical']);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/master/elective', async (req, res) => {
  try {
    res.json(['Yes', 'No']);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/master/department', async (req, res) => {
  try {
    const departments = (await Course.distinct('deptCode'))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
