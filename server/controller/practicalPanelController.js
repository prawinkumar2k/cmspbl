import { Subject, Student } from '../models/index.js';

/**
 * GET PRACTICAL PANEL REPORT
 */
export const getPracticalPanel = async (req, res) => {
  try {
    const { deptCode, semester } = req.query;

    if (!deptCode || !semester) {
      return res.status(400).json({
        message: "Department Code and Semester are required"
      });
    }

    const semNum = parseInt(semester);

    // 1. Get Practical subjects for this dept and semester
    const subjects = await Subject.find({
      deptCode,
      semester: String(semNum),
      subType: 'P' // Standardizing on 'P' for practical as used in Subject model
    }).sort({ subCode: 1 });

    const results = [];

    for (const sub of subjects) {
      const subCode = sub.subCode;
      const regExp = new RegExp(`(^|,)${subCode}(,|$)`);

      // 2. Count students who have this subject in their current semester registration
      const count = await Student.countDocuments({
        deptCode,
        semester: String(semNum),
        admissionStatus: 'Admitted',
        [`arrearSem${semNum}`]: regExp
      });

      results.push({
        Dept_Code: sub.deptCode,
        Semester: sub.semester,
        Sub_Code: sub.subCode,
        Sub_Name: sub.subName,
        Col_No: sub.colNo || '', // Legacy fields from SQL
        Type: sub.type || 'P',
        Candidate: count
      });
    }

    res.json(results);
  } catch (error) {
    console.error("Practical Panel Error:", error);
    res.status(500).json({
      message: "Failed to generate Practical Panel report"
    });
  }
};
