/**
 * Library Student (Borrower) Controller — MongoDB version
 */
import path from 'path';
import fs from 'fs';
import { StudentDetails } from '../models/StudentDetails.js';

const toDate = (dateStr) => {
  if (!dateStr) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return new Date(dateStr);
  const parts = dateStr.split(/[-\/]/);
  if (parts.length === 3) return new Date(`${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`);
  return null;
};

export const getAllStudents = async (req, res) => {
  try {
    const rows = await StudentDetails.find().sort({ createdAt: -1 });
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getStudentById = async (req, res) => {
  try {
    const doc = await StudentDetails.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const addStudent = async (req, res) => {
  try {
    const data = req.body;
    let photoPath = '';

    if (req.file) {
      const ext = path.extname(req.file.originalname).toLowerCase();
      if (!['.jpeg', '.jpg', '.png', '.webp'].includes(ext)) {
        return res.status(400).json({ error: 'Invalid image format. Only jpeg, jpg, png, webp allowed.' });
      }
      const destDir = path.join(process.cwd(), 'client', 'public', 'assets', 'lib', 'studentborrower');
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
      const fileName = `${data.BorrowerID}${ext}`;
      fs.writeFileSync(path.join(destDir, fileName), req.file.buffer);
      photoPath = `/assets/lib/studentborrower/${fileName}`;
    }

    const dob = toDate(data.DateOfBirth);
    const joining = toDate(data.JoiningDate);
    const today = new Date();
    if (dob && dob > today) return res.status(400).json({ success: false, message: 'Date of Birth cannot be in the future.' });
    if (joining && joining > today) return res.status(400).json({ success: false, message: 'Joining Date cannot be in the future.' });

    const doc = await StudentDetails.create({
      borrowerId: data.BorrowerID, studentName: data.StudentName, registerNumber: data.RegisterNumber,
      department: data.Department, year: data.Year, section: data.Section, gender: data.Gender,
      dateOfBirth: dob, joiningDate: joining, phoneNumber: data.PhoneNumber,
      emailId: data.EmailID || '', address: data.Address || '',
      borrowLimit: data.BorrowLimit || 3, status: data.Status || 'Active',
      remarks: data.Remarks || '', photoPath
    });

    res.json({ id: doc._id, photoPath });
  } catch (err) {
    console.error('Error saving student:', err);
    res.status(500).json({ success: false, message: 'Failed to save student', error: err.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const data = req.body;
    let photoPath = data.PhotoPath || '';

    if (req.file) {
      const ext = path.extname(req.file.originalname).toLowerCase();
      if (!['.jpeg', '.jpg', '.png', '.webp'].includes(ext)) {
        return res.status(400).json({ error: 'Invalid image format. Only jpeg, jpg, png, webp allowed.' });
      }
      const destDir = path.join(process.cwd(), 'client', 'public', 'assets', 'lib', 'studentborrower');
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
      const fileName = `${data.BorrowerID}${ext}`;
      fs.writeFileSync(path.join(destDir, fileName), req.file.buffer);
      photoPath = `/assets/lib/studentborrower/${fileName}`;
    }

    const result = await StudentDetails.findByIdAndUpdate(req.params.id, {
      studentName: data.StudentName, registerNumber: data.RegisterNumber,
      department: data.Department, year: data.Year, section: data.Section, gender: data.Gender,
      dateOfBirth: data.DateOfBirth ? new Date(data.DateOfBirth) : undefined,
      joiningDate: data.JoiningDate ? new Date(data.JoiningDate) : undefined,
      phoneNumber: data.PhoneNumber, emailId: data.EmailID, address: data.Address,
      borrowLimit: data.BorrowLimit || 3, status: data.Status, remarks: data.Remarks, photoPath
    }, { new: true });

    res.json({ affectedRows: result ? 1 : 0, photoPath });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const deleteStudent = async (req, res) => {
  try {
    const result = await StudentDetails.findByIdAndDelete(req.params.id);
    res.json({ affectedRows: result ? 1 : 0 });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
