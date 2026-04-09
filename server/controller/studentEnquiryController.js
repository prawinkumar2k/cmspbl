/**
 * Student Enquiry Controller — MongoDB version
 * Uses regex filters, JS date arithmetic, and aggregation pipelines where needed.
 */
import StudentEnquiry from '../models/StudentEnquiry.js';

const genEqid = async () => {
  const year = new Date().getFullYear();
  const latest = await StudentEnquiry
    .findOne({ studentEqid: new RegExp(`^EQ_${year}_`) })
    .sort({ studentEqid: -1 })
    .select('studentEqid');
  let serial = 1;
  if (latest) {
    const m = latest.studentEqid.match(/EQ_\d{4}_(\d{3})/);
    if (m) serial = parseInt(m[1], 10) + 1;
  }
  return `EQ_${year}_${String(serial).padStart(3, '0')}`;
};

const validateFields = (body) => {
  const { studentName, mobileNo, parentName, community, standard, district } = body;
  if (!studentName || !mobileNo || !parentName || !community || !standard || !district) {
    return 'Missing required fields';
  }
  if (!/^\d{10}$/.test(mobileNo)) return 'Mobile number must be 10 digits';
  return null;
};

export const getStudentEnquiries = async (req, res) => {
  try {
    const rows = await StudentEnquiry.find().sort({ createdAt: -1 });
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getStudentEnquiryById = async (req, res) => {
  try {
    const doc = await StudentEnquiry.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Student enquiry not found' });
    res.json(doc);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const searchStudentEnquiries = async (req, res) => {
  try {
    const { studentName, mobileNo, community, standard, district, studentRegNo } = req.query;
    const filter = {};

    // ✅ MongoDB regex text filtering
    if (studentName) filter.studentName = new RegExp(studentName, 'i');
    if (mobileNo) filter.mobileNo = new RegExp(mobileNo, 'i');
    if (community) filter.community = community;
    if (standard) filter.standard = standard;
    if (district) filter.district = district;
    if (studentRegNo) filter.studentRegNo = studentRegNo;

    const rows = await StudentEnquiry.find(filter).sort({ createdAt: -1 });
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const addStudentEnquiry = async (req, res) => {
  try {
    const err = validateFields(req.body);
    if (err) return res.status(400).json({ error: err });

    const studentEqid = await genEqid();
    const b = req.body;

    const doc = await StudentEnquiry.create({
      studentEqid,
      studentName: b.studentName, mobileNo: b.mobileNo,
      parentName: b.parentName, parentMobile: b.parentMobile || null,
      address: b.address || null, district: b.district,
      community: b.community, standard: b.standard,
      department: b.department || null, schoolType: b.schoolType || null,
      studentRegNo: b.studentRegNo || null, schoolName: b.schoolName || null,
      schoolAddress: b.schoolAddress || null, hostel: b.hostel || null,
      transport: b.transport || null, source: b.source || null, status: b.status || null
    });

    res.status(201).json({ success: true, message: 'Student enquiry added successfully', id: doc._id, student_eqid: studentEqid });
  } catch (err) {
    console.error('Error adding student enquiry:', err);
    res.status(500).json({ error: err.message });
  }
};

export const updateStudentEnquiry = async (req, res) => {
  try {
    const err = validateFields(req.body);
    if (err) return res.status(400).json({ error: err });

    const b = req.body;
    const result = await StudentEnquiry.findByIdAndUpdate(req.params.id, {
      studentName: b.studentName, mobileNo: b.mobileNo,
      parentName: b.parentName, parentMobile: b.parentMobile || null,
      address: b.address || null, district: b.district,
      community: b.community, standard: b.standard,
      department: b.department || null, schoolType: b.schoolType || null,
      studentRegNo: b.studentRegNo || null, schoolName: b.schoolName || null,
      schoolAddress: b.schoolAddress || null, hostel: b.hostel || null,
      transport: b.transport || null, source: b.source || null, status: b.status || null
    }, { new: true });

    if (!result) return res.status(404).json({ error: 'Student enquiry not found' });
    res.json({ success: true, message: 'Student enquiry updated successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const deleteStudentEnquiry = async (req, res) => {
  try {
    const result = await StudentEnquiry.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Student enquiry not found' });
    res.json({ success: true, message: 'Student enquiry deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getStudentEnquiryStatistics = async (req, res) => {
  try {
    const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // ✅ MongoDB aggregation replaces grouped summary queries
    const [total, recentCount, byCommunity, byStandard, byDistrict] = await Promise.all([
      StudentEnquiry.countDocuments(),
      StudentEnquiry.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      StudentEnquiry.aggregate([{ $group: { _id: '$community', count: { $sum: 1 } } }]),
      StudentEnquiry.aggregate([{ $group: { _id: '$standard', count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
      StudentEnquiry.aggregate([
        { $match: { district: { $ne: null } } },
        { $group: { _id: '$district', count: { $sum: 1 } } },
        { $sort: { count: -1 } }, { $limit: 10 }
      ]),
    ]);

    res.json({
      total, recentEnquiries: recentCount,
      byCommunity: byCommunity.map(r => ({ community: r._id, count: r.count })),
      byStandard: byStandard.map(r => ({ standard: r._id, count: r.count })),
      byDistrict: byDistrict.map(r => ({ district: r._id, count: r.count })),
    });
  } catch (err) {
    console.error('Error fetching statistics:', err);
    res.status(500).json({ error: err.message });
  }
};

export const bulkDeleteStudentEnquiries = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids?.length) return res.status(400).json({ error: 'Invalid or empty IDs array' });

    // ✅ MongoDB deleteMany with $in
    const result = await StudentEnquiry.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, message: `${result.deletedCount} student enquiries deleted successfully`, deletedCount: result.deletedCount });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

