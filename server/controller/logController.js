/**
 * log Controller — MongoDB version
 * ActivityLog model replaces log_details table
 */
import ActivityLog from '../models/ActivityLog.js';

export const getAllLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      ActivityLog.find().sort({ timestamp: -1 }).skip(skip).limit(limit),
      ActivityLog.countDocuments()
    ]);

    res.json({ success: true, data: logs, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
};

export const getUserLogs = async (req, res) => {
  try {
    const { username } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      ActivityLog.find({ username }).sort({ timestamp: -1 }).skip(skip).limit(limit),
      ActivityLog.countDocuments({ username })
    ]);

    res.json({ success: true, data: logs, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error('Error fetching user logs:', error);
    res.status(500).json({ error: 'Failed to fetch user logs' });
  }
};

export const getLogsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) return res.status(400).json({ error: 'Start date and end date are required' });

    // ✅ MongoDB: $gte/$lte instead of MySQL BETWEEN
    const logs = await ActivityLog.find({
      timestamp: { $gte: new Date(startDate), $lte: new Date(endDate + 'T23:59:59.999Z') }
    }).sort({ timestamp: -1 });

    res.json({ success: true, data: logs, count: logs.length });
  } catch (error) {
    console.error('Error fetching logs by date range:', error);
    res.status(500).json({ error: 'Failed to fetch logs by date range' });
  }
};

export const getRecentLogins = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const logs = await ActivityLog.find({ action: 'Logged in' }).sort({ timestamp: -1 }).limit(limit);
    res.json({ success: true, data: logs });
  } catch (error) {
    console.error('Error fetching recent logins:', error);
    res.status(500).json({ error: 'Failed to fetch recent logins' });
  }
};

export const deleteOldLogs = async (req, res) => {
  try {
    const { daysOld } = req.query;
    if (!daysOld || isNaN(daysOld)) return res.status(400).json({ error: 'Please provide valid number of days' });

    // ✅ MongoDB: $lt new Date instead of MySQL DATE_SUB(NOW(), INTERVAL ? DAY)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(daysOld));

    const result = await ActivityLog.deleteMany({ timestamp: { $lt: cutoffDate } });

    res.json({ success: true, message: `Deleted ${result.deletedCount} old log entries`, deletedCount: result.deletedCount });
  } catch (error) {
    console.error('Error deleting old logs:', error);
    res.status(500).json({ error: 'Failed to delete old logs' });
  }
};

export default { getAllLogs, getUserLogs, getLogsByDateRange, getRecentLogins, deleteOldLogs };
