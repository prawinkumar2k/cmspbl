/**
 * Staff Details Controller — MongoDB version
 * Uses the Staff Mongoose model
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Staff from '../models/Staff.js';
import Designation from '../models/Designation.js';
import Course from '../models/Course.js';
import Semester from '../models/Semester.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const parseDate = (val) => (val === '' || val === null || val === undefined) ? null : val;

// ── Get all designations ──────────────────────────────────────────────────────
export const getAllDesignations = async (req, res) => {
  try {
    const list = await Designation.find().sort({ designationName: 1 });
    res.json(list);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch designations' }); }
};

// ── Get all religions (static list — no separate table needed in MongoDB) ─────
export const getAllReligions = async (req, res) => {
  res.json(['Hindu', 'Muslim', 'Christian', 'Jain', 'Buddhist', 'Sikh', 'Others']);
};

// ── Get all communities (static list) ────────────────────────────────────────
export const getAllCommunities = async (req, res) => {
  res.json(['OC', 'BC', 'BCM', 'BCO', 'BC(Others)', 'MBC', 'DNC', 'SC', 'SCA', 'ST', 'Others']);
};

// ── Get all departments from Course collection ────────────────────────────────
export const getAllDept_Names = async (req, res) => {
  try {
    const courses = await Course.find().select('deptName deptCode courseName').sort({ deptName: 1 });
    // Return the legacy field names the frontend already consumes.
    res.json(courses.map(c => ({ Dept_Name: c.deptName, Dept_Code: c.deptCode, Course_Name: c.courseName })));
  } catch (err) { res.status(500).json({ error: 'Failed to fetch Dept_Names' }); }
};

// ── Generate next Staff ID ────────────────────────────────────────────────────
export const getNextStaffId = async (req, res) => {
  const { deptCode } = req.query;
  if (!deptCode) return res.status(400).json({ error: 'deptCode is required' });
  try {
    // ✅ MongoDB: find last staffId starting with deptCode prefix
    const lastStaff = await Staff.findOne(
      { staffId: new RegExp(`^${deptCode}`) },
      { staffId: 1 }
    ).sort({ staffId: -1 });

    let nextId;
    if (!lastStaff) {
      nextId = `${deptCode}0001`;
    } else {
      const numericPart = lastStaff.staffId.substring(deptCode.length);
      const nextNum = parseInt(numericPart, 10) + 1;
      nextId = `${deptCode}${String(nextNum).padStart(4, '0')}`;
    }
    res.json({ staffId: nextId });
  } catch (err) {
    console.error('Error generating staff ID:', err);
    res.status(500).json({ error: 'Failed to generate staff ID', details: err.message });
  }
};

// ── Insert new staff ──────────────────────────────────────────────────────────
export const insertStaffDetails = async (req, res) => {
  try {
    const b = req.body;
    let photo = null;
    if (req.file) photo = req.file.filename;

    const staff = await Staff.create({
      staffId: b.Staff_ID,
      staffName: b.Staff_Name,
      designation: b.Designation,
      qualification: b.Qualification,
      deptName: b.Dept_Name,
      deptCode: b.Dept_Code,
      courseName: b.Course_Name,
      dob: parseDate(b.DOB),
      gender: b.Gender,
      mobile: b.Mobile,
      email: b.Email,
      religion: b.Religion,
      community: b.Community,
      caste: b.Caste,
      address: b.Temporary_Address,
      permanentAddr: b.Permanent_Address,
      basicPay: b.Basic_Pay,
      pfNumber: b.PF_Number,
      joiningDate: parseDate(b.Joining_Date),
      relievingDate: parseDate(b.Reliving_Date),
      accountNumber: b.Account_Number,
      bankName: b.Bank_Name,
      panNo: b.PAN_Number,
      aadhaarNo: b.Aadhar_Number,
      photo: photo,
      category: b.Category,
    });

    res.status(201).json({
      message: 'Staff details inserted successfully',
      photoPath: photo ? `/assets/master/${photo}` : null,
      id: staff._id
    });
  } catch (err) {
    console.error('Error inserting staff details:', err);
    if (err.code === 11000) return res.status(400).json({ error: 'Staff ID already exists', details: err.message });
    res.status(500).json({ error: 'Failed to insert staff details', details: err.message });
  }
};

// ── Get all staff ─────────────────────────────────────────────────────────────
export const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find().sort({ createdAt: -1 });
    res.json(staff);
  } catch (err) {
    console.error('Error fetching staff records:', err);
    res.status(500).json({ error: 'Failed to fetch staff records', message: err.message });
  }
};

// ── Update staff ──────────────────────────────────────────────────────────────
export const updateStaffDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const b = req.body;

    const updateData = {
      staffId: b.Staff_ID,
      staffName: b.Staff_Name,
      designation: b.Designation,
      qualification: b.Qualification,
      deptName: b.Dept_Name,
      deptCode: b.Dept_Code,
      courseName: b.Course_Name,
      dob: parseDate(b.DOB),
      gender: b.Gender,
      mobile: b.Mobile,
      email: b.Email,
      religion: b.Religion,
      community: b.Community,
      caste: b.Caste,
      address: b.Temporary_Address,
      permanentAddr: b.Permanent_Address,
      basicPay: b.Basic_Pay,
      pfNumber: b.PF_Number,
      joiningDate: parseDate(b.Joining_Date),
      relievingDate: parseDate(b.Reliving_Date),
      accountNumber: b.Account_Number,
      bankName: b.Bank_Name,
      panNo: b.PAN_Number,
      aadhaarNo: b.Aadhar_Number,
      category: b.Category,
    };

    if (req.file) updateData.photo = req.file.filename;

    const result = await Staff.findByIdAndUpdate(id, updateData, { new: true });
    if (!result) return res.status(200).json({ message: 'No changes made to staff details' });
    res.json({ message: 'Staff details updated successfully' });
  } catch (err) {
    console.error('Error updating staff details:', err);
    res.status(500).json({ error: 'Failed to update staff details', details: err.message });
  }
};

// ── Delete staff ──────────────────────────────────────────────────────────────
export const deleteStaffDetails = async (req, res) => {
  try {
    const { id } = req.params;
    await Staff.findByIdAndDelete(id);
    res.json({ message: 'Staff deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete staff', details: err.message });
  }
};

// ── Serve staff image with fallback ──────────────────────────────────────────
export const getStaffImage = async (req, res) => {
  try {
    const { filename } = req.params;
    const uploadDir = path.join(__dirname, '../uploads/staff');
    const defaultImage = path.join(uploadDir, 'staff.png');

    if (filename && filename !== 'null' && filename !== 'undefined' && filename !== 'Image Not Available') {
      const filePath = path.join(uploadDir, filename);
      if (fs.existsSync(filePath)) return res.sendFile(filePath);
    }
    if (fs.existsSync(defaultImage)) return res.sendFile(defaultImage);
    return res.status(404).json({ error: 'Default image not found' });
  } catch (err) {
    console.error('Error serving staff image:', err);
    res.status(500).json({ error: 'Failed to serve image' });
  }
};

