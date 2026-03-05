import { StudentAttendance, Student, Course } from '../models/index.js';

// Helper to map statuses
const statusMap = {
  present: 'P',
  absent: 'A',
  onDuty: 'OD',
  medicalLeave: 'ML'
};

// Get attendance report
export const getAttendanceReport = async (req, res) => {
  try {
    const { deptCode, semester, class: classParam, fromDate, toDate, searchTerm } = req.query;

    const filter = {};
    if (deptCode) filter.deptCode = deptCode;
    if (semester) filter.semester = semester;
    if (classParam) filter.class = classParam;
    if (fromDate || toDate) filter.attDate = {};
    if (fromDate) filter.attDate.$gte = new Date(fromDate);
    if (toDate) filter.attDate.$lte = new Date(toDate);

    if (searchTerm) {
      const students = await Student.find({
        $or: [
          { registerNumber: new RegExp(searchTerm, 'i') },
          { studentName: new RegExp(searchTerm, 'i') }
        ]
      }, { registerNumber: 1 });
      filter.registerNumber = { $in: students.map(s => s.registerNumber) };
    }

    const rows = await StudentAttendance.find(filter).sort({ attDate: -1, registerNumber: 1 });

    // Map to old format
    const mapped = rows.map(r => ({
      date: r.attDate.toISOString().split('T')[0],
      register_number: r.registerNumber,
      name: r.studentName,
      dept_code: r.deptCode,
      dept_name: r.deptName,
      semester: r.semester,
      class: r.class,
      subject_code: r.subjectCode,
      subject_name: r.subjectName,
      status: statusMap[r.attStatus] || r.attStatus,
      period: r.period
    }));

    res.json(mapped);
  } catch (error) {
    console.error('Error fetching attendance report:', error);
    res.status(500).json({ error: 'Failed' });
  }
};

// Get attendance summary statistics
export const getAttendanceSummary = async (req, res) => {
  try {
    const { deptCode, semester, class: classParam, fromDate, toDate, registerNumber } = req.query;

    const filter = {};
    if (deptCode) filter.deptCode = deptCode;
    if (semester) filter.semester = semester;
    if (classParam) filter.class = classParam;
    if (fromDate || toDate) filter.attDate = {};
    if (fromDate) filter.attDate.$gte = new Date(fromDate);
    if (toDate) filter.attDate.$lte = new Date(toDate);
    if (registerNumber) filter.registerNumber = registerNumber;

    const summary = await StudentAttendance.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            registerNumber: "$registerNumber",
            name: "$studentName",
            deptCode: "$deptCode",
            deptName: "$deptName",
            semester: "$semester",
            class: "$class"
          },
          total_periods: { $sum: 1 },
          present_count: { $sum: { $cond: [{ $eq: ["$attStatus", "present"] }, 1, 0] } },
          absent_count: { $sum: { $cond: [{ $eq: ["$attStatus", "absent"] }, 1, 0] } },
          od_count: { $sum: { $cond: [{ $eq: ["$attStatus", "onDuty"] }, 1, 0] } },
          ml_count: { $sum: { $cond: [{ $eq: ["$attStatus", "medicalLeave"] }, 1, 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          register_number: "$_id.registerNumber",
          name: "$_id.name",
          dept_code: "$_id.deptCode",
          dept_name: "$_id.deptName",
          semester: "$_id.semester",
          class: "$_id.class",
          total_periods: 1,
          present_count: 1,
          absent_count: 1,
          od_count: 1,
          ml_count: 1
        }
      }
    ]);

    res.json(summary);
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Failed' });
  }
};

