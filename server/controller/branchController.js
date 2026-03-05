/**
 * Branch Controller — MongoDB version
 * Replaces course_details MySQL table with Course Mongoose model
 */

import Course from '../models/Course.js';

// ── Get all branches (courses) ────────────────────────────────────────────────

export const getBranches = async (req, res) => {
  try {
    const courses = await Course.find().sort({ deptOrder: 1, deptName: 1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Add a branch ──────────────────────────────────────────────────────────────

export const addBranch = async (req, res) => {
  try {
    const body = req.body;

    const courseData = {
      courseMode: body.Course_Mode,
      deptCode: body.Dept_Code,
      deptName: body.Dept_Name,
      yearOfCourse: body.Year_Of_Course ? parseInt(body.Year_Of_Course) : null,
      courseName: body.Course_Name,
      deptOrder: body.Dept_Order ? parseInt(body.Dept_Order) : null,
      aicteApproval: body.AICTE_Approval,
      aicteApprovalNo: body.AICTE_Approval_No,
      s1: body.S1, s2: body.S2, s3: body.S3, s4: body.S4,
      s5: body.S5, s6: body.S6, s7: body.S7, s8: body.S8,
      r1: body.R1, r2: body.R2, r3: body.R3, r4: body.R4,
      r5: body.R5, r6: body.R6, r7: body.R7, r8: body.R8,
      intake: body.Intake ? parseInt(body.Intake) : null,
      addlSeats: body.AddlSeats ? parseInt(body.AddlSeats) : null,
      oc: body.OC, bc: body.BC, bco: body.BCO, bcm: body.BCM,
      mbcDnc: body.MBC_DNC, sc: body.SC, sca: body.SCA, st: body.ST,
      other: body.Other, goiQuota: body.GoiQuota, mgtQuota: body.MgtQuota,
      insType: body.Ins_Type,
    };

    const newCourse = await Course.create(courseData);
    res.json({ success: true, id: newCourse._id });

  } catch (err) {
    console.error('Error inserting branch:', err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Department code already exists', details: err });
    }
    res.status(500).json({ error: err.message, details: err });
  }
};

// ── Edit a branch ─────────────────────────────────────────────────────────────

export const editBranch = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;

    // Map incoming fields to Mongoose field names
    const updateData = {};
    const fieldMap = {
      Course_Mode: 'courseMode', Dept_Code: 'deptCode', Dept_Name: 'deptName',
      Year_Of_Course: 'yearOfCourse', Course_Name: 'courseName', Dept_Order: 'deptOrder',
      AICTE_Approval: 'aicteApproval', AICTE_Approval_No: 'aicteApprovalNo',
      S1: 's1', S2: 's2', S3: 's3', S4: 's4', S5: 's5', S6: 's6', S7: 's7', S8: 's8',
      R1: 'r1', R2: 'r2', R3: 'r3', R4: 'r4', R5: 'r5', R6: 'r6', R7: 'r7', R8: 'r8',
      Intake: 'intake', AddlSeats: 'addlSeats', OC: 'oc', BC: 'bc', BCO: 'bco', BCM: 'bcm',
      MBC_DNC: 'mbcDnc', SC: 'sc', SCA: 'sca', ST: 'st',
      Other: 'other', GoiQuota: 'goiQuota', MgtQuota: 'mgtQuota', Ins_Type: 'insType',
    };

    for (const [mysqlField, mongoField] of Object.entries(fieldMap)) {
      if (body[mysqlField] !== undefined) {
        updateData[mongoField] = body[mysqlField];
      }
    }

    await Course.findByIdAndUpdate(id, updateData);
    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Delete a branch ───────────────────────────────────────────────────────────

export const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;
    await Course.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Check if course code exists (for duplicate validation) ────────────────────

export const checkCourseCode = async (req, res) => {
  try {
    const { courseCode, excludeId } = req.query;

    if (!courseCode) return res.status(400).json({ exists: false });

    const filter = { deptCode: courseCode };
    if (excludeId) {
      filter._id = { $ne: excludeId };   // exclude current record when editing
    }

    const existing = await Course.findOne(filter).select('_id');
    res.json({ exists: !!existing });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
