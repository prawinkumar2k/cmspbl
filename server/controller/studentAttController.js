/**
 * Student Attendance Controller (Student Portal View) — MongoDB version
 * Replaces student_attendance_view (MySQL VIEW) + student_attendance_entry JOIN
 * with real-time MongoDB aggregation pipelines on StudentAttendance collection
 */
import StudentAttendance from '../models/StudentAttendance.js';
import Subject from '../models/Subject.js';

export const getStudentAttendance = async (req, res) => {
    try {
        const registerNumber = req.user.staff_id;
        if (!registerNumber) {
            return res.status(400).json({ error: 'Student registration number not found in token' });
        }

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth(); // 0-indexed

        // ── 1. Fetch all attendance records for this student ─────────────────────
        // ✅ Replaces: SELECT * FROM student_attendance_view WHERE register_number = ?
        const rows = await StudentAttendance.find({ registerNumber }).sort({ attDate: -1 });

        // ── 2. Stats calculation (same JS logic — data now comes from MongoDB) ───
        const calculateStats = (records) => {
            let total = 0, present = 0, absent = 0;
            records.forEach(r => {
                total++;
                if (['present', 'Pr', 'OD', 'onDuty'].includes(r.attStatus)) present++;
                else if (['absent', 'Ab', 'ML', 'medicalLeave'].includes(r.attStatus)) absent++;
            });
            const averagePercentage = total > 0 ? parseFloat(((present / total) * 100).toFixed(1)) : 0;
            return { totalPeriodAttendanceTakenCount: total, totalPresent: present, totalAbsent: absent, averagePercentage };
        };

        const overallStats = calculateStats(rows);

        // Previous month
        const lastMonthDate = new Date(currentYear, currentMonth, 1);
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        const lastMonth = lastMonthDate.getMonth();
        const lastYear = lastMonthDate.getFullYear();

        const currentMonthRecords = rows.filter(r => {
            const d = new Date(r.attDate);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });
        const lastMonthRecords = rows.filter(r => {
            const d = new Date(r.attDate);
            return d.getMonth() === lastMonth && d.getFullYear() === lastYear;
        });

        const currentMonthStats = calculateStats(currentMonthRecords);
        const lastMonthStats = calculateStats(lastMonthRecords);

        const trendValue = (cur, last) => last === 0 ? (cur > 0 ? 100 : 0) : parseFloat((((cur - last) / last) * 100).toFixed(1));
        const trends = {
            totalPeriodAttendanceTakenCount: trendValue(currentMonthStats.totalPeriodAttendanceTakenCount, lastMonthStats.totalPeriodAttendanceTakenCount),
            totalPresent: trendValue(currentMonthStats.totalPresent, lastMonthStats.totalPresent),
            totalAbsent: trendValue(currentMonthStats.totalAbsent, lastMonthStats.totalAbsent),
            averagePercentage: trendValue(currentMonthStats.averagePercentage, lastMonthStats.averagePercentage),
        };

        // ── 3. 5-Month Trend ─────────────────────────────────────────────────────
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyTrend = [];
        for (let i = 4; i >= 0; i--) {
            const td = new Date(currentYear, currentMonth, 1);
            td.setMonth(td.getMonth() - i);
            const mRec = rows.filter(r => {
                const d = new Date(r.attDate);
                return d.getMonth() === td.getMonth() && d.getFullYear() === td.getFullYear();
            });
            monthlyTrend.push({ month: monthNames[td.getMonth()], percentage: calculateStats(mRec).averagePercentage });
        }

        // ── 4. Subject-wise stats (Current Month) ────────────────────────────────
        // ✅ Replaces: SELECT sae.Subject_Code, sm.Sub_Name, COUNT, SUM(CASE...)
        //             FROM student_attendance_entry sae LEFT JOIN subject_master sm ...
        const monthStart = new Date(currentYear, currentMonth, 1);
        const monthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

        const subjectAgg = await StudentAttendance.aggregate([
            { $match: { registerNumber, attDate: { $gte: monthStart, $lte: monthEnd } } },
            {
                $group: {
                    _id: '$subjectCode',
                    total: { $sum: 1 },
                    present: { $sum: { $cond: [{ $in: ['$attStatus', ['present', 'Pr', 'OD', 'onDuty']] }, 1, 0] } }
                }
            }
        ]);

        // Enrich with subject names
        const subCodes = subjectAgg.map(s => s._id).filter(Boolean);
        const subjectMap = {};
        if (subCodes.length) {
            const subjects = await Subject.find({ subCode: { $in: subCodes } }).select('subCode subName');
            subjects.forEach(s => { subjectMap[s.subCode] = s.subName; });
        }

        const subjectWiseStats = subjectAgg.map(s => ({
            name: subjectMap[s._id] || s._id,
            value: s.total > 0 ? parseFloat(((s.present / s.total) * 100).toFixed(1)) : 0,
            present: s.present,
            total: s.total
        }));

        res.json({
            success: true,
            stats: overallStats, trends, monthlyTrend, subjectWiseStats,
            attendanceRecords: rows
        });

    } catch (error) {
        console.error('Error fetching student attendance:', error);
        res.status(500).json({ error: 'Failed to fetch attendance records' });
    }
};
