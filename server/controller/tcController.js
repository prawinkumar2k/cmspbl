/**
 * TC (Transfer Certificate) Controller — MongoDB version
 * All TC fields embedded in Student document
 */
import Student from '../models/Student.js';

export const getTCByRegNo = async (req, res) => {
  try {
    const { regNo } = req.query;
    if (!regNo) return res.status(400).json({ error: 'Registration number is required' });

    const s = await Student.findOne({ registerNumber: regNo });
    if (!s) return res.status(404).json({ error: 'Student not found' });

    // Map to old MySQL field names so frontend stays unchanged
    res.json({
      reg_no: s.registerNumber,
      name: s.studentName,
      father_name: s.fatherName,
      guardian_name: s.guardianName,
      dob: s.dob,
      sex: s.gender,
      community: s.community,
      caste: s.caste,
      religion: s.religion,
      nationality: s.nationality,
      date_of_admission: s.admissionDate,
      course: s.courseName,
      dept: s.deptName,
      medium_of_instruction: s.mediumOfInstruction,
      sem: s.semester,
      year: s.year,
      year_of_department: s.yearOfDepartment || null,
      leaving_date: s.leavingDate || null,
      reason_leaving: s.reasonLeaving || null,
      identification: s.identificationMark || null,
      tc_no: s.tcNo || null,
      date_of_transfer: s.tcCreateDate || null,
      issue_date_tc: s.tcIssueDate || null,
      conduct: s.conductCharacter || null,
      completed: s.whetherCompleted || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateTC = async (req, res) => {
  try {
    const { id } = req.params;  // id = Register_Number
    const d = req.body;
    if (!id) return res.status(400).json({ error: 'Registration number is required' });

    // Map old field names → MongoDB camelCase
    const update = {};
    if (d.tc_no != null) update.tcNo = d.tc_no;
    if (d.tc_create_date != null) update.tcCreateDate = d.tc_create_date || d.tc_date || d.TC_Date || d.dateMade || d.date_of_transfer;
    if (d.tc_issue_date != null) update.tcIssueDate = d.tc_issue_date || d.Issue_Date_TC || d.dateIssue || d.issue_date_tc;
    if (d.reason_leaving != null) update.reasonLeaving = d.reason_leaving || d.Reason_Leaving;
    if (d.leaving_date != null) update.leavingDate = d.leaving_date || d.Leaving_Date || d.dateLeft;
    if (d.conduct_character != null) update.conductCharacter = d.conduct_character || d.Conduct_Character || d.conduct;
    if (d.whether_completed != null) update.whetherCompleted = d.whether_completed || d.Whether_Qualified || d.completed;
    if (d.Student_Name || d.name) update.studentName = d.Student_Name || d.name;
    if (d.Father_Name || d.father_name) update.fatherName = d.Father_Name || d.father_name;
    if (d.Guardian_Name || d.guardian_name) update.guardianName = d.Guardian_Name || d.guardian_name;
    if (d.DOB || d.dob) update.dob = d.DOB || d.dob;
    if (d.Gender || d.sex) update.gender = d.Gender || d.sex;
    if (d.Community || d.community) update.community = d.Community || d.community;
    if (d.Caste || d.caste) update.caste = d.Caste || d.caste;
    if (d.Nationality || d.nationality) update.nationality = d.Nationality || d.nationality;
    if (d.Religion || d.religion) update.religion = d.Religion || d.religion;
    if (d.Admission_Date || d.date_of_admission) update.admissionDate = d.Admission_Date || d.date_of_admission;
    if (d.Course_Name || d.course) update.courseName = d.Course_Name || d.course;
    if (d.Dept_Name || d.dept) update.deptName = d.Dept_Name || d.dept;
    if (d.Semester || d.sem) update.semester = d.Semester || d.sem;
    if (d.Year || d.year) update.year = d.Year || d.year;
    if (d.Medium_of_Instruction || d.medium_of_instruction) update.mediumOfInstruction = d.Medium_of_Instruction || d.medium_of_instruction;
    if (d.Identification_of_Student || d.identification) update.identificationMark = d.Identification_of_Student || d.identification;

    const result = await Student.findOneAndUpdate({ registerNumber: id }, { $set: update }, { new: true });
    if (!result) return res.status(404).json({ error: 'Student not found' });

    res.json({ success: true, message: 'TC details updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getAllTC = async (req, res) => {
  try {
    // ✅ $exists:true + $ne:'' replaces MySQL: WHERE tc_no IS NOT NULL AND tc_no != ''
    const students = await Student.find({ tcNo: { $exists: true, $ne: null, $ne: '' } });
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const saveTC = updateTC;
