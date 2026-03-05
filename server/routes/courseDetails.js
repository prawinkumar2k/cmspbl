import { Router } from 'express';
import db from '../db.js';

const router = Router();

// GET /api/courseDetails - Returns all unique departments (for dropdown filters)
router.get('/', async (req, res) => {
  const { course, department } = req.query;
  
  // If course and department are provided, return specific course details
  if (course && department) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM course_details WHERE Course_Name = ? AND Dept_Name = ? LIMIT 1',
        [course, department]
      );
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Course/Department not found' });
      }
      const details = rows[0];
      return res.json({
        code: details.Dept_Code,
        details
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  
  // If no parameters, return all unique departments
  try {
    const [rows] = await db.query('SELECT DISTINCT Dept_Name FROM course_details ORDER BY Dept_Name');
    const departments = rows.map(row => row.Dept_Name);
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
