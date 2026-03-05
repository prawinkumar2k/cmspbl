import { ExamTimetable, HallMaster, ExamStudentList, ExamGeneration } from '../models/Exam.js';

// ===== EXAM TIMETABLE FILTERED ENDPOINT =====
export const getExamTimetableDetails = async (req, res) => {
  try {
    const { examDate, session, subjectCode, deptCode, semester, regulation } = req.query;

    if (!examDate || !session || !subjectCode || !deptCode || !semester || !regulation) {
      return res.status(400).json({ success: false, error: 'Missing required query parameters' });
    }

    const filter = {
      examDate: new Date(examDate),
      session,
      subCode: subjectCode,
      deptCode,
      semester,
      regulation
    };

    const result = await ExamTimetable.findOne(filter);

    if (result) {
      res.json({ success: true, data: result });
    } else {
      res.json({ success: true, data: null, message: 'No timetable found' });
    }
  } catch (err) {
    console.error('Error fetching exam timetable details:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch exam timetable details', details: err.message });
  }
};

// ===== TIMETABLE ENDPOINTS =====
export const getTimetable = async (req, res) => {
  try {
    const results = await ExamTimetable.find().sort({ examDate: 1, session: 1 });
    res.json({ success: true, data: results, count: results.length });
  } catch (err) {
    console.error('Error fetching timetable:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch timetable', details: err.message });
  }
};

// ===== HALL ENDPOINTS =====
export const getHalls = async (req, res) => {
  try {
    const results = await HallMaster.find({ status: 'active' }).sort({ hallName: 1 });

    // Map to expected snake_case/PascalCase for frontend
    const mapped = results.map(r => ({
      id: r._id,
      Hall_Code: r.hallCode,
      Hall_Name: r.hallName,
      Total_Rows: r.totalRows,
      Total_Columns: r.totalColumns,
      Seating_Capacity: r.seatingCapacity,
      Block_Name: r.blockName,
      Floor_Number: r.floorNumber,
      Hall_Type: r.hallType,
      Status: r.status
    }));

    res.json({ success: true, data: mapped, count: mapped.length });
  } catch (err) {
    console.error('Error fetching halls:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch halls', details: err.message });
  }
};

// ===== STUDENT ENDPOINTS =====
export const getStudents = async (req, res) => {
  try {
    const { examDate, session, subjectCode, deptCode, semester, regulation } = req.query;

    if (!examDate || !session || !subjectCode || !deptCode || !semester || !regulation) {
      return res.status(400).json({ success: false, error: 'Missing required query parameters' });
    }

    const filter = {
      examDate: new Date(examDate),
      session,
      subCode: subjectCode,
      deptCode,
      semester,
      regulation
    };

    const results = await ExamStudentList.find(filter).sort({ registerNumber: 1 });

    const mapped = results.map(r => ({
      Register_Number: r.registerNumber,
      Student_Name: r.studentName || 'N/A'
    }));

    res.json({ success: true, data: mapped, count: mapped.length });
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch students', details: err.message });
  }
};

// ===== SEAT ASSIGNMENT ENDPOINTS =====
export const getSeatAssignments = async (req, res) => {
  try {
    const { examDate, exam_date, session, subjectCode, subject_code, deptCode, dept_code, hallId, hall_id, hallCode, hall_code, semester, regulation } = req.query;

    const q = {
      examDate: examDate || exam_date,
      subjectCode: subjectCode || subject_code,
      deptCode: deptCode || dept_code,
      hallCode: hallCode || hall_code,
      session,
      semester,
      regulation
    };

    const filter = {};
    if (q.examDate) filter.examDate = new Date(q.examDate);
    if (q.session) filter.session = q.session;
    if (q.subjectCode) filter.subjectCode = q.subjectCode;
    if (q.deptCode) filter.deptCode = q.deptCode;
    if (q.hallCode) filter.hallCode = q.hallCode;
    if (q.semester) filter.semester = q.semester;
    if (q.regulation) filter.regulation = q.regulation;

    const results = await ExamGeneration.find(filter).sort({ examDate: 1, session: 1, hallCode: 1, row: 1, col: 1 });

    // Map to expected format
    const mapped = results.map(r => ({
      id: r._id,
      exam_date: r.examDate,
      session: r.session,
      subject_code: r.subjectCode,
      subject_name: r.subjectName,
      dept_code: r.deptCode,
      semester: r.semester,
      regulation: r.regulation,
      hall_code: r.hallCode,
      hall_name: r.hallName,
      register_number: r.registerNumber,
      student_name: r.studentName,
      row: r.row,
      col: r.col,
      created_at: r.createdAt,
      updated_at: r.updatedAt
    }));

    res.json({ success: true, data: mapped, count: mapped.length });
  } catch (err) {
    console.error('Error fetching assignments:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch assignments', details: err.message });
  }
};

