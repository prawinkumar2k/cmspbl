/**
 * Subject Allocation Controller — MongoDB version
 */
import SubjectAllocation from '../models/SubjectAllocation.js';
import Staff from '../models/Staff.js';
import AcademicYear from '../models/AcademicYear.js';
import CourseMaster from '../models/CourseMaster.js';
import Course from '../models/Course.js';
import Semester from '../models/Semester.js';
import Regulation from '../models/Regulation.js';
import Subject from '../models/Subject.js';

// Helper: map legacy PascalCase body keys to camelCase Mongoose fields.
const fromBody = (body) => ({
	staffId: body.Staff_Id || body.staffId,
	staffName: body.Staff_Name || body.staffName,
	academicYear: body.Academic_Year || body.academicYear,
	semType: body.Sem_Type || body.semType,
	courseName: body.Course_Name || body.courseName,
	deptName: body.Dept_Name || body.deptName,
	deptCode: body.Dept_Code || body.deptCode,
	semester: body.Semester != null ? Number(body.Semester) : (body.semester != null ? Number(body.semester) : null),
	regulation: body.Regulation || body.regulation,
	// Subjects 1-7
	...([1, 2, 3, 4, 5, 6, 7].reduce((acc, n) => ({
		...acc,
		[`sub${n}Name`]: body[`Sub${n}_Name`] || body[`sub${n}Name`] || null,
		[`sub${n}Code`]: body[`Sub${n}_Code`] || body[`sub${n}Code`] || null,
		[`sub${n}DeptCode`]: body[`Sub${n}_Dept_Code`] || body[`sub${n}DeptCode`] || null,
		[`sub${n}DeptName`]: body[`Sub${n}_Dept_Name`] || body[`sub${n}DeptName`] || null,
		[`sub${n}Semester`]: body[`Sub${n}_Semester`] != null ? Number(body[`Sub${n}_Semester`]) : (body[`sub${n}Semester`] != null ? Number(body[`sub${n}Semester`]) : null),
		[`sub${n}Regulation`]: body[`Sub${n}_Regulation`] || body[`sub${n}Regulation`] || null,
	}), {}))
});

export const getAllocations = async (req, res) => {
	try {
		const filter = {};
		if (req.query.deptCode) filter.deptCode = req.query.deptCode;
		if (req.query.academicYear) filter.academicYear = req.query.academicYear;
		const allocations = await SubjectAllocation.find(filter).sort({ staffName: 1 });
		res.json(allocations);
	} catch (err) { res.status(500).json({ error: err.message }); }
};

export const createAllocation = async (req, res) => {
	try {
		const data = fromBody(req.body);
		if (!data.staffId) return res.status(400).json({ error: 'No valid fields provided' });
		const doc = await SubjectAllocation.create(data);
		res.json({ success: true, id: doc._id });
	} catch (err) { res.status(500).json({ error: err.message }); }
};

export const updateAllocation = async (req, res) => {
	try {
		const { id } = req.params;
		const data = fromBody(req.body);
		const update = Object.fromEntries(Object.entries(data).filter(([, v]) => v != null));
		if (!Object.keys(update).length) return res.status(400).json({ error: 'No valid fields provided for update' });
		await SubjectAllocation.findByIdAndUpdate(id, update);
		res.json({ success: true });
	} catch (err) { res.status(500).json({ error: err.message }); }
};

export const deleteAllocation = async (req, res) => {
	try {
		await SubjectAllocation.findByIdAndDelete(req.params.id);
		res.json({ success: true });
	} catch (err) { res.status(500).json({ error: err.message }); }
};

export const getStaffs = async (req, res) => {
	try {
		const staff = await Staff.find().select('staffId staffName').sort({ staffName: 1 });
		res.json(staff.map(s => ({ Staff_ID: s.staffId, Staff_Name: s.staffName })));
	} catch (err) { res.status(500).json({ error: err.message }); }
};

export const getAcademicYears = async (req, res) => {
	try {
		const years = await AcademicYear.find().select('academicYear').sort({ academicYear: -1 });
		res.json(years.map(y => y.academicYear));
	} catch (err) { res.status(500).json({ error: err.message }); }
};

export const getCourses = async (req, res) => {
	try {
		const courses = await CourseMaster.find().distinct('courseName');
		res.json(courses.sort());
	} catch (err) { res.status(500).json({ error: err.message }); }
};

export const getDepartments = async (req, res) => {
	try {
		const { course_name } = req.query;
		const filter = course_name ? { courseName: course_name } : {};
		const depts = await Course.find(filter).select('deptCode deptName').sort({ deptName: 1 });
		res.json(depts.map(d => ({ Dept_Code: d.deptCode, Dept_Name: d.deptName })));
	} catch (err) { res.status(500).json({ error: err.message }); }
};

export const getSemesters = async (req, res) => {
	try {
		const sems = await Semester.find().select('semesterName').sort({ semesterNumber: 1 });
		res.json(sems.map(s => s.semesterName));
	} catch (err) { res.status(500).json({ error: err.message }); }
};

export const getRegulations = async (req, res) => {
	try {
		const regs = await Regulation.find().select('regulationName');
		res.json(regs.map(r => r.regulationName));
	} catch (err) { res.status(500).json({ error: err.message }); }
};

export const getSubjectsFiltered = async (req, res) => {
	try {
		const { dept_code, semester, regulation } = req.query;
		const filter = {};
		if (dept_code) filter.deptCode = dept_code;
		if (semester) filter.semester = semester;
		if (regulation) filter.regulation = regulation;
		const subjects = await Subject.find(filter).select('subName subCode').sort({ subName: 1 });
		res.json(subjects.map(s => ({ Sub_Name: s.subName, Sub_Code: s.subCode })));
	} catch (err) { res.status(500).json({ error: err.message }); }
};

