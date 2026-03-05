/**
 * Memo Controller — MongoDB version
 * JSON.stringify columns → native MongoDB arrays
 */
import { StaffMemo, StudentMemo } from '../models/Memo.js';
import Staff from '../models/Staff.js';

// ── Staff Memos ───────────────────────────────────────────────────────────────

export const getStaffMemos = async (req, res) => {
    try {
        const memos = await StaffMemo.find().sort({ createdAt: -1 });
        res.json(memos);
    } catch (error) {
        console.error('Error fetching staff memos:', error);
        res.status(500).json({ error: 'Failed to fetch staff memos' });
    }
};

export const getStaffDepartments = async (req, res) => {
    try {
        // ✅ MongoDB distinct replaces SELECT DISTINCT dept FROM staff_master
        const depts = await Staff.distinct('deptName', { deptName: { $ne: null, $ne: '' } });
        res.json(depts.filter(Boolean).sort());
    } catch (error) {
        console.error('Error fetching staff departments:', error);
        res.status(500).json({ error: 'Failed to fetch staff departments' });
    }
};

export const getStaffList = async (req, res) => {
    try {
        const { department, search } = req.query;
        const filter = {};
        if (department) filter.deptName = department;
        if (search) {
            const rx = new RegExp(search, 'i');
            filter.$or = [{ staffName: rx }, { mobile: rx }, { deptName: rx }];
        }

        const staff = await Staff.find(filter).select('_id staffName mobile deptName').sort({ staffName: 1 });
        res.json(staff.map(s => ({ id: s._id, name: s.staffName, mobile: s.mobile, department: s.deptName })));
    } catch (error) {
        console.error('Error fetching staff list:', error);
        res.status(500).json({ error: 'Failed to fetch staff list' });
    }
};

export const createStaffMemo = async (req, res) => {
    try {
        const { title, content, priority, date, departments, staff } = req.body;
        // ✅ MongoDB: store as real Array — no JSON.stringify needed
        const memo = await StaffMemo.create({
            title, content, priority, date: date ? new Date(date) : undefined,
            departments: Array.isArray(departments) ? departments : (departments ? JSON.parse(departments) : []),
            staff: Array.isArray(staff) ? staff : (staff ? JSON.parse(staff) : []),
        });
        res.status(201).json({ message: 'Staff memo created successfully', id: memo._id });
    } catch (error) {
        console.error('Error creating staff memo:', error);
        res.status(500).json({ error: 'Failed to create staff memo' });
    }
};

export const deleteStaffMemo = async (req, res) => {
    try {
        await StaffMemo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Staff memo deleted successfully' });
    } catch (error) {
        console.error('Error deleting staff memo:', error);
        res.status(500).json({ error: 'Failed to delete staff memo' });
    }
};

// ── Student Memos ─────────────────────────────────────────────────────────────

export const getStudentMemos = async (req, res) => {
    try {
        const memos = await StudentMemo.find().sort({ createdAt: -1 });
        res.json(memos);
    } catch (error) {
        console.error('Error fetching student memos:', error);
        res.status(500).json({ error: 'Failed to fetch student memos' });
    }
};

export const createStudentMemo = async (req, res) => {
    try {
        const { title, content, priority, date, courses, departments, students, semester, year, section } = req.body;
        const memo = await StudentMemo.create({
            title, content, priority,
            date: date ? new Date(date) : undefined,
            courses: Array.isArray(courses) ? courses : (courses ? JSON.parse(courses) : []),
            departments: Array.isArray(departments) ? departments : (departments ? JSON.parse(departments) : []),
            students: Array.isArray(students) ? students : (students ? JSON.parse(students) : []),
            semester, year, section
        });
        res.status(201).json({ message: 'Student memo created successfully', id: memo._id });
    } catch (error) {
        console.error('Error creating student memo:', error);
        res.status(500).json({ error: 'Failed to create student memo' });
    }
};

export const deleteStudentMemo = async (req, res) => {
    try {
        await StudentMemo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student memo deleted successfully' });
    } catch (error) {
        console.error('Error deleting student memo:', error);
        res.status(500).json({ error: 'Failed to delete student memo' });
    }
};