export const createSeatAssignment = async (req, res) => {
  try {
    const b = req.body;

    const entry = await ExamGeneration.create({
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
      row: parseInt(b.row),
      col: parseInt(b.col),
      registerNumber: b.register_number,
      studentName: b.student_name,
      seatNo: b.seat_no,
    });

    res.status(201).json({ success: true, data: entry, message: 'Seat assignment created successfully' });
  } catch (err) {
    console.error('Error creating seat assignment:', err);
    if (err.code === 11000) {
      return res.status(409).json({ success: false, error: 'Seat or student already assigned for this exam.' });
    }
    res.status(500).json({ success: false, error: 'Failed to create seat assignment', details: err.message });
  }
};

export const updateSeatAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const b = req.body;

    const updateData = {};
    if (b.hall_code !== undefined) updateData.hallCode = b.hall_code;
    if (b.hall_name !== undefined) updateData.hallName = b.hall_name;
    if (b.row !== undefined) updateData.row = parseInt(b.row);
    if (b.col !== undefined) updateData.col = parseInt(b.col);
    if (b.register_number !== undefined) updateData.registerNumber = b.register_number;
    if (b.student_name !== undefined) updateData.studentName = b.student_name;
    if (b.seat_no !== undefined) updateData.seatNo = b.seat_no;

    const updated = await ExamGeneration.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ success: false, error: 'Assignment not found' });

    res.json({ success: true, data: updated, message: 'Assignment updated successfully' });
  } catch (err) {
    console.error('Error updating assignment:', err);
    res.status(500).json({ success: false, error: 'Failed to update assignment', details: err.message });
  }
};

export const deleteSeatAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ExamGeneration.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ success: false, error: 'Assignment not found' });
    res.json({ success: true, message: 'Assignment deleted successfully' });
  } catch (err) {
    console.error('Error deleting assignment:', err);
    res.status(500).json({ success: false, error: 'Failed to delete assignment', details: err.message });
  }
};

export const clearSeatAssignments = async (req, res) => {
  try {
    const { examDate, exam_date, session, subjectCode, subject_code, deptCode, dept_code, hallCode, hall_code, semester, regulation } = req.query;

    const q = {
      examDate: examDate || exam_date,
      session,
      subjectCode: subjectCode || subject_code,
      deptCode: deptCode || dept_code,
      hallCode: hallCode || hall_code,
      semester,
      regulation
    };

    if (!q.examDate || !q.session || !q.subjectCode || !q.hallCode) {
      return res.status(400).json({ success: false, error: 'examDate, session, subjectCode, and hallCode are required' });
    }

    const filter = {
      examDate: new Date(q.examDate),
      session: q.session,
      subjectCode: q.subjectCode,
      hallCode: q.hallCode
    };
    if (q.deptCode) filter.deptCode = q.deptCode;
    if (q.semester) filter.semester = q.semester;
    if (q.regulation) filter.regulation = q.regulation;

    const result = await ExamGeneration.deleteMany(filter);

    res.json({ success: true, message: `Cleared ${result.deletedCount} seat assignments`, deletedCount: result.deletedCount });
  } catch (err) {
    console.error('Error clearing assignments:', err);
    res.status(500).json({ success: false, error: 'Failed to clear assignments', details: err.message });
  }
};

export const bulkCreateSeatAssignments = async (req, res) => {
  try {
    const { assignments } = req.body;
    if (!Array.isArray(assignments) || assignments.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid assignments data.' });
    }

    const docs = assignments.map(b => ({
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
      row: parseInt(b.row),
      col: parseInt(b.col),
      registerNumber: b.register_number,
      studentName: b.student_name,
      seatNo: b.seat_no,
    }));

    const result = await ExamGeneration.insertMany(docs, { ordered: false }).catch(err => {
      // Partial success is possible with ordered: false
      return err.insertedDocs;
    });

    res.status(201).json({ success: true, message: 'Bulk assignments created' });
  } catch (err) {
    console.error('Error bulk creating assignments:', err);
    res.status(500).json({ success: false, error: 'Failed to process bulk assignments', details: err.message });
  }
};
export const getExamDetails = async (req, res) => {
  try {
    const { examDate, session, subjectCode, deptCode } = req.query;
    const tt = await ExamTimetable.findOne({ examDate, session, subCode: subjectCode, deptCode });
    res.json(tt);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getHallCapacity = async (req, res) => {
  try {
    const { hallCode } = req.query;
    const hall = await HallMaster.findOne({ hallCode });
    res.json({ capacity: hall ? hall.seatingCapacity : 0 });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
