import { StudentAttendance, Student, Course } from '../models/index.js';

// Get all marked attendance with filters
export const getMarkedAttendance = async (req, res) => {
  try {
    const { deptCode, semester, regulation, fromDate, toDate, searchTerm, status } = req.query;

    const filter = {};
    if (deptCode) filter.deptCode = deptCode;
    if (semester) filter.semester = semester;
    if (regulation) filter.regulation = regulation;
    if (fromDate && toDate) filter.attDate = { $gte: new Date(fromDate), $lte: new Date(toDate) };
    if (status) filter.attStatus = status.toLowerCase() === 'p' ? 'present' : (status.toLowerCase() === 'a' ? 'absent' : (status.toLowerCase() === 'od' ? 'onDuty' : 'medicalLeave'));

    if (searchTerm) {
      // Find matching students first
      const students = await Student.find({
        $or: [
          { registerNumber: new RegExp(searchTerm, 'i') },
          { studentName: new RegExp(searchTerm, 'i') }
        ]
      }, { registerNumber: 1 });

      const regNos = students.map(s => s.registerNumber);
      filter.registerNumber = { $in: regNos };
    }

    const rows = await StudentAttendance.find(filter).sort({ attDate: -1, period: 1 });

    // Map back to expected field names/formats if necessary
    const mapped = rows.map(r => ({
      ...r.toObject(),
      Id: r._id,
      Att_Date: r.attDate.toISOString().split('T')[0],
      Att_Status: r.attStatus === 'present' ? 'P' : (r.attStatus === 'absent' ? 'A' : (r.attStatus === 'onDuty' ? 'OD' : 'ML')),
      Period: r.period,
      Register_Number: r.registerNumber,
      Student_Name: r.studentName,
      Dept_Name: r.deptName,
      Dept_Code: r.deptCode
    }));

    res.json(mapped);
  } catch (error) {
    console.error('Error fetching marked attendance:', error);
    res.status(500).json({ error: 'Failed to fetch marked attendance' });
  }
};

// Get attendance by ID
export const getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const r = await StudentAttendance.findById(id);

    if (!r) return res.status(404).json({ error: 'Attendance record not found' });

    res.json({
      ...r.toObject(),
      Id: r._id,
      Att_Date: r.attDate.toISOString().split('T')[0],
      Att_Status: r.attStatus === 'present' ? 'P' : (r.attStatus === 'absent' ? 'A' : (r.attStatus === 'onDuty' ? 'OD' : 'ML')),
      Register_Number: r.registerNumber,
      Student_Name: r.studentName,
      Dept_Name: r.deptName,
      Dept_Code: r.deptCode
    });
  } catch (error) {
    console.error('Error fetching attendance by ID:', error);
    res.status(500).json({ error: 'Failed to fetch attendance record' });
  }
};

// Update attendance status
export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { attStatus } = req.body;

    if (!attStatus) return res.status(400).json({ error: 'Attendance status is required' });

    const mongoStatus = attStatus.toLowerCase() === 'p' ? 'present' : (attStatus.toLowerCase() === 'a' ? 'absent' : (attStatus.toLowerCase() === 'od' ? 'onDuty' : 'medicalLeave'));

    const updated = await StudentAttendance.findByIdAndUpdate(id, { attStatus: mongoStatus }, { new: true });

    if (!updated) return res.status(404).json({ error: 'Attendance record not found' });

    res.json({ success: true, message: 'Attendance updated successfully' });
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ error: 'Failed to update attendance' });
  }
};

// Delete attendance record
export const deleteAttendance = async (req, res) => {
  try {
    const result = await StudentAttendance.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Attendance record not found' });
    res.json({ success: true, message: 'Attendance record deleted successfully' });
  } catch (error) {
    console.error('Error deleting attendance:', error);
    res.status(500).json({ error: 'Failed to delete attendance' });
  }
};

// Get attendance statistics
export const getAttendanceStats = async (req, res) => {
  try {
    const { deptCode, semester, regulation, fromDate, toDate } = req.query;

    const filter = {};
    if (deptCode) filter.deptCode = deptCode;
    if (semester) filter.semester = semester;
    if (regulation) filter.regulation = regulation;
    if (fromDate && toDate) filter.attDate = { $gte: new Date(fromDate), $lte: new Date(toDate) };

    const stats = await StudentAttendance.aggregate([
      { $match: filter },
      { $group: { _id: "$attStatus", count: { $sum: 1 } } }
    ]);

    // Map stats back to frontend labels
    const mapped = stats.map(s => ({
      Att_Status: s._id === 'present' ? 'P' : (s._id === 'absent' ? 'A' : (s._id === 'onDuty' ? 'OD' : 'ML')),
      count: s.count
    }));

    res.json(mapped);
  } catch (error) {
    console.error('Error fetching attendance stats:', error);
    res.status(500).json({ error: 'Failed to fetch attendance statistics' });
  }
};
