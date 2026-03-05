/**
 * Dashboard Controller — MongoDB version
 * All MySQL VIEWs (overall_att_date_wise, dept_attendance_date_wise)
 * are replaced with real-time aggregation pipelines on StudentAttendance.
 */
import Student from '../models/Student.js';
import Staff from '../models/Staff.js';
import Course from '../models/Course.js';
import StudentAttendance from '../models/StudentAttendance.js';

// Helper: get start and end of a date
const dayRange = (dateStr) => {
  const start = new Date(dateStr);
  start.setHours(0, 0, 0, 0);
  const end = new Date(dateStr);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

// Helper: get today's date in IST (UTC+5:30)
const getISTDate = () => {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  return new Date(now.getTime() + istOffset).toISOString().slice(0, 10);
};

export const getDashboardStats = async (req, res) => {
  try {
    const today = getISTDate();
    const { start, end } = dayRange(today);

    // ── Run all queries in parallel for speed ───────────────────────────────

    const [
      totalStudents,
      totalStaff,
      totalDepts,
      attendanceStats,
      deptDistribution,
    ] = await Promise.all([

      // 1. Total admitted students
      // ✅ replaces: SELECT COUNT(DISTINCT id) FROM student_master WHERE Admission_Status='Admitted'
      Student.countDocuments({ admissionStatus: 'Admitted' }),

      // 2. Total active staff
      // ✅ replaces: SELECT COUNT(*) FROM staff_master WHERE Reliving_Date IS NULL OR Reliving_Date=''
      Staff.countDocuments({ $or: [{ relievingDate: null }, { relievingDate: '' }] }),

      // 3. Total departments
      // ✅ replaces: SELECT COUNT(*) FROM course_details
      Course.countDocuments(),

      // 4. Today's attendance breakdown
      // ✅ replaces: Multiple attendance COUNT queries + overall_att_date_wise VIEW
      StudentAttendance.aggregate([
        { $match: { attDate: { $gte: start, $lte: end } } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            present: { $sum: { $cond: [{ $eq: ['$attStatus', 'present'] }, 1, 0] } },
            absent: { $sum: { $cond: [{ $eq: ['$attStatus', 'absent'] }, 1, 0] } },
            onDuty: { $sum: { $cond: [{ $eq: ['$attStatus', 'onDuty'] }, 1, 0] } },
            medicalLeave: { $sum: { $cond: [{ $eq: ['$attStatus', 'medicalLeave'] }, 1, 0] } },
          }
        },
        {
          $project: {
            _id: 0,
            total: 1, present: 1, absent: 1, onDuty: 1, medicalLeave: 1,
            presentPercent: {
              $cond: [
                { $gt: ['$total', 0] },
                { $round: [{ $multiply: [{ $divide: ['$present', '$total'] }, 100] }, 2] },
                0
              ]
            }
          }
        }
      ]),

      // 5. Department-wise student distribution
      // ✅ replaces: SELECT Dept_Name, COUNT(*) FROM student_master GROUP BY Dept_Name
      Student.aggregate([
        { $match: { admissionStatus: 'Admitted' } },
        { $group: { _id: '$deptName', count: { $sum: 1 } } },
        { $project: { Dept_Name: '$_id', count: 1, _id: 0 } },
        { $sort: { count: -1 } }
      ]),
    ]);

    // Unpack attendance stats
    const att = attendanceStats[0] || { total: 0, present: 0, absent: 0, onDuty: 0, medicalLeave: 0, presentPercent: 0 };

    res.json({
      success: true,
      data: {
        // Counts
        totalStudents,
        totalStaff,
        totalDepartments: totalDepts,

        // Today's attendance
        presentToday: att.present,
        absentToday: att.absent,
        onDutyToday: att.onDuty,
        medicalLeaveToday: att.medicalLeave,
        totalMarkedToday: att.total,
        presentPercentage: att.presentPercent,

        // Department-wise distribution
        departmentDistribution: deptDistribution,

        // Date info
        date: today,
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics', details: error.message });
  }
};

// ── Attendance Trend (last N days) ────────────────────────────────────────────

export const getAttendanceTrend = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const endDate = new Date(); endDate.setHours(23, 59, 59, 999);
    const startDate = new Date(); startDate.setDate(startDate.getDate() - days); startDate.setHours(0, 0, 0, 0);

    // ✅ replaces: MySQL query on overall_att_date_wise with DATE_FORMAT
    const trend = await StudentAttendance.aggregate([
      { $match: { attDate: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$attDate', timezone: '+05:30' } },
          total: { $sum: 1 },
          present: { $sum: { $cond: [{ $eq: ['$attStatus', 'present'] }, 1, 0] } },
          absent: { $sum: { $cond: [{ $eq: ['$attStatus', 'absent'] }, 1, 0] } },
        }
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          total: 1, present: 1, absent: 1,
          percentage: {
            $cond: [
              { $gt: ['$total', 0] },
              { $round: [{ $multiply: [{ $divide: ['$present', '$total'] }, 100] }, 2] },
              0
            ]
          }
        }
      },
      { $sort: { date: 1 } }
    ]);

    res.json({ success: true, data: trend });
  } catch (error) {
    console.error('Attendance trend error:', error);
    res.status(500).json({ error: 'Failed to fetch attendance trend' });
  }
};

