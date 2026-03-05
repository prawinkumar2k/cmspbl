/**
 * Class Controller — MongoDB version
 * class_master → ClassMaster model
 * student_master queries → Student model
 */
import Student from '../models/Student.js';
import Staff from '../models/Staff.js';
import ClassMaster from '../models/ClassMaster.js';

export const getStudentsByAllocation = async (req, res) => {
  try {
    const { Course_Name, Dept_Code, Semester, Year, Regulation } = req.query;
    if (!Course_Name || !Dept_Code || !Semester || !Year || !Regulation) {
      return res.status(400).json({ error: 'All parameters are required' });
    }

    const students = await Student.find({
      courseName: Course_Name, deptCode: Dept_Code, semester: Semester,
      year: Year, regulation: Regulation, admissionStatus: 'Admitted'
    })
      .select('rollNumber registerNumber studentName class classTeacher')
      .sort({ rollNumber: 1 });

    // Return in MySQL field name format for frontend compat
    res.json(students.map(s => ({
      Roll_Number: s.rollNumber,
      Register_Number: s.registerNumber,
      Student_Name: s.studentName,
      Class: s.class,
      Class_Teacher: s.classTeacher,
    })));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getStaffByDepartment = async (req, res) => {
  try {
    const { Course_Name, Dept_Code } = req.query;
    if (!Course_Name || !Dept_Code) {
      return res.status(400).json({ error: 'Course_Name and Dept_Code are required' });
    }

    const staff = await Staff.find({ deptCode: Dept_Code })
      .select('staffId staffName designation').sort({ staffId: 1 }).distinct;

    res.json(staff.map(s => ({ Staff_ID: s.staffId, Staff_Name: s.staffName, Designation: s.designation })));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getDistinctClasses = async (req, res) => {
  try {
    const classes = await ClassMaster.find().select('className').sort({ className: 1 });
    res.json(classes.map(c => c.className));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const createClass = async (req, res) => {
  try {
    const { className } = req.body;
    if (!className) return res.status(400).json({ error: 'Class name is required' });

    const existing = await ClassMaster.findOne({ className: new RegExp(`^${className}$`, 'i') });
    if (existing) return res.status(400).json({ error: 'Class already exists. Please select from existing classes.' });

    const doc = await ClassMaster.create({ className });
    res.status(201).json({ success: true, id: doc._id, className });
  } catch (err) {
    console.error('Error creating class:', err);
    res.status(500).json({ error: 'Failed to create class' });
  }
};

export const updateStudentsClassInfo = async (req, res) => {
  try {
    const { rollNumbers, section, classTeacher, courseName, deptCode } = req.body;
    if (!rollNumbers?.length) return res.status(400).json({ error: 'Roll numbers array is required' });
    if (!section || !classTeacher || !courseName || !deptCode) {
      return res.status(400).json({ error: 'Section, Class Teacher, Course Name, and Dept Code are required' });
    }

    // ✅ MongoDB: $in replaces MySQL IN (?,?,?)
    const result = await Student.updateMany(
      { rollNumber: { $in: rollNumbers }, courseName, deptCode },
      { $set: { class: section, classTeacher } }
    );

    res.json({ message: 'Students updated successfully', affectedRows: result.modifiedCount });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
