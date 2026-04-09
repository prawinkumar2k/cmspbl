import { Router } from 'express';
import Course from '../models/Course.js';

const router = Router();

// GET /api/courseDetails - Returns all unique departments (for dropdown filters)
router.get('/', async (req, res) => {
  const { course, department } = req.query;
  
  // If course and department are provided, return specific course details
  if (course && department) {
    try {
      const details = await Course.findOne({
        courseName: course,
        deptName: department,
      }).lean();

      if (!details) {
        return res.status(404).json({ error: 'Course/Department not found' });
      }

      return res.json({
        code: details.deptCode,
        details: {
          Dept_Code: details.deptCode,
          Dept_Name: details.deptName,
          Course_Name: details.courseName,
          Course_Mode: details.courseMode,
          Year_Of_Course: details.yearOfCourse,
          Dept_Order: details.deptOrder,
          AICTE_Approval: details.aicteApproval,
          AICTE_Approval_No: details.aicteApprovalNo,
          Intake: details.intake,
          AddlSeats: details.addlSeats,
          OC: details.oc,
          BC: details.bc,
          BCO: details.bco,
          BCM: details.bcm,
          MBC_DNC: details.mbcDnc,
          SC: details.sc,
          SCA: details.sca,
          ST: details.st,
          Other: details.other,
          GoiQuota: details.goiQuota,
          MgtQuota: details.mgtQuota,
          Ins_Type: details.insType,
        }
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  
  // If no parameters, return all unique departments
  try {
    const departments = (await Course.distinct('deptName'))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
