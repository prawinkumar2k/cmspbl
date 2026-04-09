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
    // Map PascalCase / Snake_Case fields to camelCase model
    const doc = await Subject.create({
      subCode: body.Sub_Code || body.SUBCODE || body.subCode,
      subName: body.Sub_Name || body.SUB_NAME || body.subName,
      deptCode: body.Dept_Code || body.DEPT_CODE || body.deptCode,
      deptName: body.DEPT_NAME || body.deptName,
      semester: body.Semester || body.SEMESTER || body.semester,
      year: body.Year || body.YEAR || body.year,
      regulation: body.Regulation || body.REGULATION || body.regulation,
      subType: body.Sub_Type || body.SUB_TYPE || body.subType,
      credits: body.Credits || body.CREDITS || body.credits,
      maxMark: body.Max_Mark || body.MAX_MARK || body.maxMark,
      minMark: body.Pass_Mark || body.MIN_MARK || body.minMark,
      staffId: body.Staff_ID || body.STAFF_ID || body.staffId,
      staffName: body.Staff_Name || body.STAFF_NAME || body.staffName,
      // Additional fields from Subject.jsx
      colNo: body.Col_No || body.colNo,
      elective: body.Elective || body.elective,
      electiveNo: body.Elective_No || body.electiveNo,
      qpc: body.QPC || body.qpc,
      totalHours: body.Total_Hours || body.totalHours,
      internalMaxMark: body.Internal_Max_Mark || body.internalMaxMark,
      internalMinMark: body.Internal_Min_Mark || body.internalMinMark,
      externalMaxMark: body.External_Max_Mark || body.externalMaxMark,
      externalMinMark: body.External_Min_Mark || body.externalMinMark
    });
    res.json({ success: true, id: doc._id });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const editSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const update = {};
    
    // Helper to pick fields from both casings
    const setIfPresent = (modelField, sources) => {
      for (const source of sources) {
        if (body[source] !== undefined) {
          update[modelField] = body[source];
          return;
        }
      }
    };

    setIfPresent('subCode', ['Sub_Code', 'SUBCODE', 'subCode']);
    setIfPresent('subName', ['Sub_Name', 'SUB_NAME', 'subName']);
    setIfPresent('deptCode', ['Dept_Code', 'DEPT_CODE', 'deptCode']);
    setIfPresent('deptName', ['DEPT_NAME', 'deptName']);
    setIfPresent('semester', ['Semester', 'SEMESTER', 'semester']);
    setIfPresent('year', ['Year', 'YEAR', 'year']);
    setIfPresent('regulation', ['Regulation', 'REGULATION', 'regulation']);
    setIfPresent('subType', ['Sub_Type', 'SUB_TYPE', 'subType']);
    setIfPresent('credits', ['Credits', 'CREDITS', 'credits']);
    setIfPresent('maxMark', ['Max_Mark', 'MAX_MARK', 'maxMark']);
    setIfPresent('minMark', ['Pass_Mark', 'MIN_MARK', 'minMark']);
    setIfPresent('staffId', ['Staff_ID', 'STAFF_ID', 'staffId']);
    setIfPresent('staffName', ['Staff_Name', 'STAFF_NAME', 'staffName']);
    
    // Additional fields
    setIfPresent('colNo', ['Col_No', 'colNo']);
    setIfPresent('elective', ['Elective', 'elective']);
    setIfPresent('electiveNo', ['Elective_No', 'electiveNo']);
    setIfPresent('qpc', ['QPC', 'qpc']);
    setIfPresent('totalHours', ['Total_Hours', 'totalHours']);
    setIfPresent('internalMaxMark', ['Internal_Max_Mark', 'internalMaxMark']);
    setIfPresent('internalMinMark', ['Internal_Min_Mark', 'internalMinMark']);
    setIfPresent('externalMaxMark', ['External_Max_Mark', 'externalMaxMark']);
    setIfPresent('externalMinMark', ['External_Min_Mark', 'externalMinMark']);

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
