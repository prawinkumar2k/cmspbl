import { StudentFeeMaster } from '../models/StudentFee.js';

/**
 * Fetch student + fee master data
 * Used in Fee Receipt page (auto fill)
 */
export const getStudentFeeMaster = async (req, res) => {
  try {
    const { registerNumber, semester, academicYear } = req.query;

    const filter = {};
    if (registerNumber) filter.registerNumber = registerNumber;
    if (semester) filter.semester = semester;
    if (academicYear) filter.academicYear = academicYear;

    const rows = await StudentFeeMaster.find(filter).sort({ feesType: 1 });

    // Map back to format expected by frontend (which might expect uppercase keys based on original SELECT *)
    const mapped = rows.map(r => ({
      Register_Number: r.registerNumber,
      Semester: r.semester,
      Academic_Year: r.academicYear,
      Fees_Type: r.feesType,
      Amount: r.amount,
      Dept_Code: r.deptCode,
      Course_Name: r.courseName
    }));

    return res.status(200).json({ success: true, data: mapped });

  } catch (error) {
    console.error("Student Fee Master Fetch Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch student fee master data",
    });
  }
};
