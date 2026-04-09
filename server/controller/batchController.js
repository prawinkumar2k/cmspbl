import Student from '../models/Student.js';

export const getStudentsForBatch = async (req, res) => {
  try {
    const { Course_Name, Dept_Code, Semester, Year, Regulation, Section } = req.query;

    const query = {
      $or: [
        { deptCode: Dept_Code },
        { Dept_Code: Dept_Code }
      ],
      $and: [
        { semester: Semester },
        { year: Year },
        { regulation: Regulation }
      ],
      admissionStatus: 'Admitted'
    };

    if (Section) {
      query.$and.push({ class: Section });
    }

    const students = await Student.find(query)
      .select('rollNumber registerNumber studentName batch class Dept_Code Semester')
      .sort({ studentName: 1 })
      .lean();

    const mapped = students.map(s => ({
      _id: s._id,
      Roll_Number: s.rollNumber || s.Roll_Number || '',
      Reg_Number: s.registerNumber || s.Reg_Number || '',
      Student_Name: s.studentName || s.Student_Name || '',
      Batch: s.batch || s.Batch || '',
      Section: s.class || s.Section || s.Section_Name || '',
    }));

    res.json(mapped);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateStudentBatches = async (req, res) => {
  try {
    const { studentIds, batchName } = req.body;

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ error: 'No students selected' });
    }

    const result = await Student.updateMany(
      { _id: { $in: studentIds } },
      { $set: { batch: batchName } }
    );

    res.json({
      success: true,
      message: `Successfully allocated ${result.modifiedCount} students to ${batchName}`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
