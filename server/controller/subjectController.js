import Subject from '../models/Subject.js';

export const getSubjects = async (req, res) => {
  try {
    const filter = {};
    if (req.query.deptCode) filter.deptCode = req.query.deptCode;
    if (req.query.semester) filter.semester = req.query.semester;
    const subjects = await Subject.find(filter).sort({ subCode: 1 });
    res.json(subjects);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const addSubject = async (req, res) => {
  try {
    const body = req.body;
    // Map MySQL PascalCase fields → camelCase model fields
    const doc = await Subject.create({
      subCode: body.SUBCODE || body.subCode,
      subName: body.SUB_NAME || body.subName,
      deptCode: body.DEPT_CODE || body.deptCode,
      deptName: body.DEPT_NAME || body.deptName,
      semester: body.SEMESTER || body.semester,
      year: body.YEAR || body.year,
      regulation: body.REGULATION || body.regulation,
      subType: body.SUB_TYPE || body.subType,
      credits: body.CREDITS || body.credits,
      maxMark: body.MAX_MARK || body.maxMark,
      minMark: body.MIN_MARK || body.minMark,
      staffId: body.STAFF_ID || body.staffId,
      staffName: body.STAFF_NAME || body.staffName,
    });
    res.json({ success: true, id: doc._id });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const editSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    // Accept both MySQL and camelCase field names
    const update = {};
    if (body.SUBCODE || body.subCode) update.subCode = body.SUBCODE || body.subCode;
    if (body.SUB_NAME || body.subName) update.subName = body.SUB_NAME || body.subName;
    if (body.DEPT_CODE || body.deptCode) update.deptCode = body.DEPT_CODE || body.deptCode;
    if (body.DEPT_NAME || body.deptName) update.deptName = body.DEPT_NAME || body.deptName;
    if (body.SEMESTER || body.semester) update.semester = body.SEMESTER || body.semester;
    if (body.YEAR || body.year) update.year = body.YEAR || body.year;
    if (body.REGULATION || body.regulation) update.regulation = body.REGULATION || body.regulation;
    if (body.SUB_TYPE || body.subType) update.subType = body.SUB_TYPE || body.subType;
    if (body.CREDITS || body.credits) update.credits = body.CREDITS || body.credits;
    if (body.MAX_MARK || body.maxMark) update.maxMark = body.MAX_MARK || body.maxMark;
    if (body.MIN_MARK || body.minMark) update.minMark = body.MIN_MARK || body.minMark;
    if (body.STAFF_ID || body.staffId) update.staffId = body.STAFF_ID || body.staffId;
    if (body.STAFF_NAME || body.staffName) update.staffName = body.STAFF_NAME || body.staffName;

    await Subject.findByIdAndUpdate(id, update);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const deleteSubject = async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const checkSubjectCode = async (req, res) => {
  try {
    const { subjectCode, excludeId } = req.query;
    if (!subjectCode) return res.status(400).json({ exists: false });
    const filter = { subCode: subjectCode };
    if (excludeId) filter._id = { $ne: excludeId };
    const existing = await Subject.findOne(filter).select('_id');
    res.json({ exists: !!existing });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
