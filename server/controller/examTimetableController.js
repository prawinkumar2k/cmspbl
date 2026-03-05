import { ExamStudentList } from '../models/Exam.js';

// GET exam timetable student list
export const getExamTimetableStudentList = async (req, res) => {
  try {
    const rows = await ExamStudentList.find().sort({ createdAt: -1 });

    // Map to old MySQL field names (if frontend expects snake_case based on original SELECT *)
    const mapped = rows.map(r => ({
      deptCode: r.deptCode,
      registerNumber: r.registerNumber,
      subCode: r.subCode,
      examType: r.examType
    }));

    res.status(200).json({
      success: true,
      data: mapped
    });
  } catch (error) {
    console.error("Error fetching exam timetable view:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch exam timetable student list"
    });
  }
};