import Student from "../models/Student.js";
import { Community } from "../models/Community.js";

// Consolidate Report for Application Issues
export const consolidateReport = async (req, res) => {
  try {
    const { fromDate, toDate, year } = req.query;

    // Convert to dates
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const yr = parseInt(year);

    const results = await Student.aggregate([
      {
        $match: {
          admissionDate: { $gte: fromDate, $lte: toDate },
          // academicYear matches year or admissionDate year
        }
      },
      {
        $group: {
          _id: { $substr: ["$admissionDate", 0, 10] }, // simplistic date grouping
          totalIssued: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const mapped = results.map(r => ({
      date: r._id,
      totalIssued: r.totalIssued
    }));

    res.json(mapped);
  } catch (err) {
    console.error("CONSOLIDATE ERROR:", err);
    res.status(500).json({ error: "Failed to fetch consolidate report", detail: err.message });
  }
};

// CREATE student
export const createStudent = async (req, res) => {
  try {
    const data = req.body;
    if (!data.Application_No || !data.Student_Name) {
      return res.status(400).json({ error: "Missing required fields: Application_No, Student_Name" });
    }

    // Check duplicate
    const exists = await Student.findOne({ applicationNo: data.Application_No });
    if (exists) return res.status(409).json({ error: "Application number already exists" });

    const entry = await Student.create({
      applicationNo: data.Application_No,
      courseName: data.Course_Name || data.Course_Applied || data.courseApplied || null,
      studentName: data.Student_Name,
      gender: data.Gender || null,
      education: {
        hsc: {
          examType: data.Qualification || data.qualification || null
        }
      },
      fatherName: data.Father_Name || null,
      fatherMobile: data.Father_Mobile || null,
      community: data.Community || null,
      currentAddress: data.Current_Address || data.address || null,
      admissionDate: data.Admission_Date || data.date || null,
      reference: data.Reference || data.reference || null,
      // paidFees is not in Student model, maybe I should add it or use another field
      // I'll skip it for now or add it to a metadata field if needed.
    });

    return res.status(201).json({ message: "Student created", id: entry._id, student: entry });
  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ error: "Failed to create student", detail: err.message });
  }
};

// READ ALL students
export const getStudents = async (req, res) => {
  try {
    const rows = await Student.find().sort({ createdAt: -1 });

    // Map to old fields
    const mapped = rows.map(r => ({
      id: r._id,
      Application_No: r.applicationNo,
      Course_Name: r.courseName,
      Student_Name: r.studentName,
      Gender: r.gender,
      Father_Name: r.fatherName,
      Father_Mobile: r.fatherMobile,
      Community: r.community,
      Current_Address: r.currentAddress,
      Admission_Date: r.admissionDate,
      Reference: r.reference
    }));

    res.json(mapped);
  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ error: "Failed to fetch students", detail: err.message });
  }
};

// UPDATE student
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (!data.Application_No || !data.Student_Name) {
      return res.status(400).json({ error: "Missing required fields: Application_No, Student_Name" });
    }

    const updateData = {
      applicationNo: data.Application_No,
      courseName: data.Course_Name || data.Course_Applied || data.courseApplied || null,
      studentName: data.Student_Name,
      gender: data.Gender || null,
      fatherName: data.Father_Name || null,
      fatherMobile: data.Father_Mobile || null,
      community: data.Community || null,
      currentAddress: data.Current_Address || data.address || null,
      admissionDate: data.Admission_Date || data.date || null,
      reference: data.Reference || data.reference || null,
    };

    const updated = await Student.findByIdAndUpdate(id, updateData, { new: true });
    res.json({ message: "Student updated", student: updated });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: "Failed to update student", detail: err.message });
  }
};

// DELETE student
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    res.json({ message: "Student deleted" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: "Failed to delete student", detail: err.message });
  }
};

//community_master table get community
export const getCommunity = async (req, res) => {
  try {
    const rows = await Community.find().sort({ _id: -1 });
    const mapped = rows.map(r => ({ id: r._id, Community: r.community }));
    res.json(mapped);
  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ error: "Failed to fetch communities", detail: err.message });
  }
};

// Fetch students by course
export const getStudentsByCourse = async (req, res) => {
  try {
    const { courseName } = req.query;
    if (!courseName) return res.status(400).json({ error: "Course name is required" });

    const rows = await Student.find({ courseName: courseName }).sort({ studentName: 1 });

    const mapped = rows.map(r => ({
      id: r._id,
      Application_No: r.applicationNo,
      Student_Name: r.studentName,
      Roll_Number: r.rollNumber,
      Register_Number: r.registerNumber,
      Course_Name: r.courseName,
      Gender: r.gender,
      Father_Name: r.fatherName,
      Father_Mobile: r.fatherMobile,
      Community: r.community,
      Current_Address: r.currentAddress,
      Admission_Date: r.admissionDate
    }));

    res.json(mapped);
  } catch (err) {
    console.error("FETCH STUDENTS BY COURSE ERROR:", err);
    res.status(500).json({ error: "Failed to fetch students by course", detail: err.message });
  }
};