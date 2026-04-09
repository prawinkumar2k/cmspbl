/**
 * Example: Activity logging pattern for MongoDB controllers.
 * This file is intentionally non-runtime documentation-by-example.
 */

import Student from '../models/Student.js';
import { logActivity } from '../utils/activityLogger.js';

export const createStudentExample = async (req, res) => {
  try {
    const created = await Student.create(req.body);

    await logActivity(
      req.user.username,
      req.user.role_name,
      `Created student: ${created.studentName || created.registerNumber || created._id}`
    );

    res.json({ success: true, data: created });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create student' });
  }
};

export default {
  createStudentExample,
};
