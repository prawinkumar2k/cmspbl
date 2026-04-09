/**
 * Assign Call Controller — MongoDB version
 * Uses fixed Mongoose schemas for callers, assigned calls, and student enquiries.
 * tenant_data → Caller model
 * tenant_details → AssignedCall model
 * student_enquiry → StudentEnquiry model
 */
import { Caller, AssignedCall } from '../models/Caller.js';
import StudentEnquiry from '../models/StudentEnquiry.js';

export const getStudents = async (req, res) => {
  try {
    const { tenant_id } = req.query || {};
    const filter = {};
    // Exclude already assigned students by studentEqid
    const assigned = await AssignedCall.distinct('studentEqid', tenant_id ? { tenantId: tenant_id } : {});
    if (assigned.length) filter.studentEqid = { $nin: assigned };

    const rows = await StudentEnquiry.find(filter).sort({ studentEqid: 1 });
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getCallers = async (req, res) => {
  try {
    const callers = await Caller.find({ staffName: { $ne: null } }).sort({ staffName: 1 });
    res.json({ success: true, data: callers.map(c => ({ Id: c.staffId, staff_name: c.staffName, staff_id: c.staffId, role: c.role, Mobile: c.mobile, Dept_Name: c.deptName })) });
  } catch (err) {
    console.error('Error fetching callers:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getRoles = async (req, res) => {
  try {
    const roles = await Caller.distinct('role', { role: { $ne: null } });
    res.json({ success: true, data: roles.sort().map(r => ({ role: r })) });
  } catch (err) {
    console.error('Error fetching roles:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getStaffByRole = async (req, res) => {
  try {
    const { role } = req.query;
    if (!role) return res.status(400).json({ success: false, error: 'Role is required' });
    const staff = await Caller.find({ role, staffName: { $ne: null } }).sort({ staffName: 1 });
    res.json({ success: true, data: staff.map(c => ({ Id: c.staffId, staff_name: c.staffName, staff_id: c.staffId, role: c.role, Mobile: c.mobile, Dept_Name: c.deptName })) });
  } catch (err) {
    console.error('Error fetching staff by role:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const assignCall = async (req, res) => {
  try {
    const { studentEnquiryIds, callerId, tenant_id } = req.body;
    if (!studentEnquiryIds?.length) return res.status(400).json({ success: false, error: 'Please select at least one student' });

    let staffRow = null;
    if (callerId) {
      staffRow = await Caller.findOne({ staffId: callerId });
    }
    if (!staffRow && tenant_id) {
      staffRow = await Caller.findOne({ role: tenant_id, staffName: { $ne: null } });
    }

    const students = await StudentEnquiry.find({ _id: { $in: studentEnquiryIds } });

    let insertedCount = 0;
    for (const s of students) {
      try {
        await AssignedCall.create({
          tenantId: tenant_id || null,
          role: staffRow?.role || tenant_id || null,
          staffId: callerId || null,
          staffName: staffRow?.staffName || null,
          staffMobile: staffRow?.mobile || null,
          staffDept: staffRow?.deptName || null,
          studentRegNo: s.studentRegNo || null,
          studentEqid: s.studentEqid || null,
          studentName: s.studentName || null,
          studentMobile: s.mobileNo || null,
          parentName: s.parentName || null,
          parentMobile: s.parentMobile || null,
          address: s.address || null,
          community: s.community || null,
          department: s.department || null,
          district: s.district || null,
          standard: s.standard || null,
          schoolName: s.schoolName || null,
          schoolType: s.schoolType || null,
          schoolAddress: s.schoolAddress || null,
          source: s.source || null,
          transport: s.transport || null,
          hostel: s.hostel || null,
          status: s.status || null,
        });
        insertedCount++;
      } catch (innerErr) {
        if (innerErr.code !== 11000) throw innerErr; // ignore duplicate key
      }
    }

    res.json({ success: true, message: `${insertedCount} call(s) assigned successfully`, insertedCount });
  } catch (err) {
    console.error('Error assigning call:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteAssignedCall = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, error: 'Call ID is required' });
    const result = await AssignedCall.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ success: false, error: 'Assigned call not found' });
    res.json({ success: true, message: 'Call assignment deleted successfully' });
  } catch (err) {
    console.error('Error deleting assigned call:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateAssignedCall = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, error: 'Call ID is required' });
    const result = await AssignedCall.findByIdAndUpdate(id, { remarks: req.body.remarks || null }, { new: true });
    if (!result) return res.status(404).json({ success: false, error: 'Assigned call not found' });
    res.json({ success: true, message: 'Call assignment updated successfully' });
  } catch (err) {
    console.error('Error updating assigned call:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getAssignedCalls = async (req, res) => {
  try {
    const { tenant_id } = req.query;
    const filter = tenant_id ? { tenantId: tenant_id } : {};
    const rows = await AssignedCall.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Error fetching assigned calls:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

