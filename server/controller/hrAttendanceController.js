/**
 * HR Attendance Controller — MongoDB version
 * ON DUPLICATE KEY UPDATE → bulkWrite with upsert
 * GROUP BY COUNT(CASE WHEN...) → aggregation pipeline
 */
import HrAttendance from '../models/HrAttendance.js';
import Staff from '../models/Staff.js';

export const getStaffAttendance = async (req, res) => {
    try {
        const { date, staffId, department } = req.query;
        const filter = {};
        if (staffId) filter.staffId = staffId;
        if (date) {
            const d = new Date(date); d.setHours(0, 0, 0, 0);
            const end = new Date(date); end.setHours(23, 59, 59, 999);
            filter.attDate = { $gte: d, $lte: end };
        }

        let records = await HrAttendance.find(filter).sort({ attDate: -1, staffName: 1 });

        // department filter: filter in JS since it's on Staff, not HrAttendance
        if (department) {
            const staffInDept = await Staff.find({ deptName: department }).distinct('staffId');
            records = records.filter(r => staffInDept.includes(r.staffId));
        }

        // Enrich with staff info
        const staffIds = [...new Set(records.map(r => r.staffId))];
        const staffList = await Staff.find({ staffId: { $in: staffIds } }).select('staffId staffName deptName designation');
        const staffMap = {};
        staffList.forEach(s => { staffMap[s.staffId] = s; });

        const enriched = records.map(r => ({
            ...r.toObject(),
            Staff_Name: staffMap[r.staffId]?.staffName || r.staffName,
            Dept_Name: staffMap[r.staffId]?.deptName || '',
            Designation: staffMap[r.staffId]?.designation || '',
        }));

        res.json(enriched);
    } catch (error) {
        console.error('Error fetching staff attendance:', error);
        res.status(500).json({ error: 'Failed to fetch staff attendance' });
    }
};

export const markStaffAttendance = async (req, res) => {
    try {
        const attendanceRecords = req.body;
        if (!Array.isArray(attendanceRecords)) return res.status(400).json({ error: 'Invalid data format' });

        // ✅ bulkWrite with upsert = MongoDB equivalent of ON DUPLICATE KEY UPDATE
        const bulkOps = attendanceRecords.map(r => {
            const attDate = new Date(r.attendance_date);
            attDate.setHours(0, 0, 0, 0);
            return {
                updateOne: {
                    filter: { staffId: r.staff_id, attDate },
                    update: {
                        $set: {
                            staffId: r.staff_id,
                            attDate,
                            status: r.status,
                            inTime: r.check_in_time || null,
                            outTime: r.check_out_time || null,
                            workHours: r.working_hours || null,
                        }
                    },
                    upsert: true
                }
            };
        });

        await HrAttendance.bulkWrite(bulkOps);
        res.status(201).json({ message: 'Attendance marked successfully' });
    } catch (error) {
        console.error('Error marking attendance:', error);
        res.status(500).json({ error: 'Failed to mark attendance' });
    }
};

export const updateStaffAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        await HrAttendance.findByIdAndUpdate(id, req.body);
        res.json({ message: 'Attendance updated successfully' });
    } catch (error) {
        console.error('Error updating attendance:', error);
        res.status(500).json({ error: 'Failed to update attendance' });
    }
};

export const getAttendanceReport = async (req, res) => {
    try {
        const { fromDate, toDate, staffId, department } = req.query;

        const matchFilter = {};
        if (fromDate && toDate) {
            const start = new Date(fromDate); start.setHours(0, 0, 0, 0);
            const end = new Date(toDate); end.setHours(23, 59, 59, 999);
            matchFilter.attDate = { $gte: start, $lte: end };
        }
        if (staffId) matchFilter.staffId = staffId;

        // ✅ MongoDB aggregation replaces:
        //    SELECT sm.*, COUNT(CASE WHEN status='present'...) FROM staff_master LEFT JOIN hr_staff_attendance GROUP BY
        const agg = await HrAttendance.aggregate([
            { $match: matchFilter },
            {
                $group: {
                    _id: '$staffId',
                    present_days: { $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] } },
                    absent_days: { $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] } },
                    half_days: { $sum: { $cond: [{ $eq: ['$status', 'Half-Day'] }, 1, 0] } },
                    leave_days: { $sum: { $cond: [{ $eq: ['$status', 'Leave'] }, 1, 0] } },
                    total_hours: { $sum: { $ifNull: ['$workHours', 0] } },
                }
            }
        ]);

        // Enrich with staff info
        const staffIds = agg.map(a => a._id);
        let staffFilter = { staffId: { $in: staffIds } };
        if (department) staffFilter.deptName = department;
        const staffList = await Staff.find(staffFilter).select('staffId staffName deptName designation');
        const staffMap = {};
        staffList.forEach(s => { staffMap[s.staffId] = s; });

        const result = agg
            .filter(a => staffMap[a._id])   // remove if dept filter excluded this staff
            .map(a => ({
                Staff_ID: a._id,
                Staff_Name: staffMap[a._id]?.staffName || '',
                Dept_Name: staffMap[a._id]?.deptName || '',
                Designation: staffMap[a._id]?.designation || '',
                present_days: a.present_days,
                absent_days: a.absent_days,
                half_days: a.half_days,
                leave_days: a.leave_days,
                total_hours: parseFloat(a.total_hours?.toFixed(2) || 0),
            }))
            .sort((a, b) => a.Staff_Name.localeCompare(b.Staff_Name));

        res.json(result);
    } catch (error) {
        console.error('Error fetching attendance report:', error);
        res.status(500).json({ error: 'Failed to fetch attendance report' });
    }
};

export const getAttendanceSummary = async (req, res) => {
    try {
        const rawDate = req.query.date || new Date().toISOString().split('T')[0];
        const day = new Date(rawDate); day.setHours(0, 0, 0, 0);
        const end = new Date(rawDate); end.setHours(23, 59, 59, 999);

        const [totalStaff, [summary]] = await Promise.all([
            Staff.countDocuments({ $or: [{ relievingDate: null }, { relievingDate: '' }] }),
            HrAttendance.aggregate([
                { $match: { attDate: { $gte: day, $lte: end } } },
                {
                    $group: {
                        _id: null,
                        present: { $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] } },
                        absent: { $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] } },
                        half_day: { $sum: { $cond: [{ $eq: ['$status', 'Half-Day'] }, 1, 0] } },
                        on_leave: { $sum: { $cond: [{ $eq: ['$status', 'Leave'] }, 1, 0] } },
                    }
                }
            ])
        ]);

        res.json({ total_staff: totalStaff, ...(summary || { present: 0, absent: 0, half_day: 0, on_leave: 0 }) });
    } catch (error) {
        console.error('Error fetching attendance summary:', error);
        res.status(500).json({ error: 'Failed to fetch attendance summary' });
    }
};
