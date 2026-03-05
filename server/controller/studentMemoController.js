/**
 * Student Memo Controller — MongoDB version
 * Lookups from CourseMaster, Course, Semester, Student models
 */
import CourseMaster from '../models/CourseMaster.js';
import Course from '../models/Course.js';
import Semester from '../models/Semester.js';
import Student from '../models/Student.js';

export const getCourses = async (req, res) => {
    try {
        const courses = await CourseMaster.distinct('courseName');
        res.json(courses.sort());
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).json({ error: err.message });
    }
};

export const getDepartmentsByCourse = async (req, res) => {
    try {
        const { course } = req.query;
        const filter = course ? { courseName: course } : {};
        const depts = await Course.find(filter).select('deptName deptCode').sort({ deptName: 1 });
        res.json(depts.map(d => ({ deptName: d.deptName, deptCode: d.deptCode })));
    } catch (err) {
        console.error('Error fetching departments:', err);
        res.status(500).json({ error: err.message });
    }
};

export const getSemesters = async (req, res) => {
    try {
        const sems = await Semester.find().select('semesterName year').sort({ semesterNumber: 1 });
        res.json(sems.map(s => ({ semester: s.semesterName, year: s.year })));
    } catch (err) {
        console.error('Error fetching semesters:', err);
        res.status(500).json({ error: err.message });
    }
};

export const getClasses = async (req, res) => {
    try {
        const { course, department, semester } = req.query;
        const filter = { class: { $exists: true, $ne: null, $ne: '' } };
        if (course) filter.courseName = course;
        if (department) filter.deptName = department;
        if (semester) filter.semester = semester;

        const classes = await Student.distinct('class', filter);
        res.json(classes.filter(Boolean).sort());
    } catch (err) {
        console.error('Error fetching classes:', err);
        res.status(500).json({ error: err.message });
    }
};
