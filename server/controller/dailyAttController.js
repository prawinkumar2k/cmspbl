import { Student, Staff, Course, Semester, Regulation, AcademicCalendar, SubjectAllocation, StudentAttendance, TimetablePeriod } from '../models/index.js';

// Get all staff
export const getAllStaff = async (req, res) => {
  try {
    const rows = await Staff.find({}, { staffId: 1, staffName: 1 }).sort({ staffName: 1 });
    // Map to frontend expected names
    res.json(rows.map(r => ({ Staff_ID: r.staffId, Staff_Name: r.staffName })));
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
};

// Get departments handled by a specific staff
export const getDepartmentsByStaff = async (req, res) => {
  try {
    const { staffId } = req.query;
    if (!staffId) return res.status(400).json({ error: 'Staff ID is required' });

    // Find allocations for this staff
    const allocations = await SubjectAllocation.find({ staffId });

    // Collect all unique deptCodes from sub1-sub7
    const deptCodes = new Set();
    allocations.forEach(a => {
      for (let i = 1; i <= 7; i++) {
        const code = a[`sub${i}DeptCode`];
        if (code) deptCodes.add(code);
      }
    });

    if (deptCodes.size === 0) return res.json([]);

    // Get names from Course collection
    const courses = await Course.find({ deptCode: { $in: Array.from(deptCodes) } }).sort({ deptName: 1 });
    res.json(courses.map(c => ({ Dept_Code: c.deptCode, Dept_Name: c.deptName })));
  } catch (error) {
    console.error('Error fetching departments by staff:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

// Get all departments
export const getDepartments = async (req, res) => {
  try {
    const rows = await Course.find({}, { deptCode: 1, deptName: 1 }).sort({ deptName: 1 });
    res.json(rows.map(r => ({ Dept_Code: r.deptCode, Dept_Name: r.deptName })));
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

// Get all semesters
export const getSemesters = async (req, res) => {
  try {
    const rows = await Semester.find().sort({ semesterNumber: 1 });
    res.json(rows.map(r => ({ Semester: r.semesterName }))); // Map to frontend
  } catch (error) {
    console.error('Error fetching semesters:', error);
    res.status(500).json({ error: 'Failed to fetch semesters' });
  }
};

// Get all regulations
export const getRegulations = async (req, res) => {
  try {
    const rows = await Regulation.find().sort({ regulationName: -1 });
    res.json(rows.map(r => ({ Regulation: r.regulationName })));
  } catch (error) {
    console.error('Error fetching regulations:', error);
    res.status(500).json({ error: 'Failed to fetch regulations' });
  }
};

// Get all classes
export const getClasses = async (req, res) => {
  try {
    const { deptCode, semester, regulation } = req.query;
    const filter = {};
    if (deptCode) filter.deptCode = deptCode;
    if (semester) filter.semester = semester;
    if (regulation) filter.regulation = regulation;

    // In Student model, class is 'class' field
    const classes = await Student.distinct('class', filter);
    res.json(classes.sort().map(c => ({ Class: c })));
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
};

// Get subjects
export const getSubjects = async (req, res) => {
  try {
    const { staffId, deptCode, semester, regulation, date, dayOrder, classSection } = req.query;

    if (!staffId || !deptCode || !semester || !regulation || !date || !dayOrder || !classSection) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const rows = await TimetablePeriod.find({
      calendarDate: date,
      dayOrder: dayOrder,
      deptCode: deptCode,
      semester: semester,
      regulation: regulation,
      classSection: classSection
    }).distinct('subCode');

    // We need subName too, so another find
    const subjects = await TimetablePeriod.find({
      calendarDate: date,
      dayOrder: dayOrder,
      deptCode: deptCode,
      semester: semester,
      regulation: regulation,
      classSection: classSection,
      subCode: { $in: rows }
    }, { subCode: 1, subName: 1, _id: 0 });

    // Unique by subCode
    const uniqueSubjects = [];
    const seen = new Set();
    subjects.forEach(s => {
      if (!seen.has(s.subCode)) {
        seen.add(s.subCode);
        uniqueSubjects.push({ Sub_Code: s.subCode, Sub_Name: s.subName });
      }
    });

    res.json(uniqueSubjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
};

// Get staff ID by name
export const getStaffBySubject = async (req, res) => {
  try {
    const { staffName } = req.query;
    if (!staffName) return res.status(400).json({ error: 'Staff name is required' });

    const staff = await Staff.findOne({ staffName: staffName });
    if (!staff) return res.json({ staffId: null, message: 'Staff not found' });

    res.json({ staffId: staff.staffId });
  } catch (error) {
    console.error('Error fetching staff ID:', error);
    res.status(500).json({ error: 'Failed to fetch staff ID' });
  }
};

// Get day order
export const getDayOrder = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'Date is required' });

    const cal = await AcademicCalendar.findOne({ calendarDate: date });
    if (!cal) return res.json({ dayOrder: null, message: 'No day order configured for this date' });

    res.json({ dayOrder: cal.dayOrder });
  } catch (error) {
    console.error('Error fetching day order:', error);
    res.status(500).json({ error: 'Failed to fetch day order' });
  }
};

// Get periods
export const getPeriods = async (req, res) => {
  try {
    const q = req.query;
    if (!q.date || !q.dayOrder || !q.subjectCode || !q.deptCode || !q.semester || !q.regulation || !q.classSection) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const rows = await TimetablePeriod.find({
      calendarDate: q.date,
      dayOrder: q.dayOrder,
      subCode: q.subjectCode,
      deptCode: q.deptCode,
      semester: q.semester,
      regulation: q.regulation,
      classSection: q.classSection
    }).distinct('periodNo');

    res.json(rows.sort((a, b) => a - b).map(p => ({ period_no: p })));
  } catch (error) {
    console.error('Error fetching periods:', error);
    res.status(500).json({ error: 'Failed to fetch periods' });
  }
};

// Get students for attendance
export const getStudents = async (req, res) => {
  try {
    const { deptCode, semester, regulation, classSection } = req.query;
    if (!deptCode || !semester || !regulation || !classSection) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const rows = await Student.find({
      deptCode, semester, regulation, class: classSection
    }).sort({ studentName: 1 });

    res.json(rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

// Save attendance data
export const saveAttendance = async (req, res) => {
  try {
    const data = req.body;
    const { date, dayOrder, departmentCode, department, semester, regulation, subjectCode, subject, period, attendance, staffId, staffName, classSection } = data;

    if (!date || !departmentCode || !semester || !regulation || !subjectCode || !period) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const operations = attendance.filter(r => r.status && r.regNo).map(record => ({
      insertOne: {
        document: {
          attDate: new Date(date),
          dayOrder,
          markedBy: staffId,
          deptCode: departmentCode,
          deptName: department,
          semester,
          regulation,
          class: classSection,
          subjectCode,
          subjectName: subject,
          period: period, // Storing as string "1,2,3" as per original implementation
          registerNumber: record.regNo,
          studentName: record.name,
          attStatus: record.status.toLowerCase() === 'p' ? 'present' : (record.status.toLowerCase() === 'a' ? 'absent' : (record.status.toLowerCase() === 'od' ? 'onDuty' : 'medicalLeave'))
        }
      }
    }));

    if (operations.length > 0) {
      await StudentAttendance.bulkWrite(operations);
    }

    res.json({ success: true, message: 'Attendance saved successfully' });
  } catch (error) {
    console.error('Error saving attendance:', error);
    res.status(500).json({ error: 'Failed to save attendance', details: error.message });
  }
};

// Get attendance history
export const getAttendanceHistory = async (req, res) => {
  try {
    const { date, deptCode, semester, regulation } = req.query;
    const filter = {};
    if (date) filter.attDate = new Date(date);
    if (deptCode) filter.deptCode = deptCode;
    if (semester) filter.semester = semester;
    if (regulation) filter.regulation = regulation;

    const rows = await StudentAttendance.find(filter).sort({ attDate: -1, period: 1 });
    res.json(rows);
  } catch (error) {
    console.error('Error fetching attendance history:', error);
    res.status(500).json({ error: 'Failed to fetch attendance history' });
  }
};
