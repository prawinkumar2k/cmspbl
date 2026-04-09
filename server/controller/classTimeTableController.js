/**
 * Class Timetable Controller — MongoDB version
 */
import ClassTimetable from '../models/ClassTimetable.js';
import CourseMaster from '../models/CourseMaster.js';
import Course from '../models/Course.js';
import Semester from '../models/Semester.js';
import Regulation from '../models/Regulation.js';
import Subject from '../models/Subject.js';
import Student from '../models/Student.js';

export const getAllCourses = async (req, res) => {
  try {
    const courses = await CourseMaster.find().sort({ courseName: 1 });
    res.json(courses);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getAllDepartments = async (req, res) => {
  try {
    const depts = await Course.find().select('deptName deptCode').sort({ deptName: 1 });
    res.json(depts.map(d => ({ Dept_Name: d.deptName, Dept_Code: d.deptCode })));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getDepartmentsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const depts = await Course.find({ courseMode: courseId }).select('deptName deptCode').sort({ deptName: 1 });
    res.json(depts.map(d => ({ Dept_Name: d.deptName, Dept_Code: d.deptCode })));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getAllSemesters = async (req, res) => {
  try {
    const sems = await Semester.find().sort({ semesterNumber: 1 });
    res.json(sems.map(s => ({ Semester: s.semesterName, Year: s.year })));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getAllYears = async (req, res) => {
  try {
    const years = await Semester.distinct('year');
    res.json(years.sort().map(y => ({ Year: y })));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getAllRegulations = async (req, res) => {
  try {
    const regs = await Regulation.find().sort({ regulationName: -1 });
    res.json(regs.map(r => ({ Regulation: r.regulationName })));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getClasses = async (req, res) => {
  try {
    const { courseName, deptName, deptCode, semester, year, regulation } = req.query;
    const filter = { admissionStatus: 'Admitted' };
    if (courseName) filter.courseName = courseName;
    if (deptName) filter.deptName = deptName;
    if (deptCode) filter.deptCode = deptCode;
    if (semester) filter.semester = semester;
    if (year) filter.year = year;
    if (regulation) filter.regulation = regulation;

    const classes = await Student.distinct('class', filter);
    res.json(classes.filter(Boolean).sort().map(c => ({ class: c })));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getSubjects = async (req, res) => {
  try {
    const { deptCode, semester, regulation } = req.query;
    const filter = {};
    if (deptCode) filter.deptCode = deptCode;
    if (semester) filter.semester = semester;
    if (regulation) filter.regulation = regulation;

    const subjects = await Subject.find(filter).select('subName subCode').sort({ subName: 1 });
    res.json(subjects.map(s => ({ Sub_Name: s.subName, Sub_Code: s.subCode })));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getTimetable = async (req, res) => {
  try {
    const { course, deptCode, semester, year, regulation, className } = req.query;
    const filter = {};
    if (course) filter.courseName = course;
    if (deptCode) filter.deptCode = deptCode;
    if (semester) filter.semester = semester;
    if (year) filter.year = year;
    if (regulation) filter.regulation = regulation;
    if (className) filter.classSection = className;

    const rows = await ClassTimetable.find(filter);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const saveTimetable = async (req, res) => {
  try {
    const { course, deptCode, deptName, semester, year, regulation, className, timetableData } = req.body;

    // Replace the matching timetable rows before inserting the new payload.
    await ClassTimetable.deleteMany({
      courseName: course, deptCode, semester, year, regulation, classSection: className
    });

    if (timetableData?.length > 0) {
      const dayMap = {};
      timetableData.forEach(entry => {
        if (!dayMap[entry.day]) dayMap[entry.day] = { day: entry.day, periods: {} };
        dayMap[entry.day].periods[entry.period] = entry.subjectCode;
      });

      const docs = Object.values(dayMap).map(d => ({
        courseName: course, deptCode, deptName, semester, year, regulation,
        classSection: className, dayOrder: d.day,
        period1: d.periods[1] || null, period2: d.periods[2] || null,
        period3: d.periods[3] || null, period4: d.periods[4] || null,
        period5: d.periods[5] || null, period6: d.periods[6] || null,
      }));

      await ClassTimetable.insertMany(docs);
    }

    res.json({ message: 'Timetable saved successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const deleteTimetable = async (req, res) => {
  try {
    const { course, deptCode, semester, year, regulation, className } = req.body;
    await ClassTimetable.deleteMany({
      courseName: course, deptCode, semester, year, regulation, classSection: className
    });
    res.json({ message: 'Timetable deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const updateTimetableCell = async (req, res) => {
  try {
    const { course, deptCode, semester, year, regulation, className, day, period, subjectCode } = req.body;
    const periodField = `period${period}`;

    const existing = await ClassTimetable.findOne({
      courseName: course, deptCode, semester, year, regulation, classSection: className, dayOrder: day
    });

    if (existing) {
      await ClassTimetable.findByIdAndUpdate(existing._id, { [periodField]: subjectCode });
    } else {
      const deptInfo = await Course.findOne({ deptCode }).select('deptName');
      await ClassTimetable.create({
        courseName: course, deptCode, deptName: deptInfo?.deptName || '',
        semester, year, regulation, classSection: className, dayOrder: day,
        [periodField]: subjectCode
      });
    }
    res.json({ message: 'Timetable cell updated successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

