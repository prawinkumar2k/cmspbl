import { ExamAttendance } from '../models/Exam.js';

/* ======================================================
   CREATE EXAM ATTENDANCE
====================================================== */
export const createExamAttendance = async (req, res) => {
  try {
    const b = req.body;

    const entry = await ExamAttendance.create({
      examDate: new Date(b.exam_date),
      session: b.session,
      subjectCode: b.subject_code,
      subjectName: b.subject_name,
      deptCode: b.dept_code,
      deptName: b.dept_name,
      semester: b.semester,
      regulation: b.regulation,
      hallCode: b.hall_code,
      hallName: b.hall_name,
      hallCapacity: b.hall_capacity,
      seatNo: b.seat_no,
      row: b.row,
      col: b.col,
      registerNumber: b.register_number,
      studentName: b.student_name,
      attendanceStatus: b.attendance_status
    });

    res.status(201).json({
      success: true,
      message: "Exam attendance created successfully",
      id: entry._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ======================================================
   GET ALL EXAM ATTENDANCE
====================================================== */
export const getExamAttendanceList = async (req, res) => {
  try {
    const rows = await ExamAttendance.find().sort({ examDate: -1 });

    const mapped = rows.map(r => ({
      id: r._id,
      exam_date: r.examDate,
      session: r.session,
      subject_code: r.subjectCode,
      subject_name: r.subjectName,
      dept_code: r.deptCode,
      dept_name: r.deptName,
      semester: r.semester,
      regulation: r.regulation,
      hall_code: r.hallCode,
      hall_name: r.hallName,
      hall_capacity: r.hallCapacity,
      seat_no: r.seatNo,
      row: r.row,
      col: r.col,
      register_number: r.registerNumber,
      student_name: r.studentName,
      attendance_status: r.attendanceStatus,
      created_at: r.createdAt,
      updated_at: r.updatedAt
    }));

    res.json({ success: true, data: mapped });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ======================================================
   GET SINGLE EXAM ATTENDANCE BY ID
====================================================== */
export const getExamAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const r = await ExamAttendance.findById(id);

    if (!r) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    const data = {
      id: r._id,
      exam_date: r.examDate,
      session: r.session,
      subject_code: r.subjectCode,
      subject_name: r.subjectName,
      dept_code: r.deptCode,
      dept_name: r.deptName,
      semester: r.semester,
      regulation: r.regulation,
      hall_code: r.hallCode,
      hall_name: r.hallName,
      hall_capacity: r.hallCapacity,
      seat_no: r.seatNo,
      row: r.row,
      col: r.col,
      register_number: r.registerNumber,
      student_name: r.studentName,
      attendance_status: r.attendanceStatus
    };

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ======================================================
   UPDATE EXAM ATTENDANCE
====================================================== */
export const updateExamAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const b = req.body;

    const updateData = {};
    if (b.attendance_status !== undefined) updateData.attendanceStatus = b.attendance_status;
    if (b.seat_no !== undefined) updateData.seatNo = b.seat_no;
    if (b.row !== undefined) updateData.row = b.row;
    if (b.col !== undefined) updateData.col = b.col;
    if (b.hall_code !== undefined) updateData.hallCode = b.hall_code;
    if (b.hall_name !== undefined) updateData.hallName = b.hall_name;

    const result = await ExamAttendance.findByIdAndUpdate(id, updateData, { new: true });

    if (!result) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    res.json({ success: true, message: "Exam attendance updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ======================================================
   DELETE EXAM ATTENDANCE
====================================================== */
export const deleteExamAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ExamAttendance.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    res.json({ success: true, message: "Exam attendance deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
