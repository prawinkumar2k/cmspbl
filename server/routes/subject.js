import { Router } from 'express';
import {
  getSubjects,
  addSubject,
  editSubject,
  deleteSubject,
  checkSubjectCode
} from '../controller/subjectController.js';
import db from '../db.js';

const router = Router();

router.get('/', getSubjects);
router.post('/', addSubject);
router.put('/:id', editSubject);
router.delete('/:id', deleteSubject);
router.get('/check-subject-code', checkSubjectCode);

// Master data endpoints
router.get('/master/semester', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT Semester FROM semester_master');
    res.json(rows.map(r => r.Semester));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/master/regulation', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT Regulation FROM regulation_master');
    res.json(rows.map(r => r.Regulation));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/master/subject-type', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT Sub_Type FROM subject_type_matser');
    res.json(rows.map(r => r.Sub_Type));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/master/elective', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT Elective FROM elective_matser');
    res.json(rows.map(r => r.Elective));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/master/department', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT Dept_Code FROM course_details');
    res.json(rows.map(r => r.Dept_Code));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