// ── Department Attendance Summary ─────────────────────────────────────────────

export const getDeptAttendance = async (req, res) => {
  try {
    const today = getISTDate();
    const { start, end } = dayRange(req.query.date || today);

    // ✅ replaces: dept_attendance_date_wise MySQL VIEW
    const deptAtt = await StudentAttendance.aggregate([
      { $match: { attDate: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: '$deptCode',
          deptName: { $first: '$deptName' },
          total: { $sum: 1 },
          present: { $sum: { $cond: [{ $eq: ['$attStatus', 'present'] }, 1, 0] } },
          absent: { $sum: { $cond: [{ $eq: ['$attStatus', 'absent'] }, 1, 0] } },
        }
      },
      {
        $project: {
          _id: 0,
          deptCode: '$_id',
          deptName: 1, total: 1, present: 1, absent: 1,
          percentage: {
            $cond: [
              { $gt: ['$total', 0] },
              { $round: [{ $multiply: [{ $divide: ['$present', '$total'] }, 100] }, 2] },
              0
            ]
          }
        }
      },
      { $sort: { deptName: 1 } }
    ]);

    res.json({ success: true, data: deptAtt });
  } catch (error) {
    console.error('Dept attendance error:', error);
    res.status(500).json({ error: 'Failed to fetch department attendance' });
  }
};

// ── Aliases to match routes/dashboard.js ─────────────────────────────────────

export const getDashboardStatsByDate = getDashboardStats;
export const getAttendanceTrends = getAttendanceTrend;
export const getDeptAttendanceByDate = getDeptAttendance;

export const getDepartmentWiseStudents = async (req, res) => {
  try {
    const stats = await Student.aggregate([
      { $match: { admissionStatus: 'Admitted' } },
      { $group: { _id: '$deptName', count: { $sum: 1 } } },
      { $project: { Dept_Name: '$_id', count: 1, _id: 0 } }
    ]);
    res.json({ success: true, data: stats });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getAcademicYears = async (req, res) => {
  try {
    const years = await Student.distinct('academicYear');
    res.json({ success: true, data: years.filter(y => y).map(y => ({ academicYear: y })) });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getTodayAttendance = async (req, res) => {
  return getDashboardStats(req, res);
};

export const getAttendanceDetailsByDate = async (req, res) => {
  res.json({ success: true, present: [], absent: [] });
};

export const getAttendanceDetailsByType = async (req, res) => {
  res.json({ success: true, onDuty: [], medicalLeave: [] });
};

export const getLibraryStats = async (req, res) => {
  res.json({ success: true, totalBooks: 0, issuedToday: 0 });
};

export const getFeeMetrics = async (req, res) => {
  res.json({ success: true, collectedToday: 0, pendingTotal: 0 });
};

export const getExamAnalytics = async (req, res) => {
  res.json({ success: true, overallPassPercent: 0 });
};

export const getHealthStats = async (req, res) => {
  res.json({ success: true, visitsToday: 0 });
};

export const getQuickStats = async (req, res) => {
  return getDashboardStats(req, res);
};
