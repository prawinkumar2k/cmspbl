import Student from "../models/Student.js";

// FIXED Department Code Mapping
const DEPT_CODE_MAP = {
  "D.PHARM": "1000",
  "B.PHARM": "2000",
  "M.PHARM": "3000",
  "Ph.D": "4000",
};

// ------------------------------------------------------
// GET ALL
// ------------------------------------------------------
export const getAllAdmittedStudents = async (req, res) => {
  try {
    const rows = await Student.find().sort({ _id: -1 });

    // Map to old field names for frontend compatibility
    const mapped = rows.map(r => ({
      Id: r._id,
      Mode_Of_Joining: r.modeOfJoining,
      Application_No: r.applicationNo,
      Student_Name: r.studentName,
      Admission_Status: r.admissionStatus,
      Dept_Name: r.deptName,
      Dept_Code: r.deptCode,
      Roll_Number: r.rollNumber,
      Register_No: r.registerNumber,
      Community: r.community,
      Allocated_Quota: r.allocatedQuota,
      Std_UID: r.stdUid
    }));

    res.json(mapped);
  } catch (err) {
    console.error("GET ALL ERROR:", err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

// ------------------------------------------------------
// GET ONE
// ------------------------------------------------------
export const getAdmittedStudentById = async (req, res) => {
  try {
    const r = await Student.findById(req.params.id);

    if (!r) return res.status(404).json({ error: "Student not found" });

    const mapped = {
      Id: r._id,
      Mode_Of_Joining: r.modeOfJoining,
      Application_No: r.applicationNo,
      Student_Name: r.studentName,
      Admission_Status: r.admissionStatus,
      Dept_Name: r.deptName,
      Dept_Code: r.deptCode,
      Roll_Number: r.rollNumber,
      Register_No: r.registerNumber,
      Community: r.community,
      Allocated_Quota: r.allocatedQuota,
      Std_UID: r.stdUid
    };

    res.json(mapped);
  } catch (err) {
    console.error("GET BY ID ERROR:", err);
    res.status(500).json({ error: "Failed to fetch student" });
  }
};

// ------------------------------------------------------
// CREATE STUDENT
// ------------------------------------------------------
export const createAdmittedStudent = async (req, res) => {
  try {
    const data = req.body;

    // --------------------------
    // AUTO-GENERATE ROLL NUMBER
    // --------------------------
    const dept = data.dept_code || "0000";
    const year = String(new Date().getFullYear()).slice(-2);
    const prefix = `${year}${dept}`;

    const lastStudent = await Student.findOne({ rollNumber: new RegExp(`^${prefix}`) }).sort({ rollNumber: -1 });

    let nextNumber = 1;
    if (lastStudent && lastStudent.rollNumber) {
      const num = parseInt(lastStudent.rollNumber.slice(prefix.length), 10);
      if (!isNaN(num)) nextNumber = num + 1;
    }

    const rollNumber = prefix + String(nextNumber).padStart(3, "0");

    const entry = await Student.create({
      modeOfJoining: data.entry_type,
      applicationNo: data.application_no,
      studentName: data.name,
      admissionStatus: data.status,
      deptName: data.branch_sec,
      deptCode: data.dept_code,
      rollNumber: rollNumber,
      registerNumber: data.reg_no,
      community: data.community,
      allocatedQuota: data.allocated_quota,
      stdUid: data.student_uid,
    });

    res.status(201).json({ id: entry._id, ...data, Roll_Number: rollNumber });
  } catch (err) {
    console.error("CREATE ERROR:", err.message || err);
    res.status(500).json({
      error: "Failed to create student",
      details: err.message || err.toString()
    });
  }
};

// ------------------------------------------------------
// UPDATE STUDENT
// ------------------------------------------------------
export const updateAdmittedStudent = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;

    const updateData = {
      modeOfJoining: data.entry_type,
      applicationNo: data.application_no,
      studentName: data.name,
      admissionStatus: data.status,
      deptName: data.branch_sec,
      deptCode: data.dept_code,
      rollNumber: data.roll_no,
      registerNumber: data.reg_no,
      community: data.community,
      allocatedQuota: data.allocated_quota,
      stdUid: data.student_uid,
    };

    const updated = await Student.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ error: "Student not found" });

    res.json({ id, ...data });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: "Failed to update student" });
  }
};

// ------------------------------------------------------
// DELETE STUDENT
// ------------------------------------------------------
export const deleteAdmittedStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: "Failed to delete student" });
  }
};

// ------------------------------------------------------
// CHECK/GENERATE STUDENT UID
// ------------------------------------------------------
export const checkAndGenerateUID = async (req, res) => {
  try {
    const applicationNo = req.params.applicationNo;

    if (!applicationNo) {
      return res.status(400).json({ error: "Application number is required" });
    }

    const existingStudent = await Student.findOne({
      applicationNo,
      stdUid: { $exists: true, $ne: null, $ne: '' }
    });

    if (existingStudent) {
      return res.json({
        uid: existingStudent.stdUid,
        isExisting: true
      });
    }

    // No existing UID found, generate new one
    const lastStudent = await Student.findOne({
      applicationNo,
      stdUid: new RegExp(`^${applicationNo}`)
    }).sort({ stdUid: -1 });

    let nextSequence = 1;
    if (lastStudent && lastStudent.stdUid) {
      const sequenceStr = lastStudent.stdUid.substring(String(applicationNo).length);
      const sequenceNum = parseInt(sequenceStr, 10);
      if (!isNaN(sequenceNum)) {
        nextSequence = sequenceNum + 1;
      }
    }

    return res.json({
      uid: null,
      nextSequence: nextSequence,
      isExisting: false
    });
  } catch (err) {
    console.error("CHECK UID ERROR:", err);
    res.status(500).json({ error: "Failed to check/generate UID" });
  }
};
