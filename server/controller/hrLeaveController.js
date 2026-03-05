/**
 * HR Leave Controller — MongoDB version
 */
import Leave from '../models/Leave.js';
import Staff from '../models/Staff.js';

export const getLeaves = async (req, res) => {
    try {
        const filter = {};
        if (req.query.staffId) filter.staffId = req.query.staffId;
        if (req.query.status) filter.status = req.query.status;
        if (req.query.leaveType) filter.leaveType = req.query.leaveType;

        const leaves = await Leave.find(filter).sort({ fromDate: -1 });
        res.json(leaves);
    } catch (error) {
        console.error('Error fetching leaves:', error);
        res.status(500).json({ error: 'Failed to fetch leave records' });
    }
};

export const applyLeave = async (req, res) => {
    try {
        const { staffId, staffName, leaveType, fromDate, toDate, totalDays, reason } = req.body;

        const leave = await Leave.create({
            staffId, staffName, leaveType,
            fromDate: new Date(fromDate),
            toDate: new Date(toDate),
            totalDays: parseInt(totalDays) || 1,
            reason,
            status: 'Pending'
        });

        res.status(201).json({ message: 'Leave applied successfully', id: leave._id });
    } catch (error) {
        console.error('Error applying leave:', error);
        res.status(500).json({ error: 'Failed to apply leave' });
    }
};

export const updateLeaveStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, approvedBy, remarks } = req.body;

        await Leave.findByIdAndUpdate(id, { status, approvedBy, remarks });
        res.json({ message: 'Leave status updated successfully' });
    } catch (error) {
        console.error('Error updating leave status:', error);
        res.status(500).json({ error: 'Failed to update leave status' });
    }
};

export const deleteLeave = async (req, res) => {
    try {
        await Leave.findByIdAndDelete(req.params.id);
        res.json({ message: 'Leave deleted successfully' });
    } catch (error) {
        console.error('Error deleting leave:', error);
        res.status(500).json({ error: 'Failed to delete leave' });
    }
};

export const getLeaveStats = async (req, res) => {
    try {
        const { staffId, year } = req.query;
        const filter = {};
        if (staffId) filter.staffId = staffId;
        if (year) {
            filter.fromDate = {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`)
            };
        }

        // ✅ MongoDB aggregation replaces MySQL GROUP BY + COUNT + SUM
        const stats = await Leave.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$leaveType',
                    count: { $sum: 1 },
                    totalDays: { $sum: '$totalDays' },
                    approved: { $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, 1, 0] } },
                    pending: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } },
                    rejected: { $sum: { $cond: [{ $eq: ['$status', 'Rejected'] }, 1, 0] } }
                }
            }
        ]);

        res.json({ success: true, data: stats });
    } catch (error) {
        console.error('Error fetching leave stats:', error);
        res.status(500).json({ error: 'Failed to fetch leave statistics' });
    }
};

// ── Aliases to match routes/hrLeave.js ───────────────────────────────────────

export const getLeaveApplications = getLeaves;
export const createLeaveApplication = applyLeave;
export const updateLeaveApplication = async (req, res) => {
    try {
        const { id } = req.params;
        await Leave.findByIdAndUpdate(id, req.body);
        res.json({ message: 'Leave application updated successfully' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};
export const deleteLeaveApplication = deleteLeave;

export const approveLeave = async (req, res) => {
    req.body.status = 'Approved';
    return updateLeaveStatus(req, res);
};

export const rejectLeave = async (req, res) => {
    req.body.status = 'Rejected';
    return updateLeaveStatus(req, res);
};

export const getLeaveTypes = async (req, res) => {
    // Static list for now
    const types = ['Casual Leave (CL)', 'Sick Leave (SL)', 'Privilege Leave (PL)', 'On Duty (OD)', 'Maternity Leave', 'Other'];
    res.json(types.map(t => ({ Leave_Type: t })));
};