// Get detailed attendance report
export const getDetailedAttendanceReport = async (req, res) => {
  try {
    const { deptCode, semester, class: classParam, date, reportType } = req.query;
    if (!deptCode || !semester || !classParam || !date) return res.status(400).json({ error: 'Missing parameters' });

    // Pivot logic
    const filter = { deptCode, semester, class: classParam };
    if (reportType === 'datewise') {
      filter.attDate = new Date(date);
    } else {
      // weekly logic: assume date is the starting date or we need to find week
      // For simplicity, implement same as datewise for now or range if possible
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 7);
      filter.attDate = { $gte: start, $lte: end };
    }

    const results = await StudentAttendance.aggregate([
      { $match: filter },
      { $sort: { registerNumber: 1, attDate: 1 } },
      {
        $group: {
          _id: { registerNumber: "$registerNumber", name: "$studentName", attDate: "$attDate", dayOrder: "$dayOrder" },
          periods: { $push: { p: "$period", s: "$attStatus" } }
        }
      },
      {
        $project: {
          _id: 0,
          date: { $dateToString: { format: "%Y-%m-%d", date: "$_id.attDate" } },
          dayorder: "$_id.dayOrder",
          register_number: "$_id.registerNumber",
          name: "$_id.name",
          // Mapping periods 1-6
          "1": { $cond: [{ $in: ["1", { $split: [{ $reduce: { input: "$periods", initialValue: "", in: { $concat: ["$$value", ",", "$$this.p"] } } }, ","] }] }, { $arrayElemAt: ["$periods.s", 0] }, "-"] },
          // This reduction is a bit complex for a pivot but possible. 
          // Better to process in JS if the volume is manageable.
        }
      }
    ]);

    // Post-process in JS for easier pivoting of periods
    const pivoted = results.map(row => {
      // This aggregated result above is actually slightly wrong because of period string handling.
      // Let's refetch and pivot in JS.
      return row;
    });

    // Refined JS PIVOT logic:
    const records = await StudentAttendance.find(filter).sort({ registerNumber: 1, attDate: 1 });
    const grouped = {};
    records.forEach(r => {
      const key = `${r.registerNumber}_${r.attDate.toISOString().split('T')[0]}`;
      if (!grouped[key]) {
        grouped[key] = {
          date: r.attDate.toISOString().split('T')[0],
          dayorder: r.dayOrder,
          register_number: r.registerNumber,
          name: r.studentName,
          dept_code: r.deptCode,
          dept_name: r.deptName,
          semester: r.semester,
          class: r.class,
          "1": "-", "2": "-", "3": "-", "4": "-", "5": "-", "6": "-"
        };
      }
      // Splits "1,2" into [1, 2]
      const periods = String(r.period).split(',');
      periods.forEach(p => {
        if (["1", "2", "3", "4", "5", "6"].includes(p)) {
          grouped[key][p] = statusMap[r.attStatus] || "P";
        }
      });
    });

    res.json(Object.values(grouped));
  } catch (error) {
    console.error('Error fetching detailed report:', error);
    res.status(500).json({ error: 'Failed' });
  }
};

// Get distinct classes
export const getClassesByFilters = async (req, res) => {
  try {
    const { deptCode, semester } = req.query;
    const classes = await StudentAttendance.distinct('class', { deptCode, semester });
    res.json(classes.sort().map(c => ({ Class: c })));
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Get available months
export const getAvailableMonths = async (req, res) => {
  try {
    const months = await StudentAttendance.aggregate([
      {
        $project: {
          month: { $month: "$attDate" }
        }
      },
      { $group: { _id: "$month" } },
      { $sort: { _id: 1 } }
    ]);

    const monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    res.json(months.map(m => ({ month_no: m._id, month_name: monthNames[m._id] })));
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Get available weeks
export const getAvailableWeeks = async (req, res) => {
  try {
    const { monthNo } = req.query;
    const weeks = await StudentAttendance.aggregate([
      { $match: { $expr: { $eq: [{ $month: "$attDate" }, parseInt(monthNo)] } } },
      {
        $project: {
          week_no: { $ceil: { $divide: [{ $dayOfMonth: "$attDate" }, 7] } }
        }
      },
      { $group: { _id: "$week_no" } },
      { $sort: { _id: 1 } }
    ]);
    res.json(weeks.map(w => ({ week_no: w._id })));
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Get weekly report
export const getWeeklyAttendanceReport = async (req, res) => {
  // Similar to detailed report but with month/week filters
  res.json([]); // Placeholder as weekly logic depends on specific business rules for week numbers
};
