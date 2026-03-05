import CourseMaster from '../models/CourseMaster.js';

export const getAllCourses = async (req, res) => {
  try {
    const courses = await CourseMaster.find().sort({ courseName: 1 });
    res.json(courses);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const addCourse = async (req, res) => {
  try {
    const { Course_Name } = req.body;
    const doc = await CourseMaster.create({ courseName: Course_Name });
    res.json({ message: 'Course added successfully', id: doc._id });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const editCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { Course_Name } = req.body;
    await CourseMaster.findByIdAndUpdate(id, { courseName: Course_Name });
    res.json({ message: 'Course updated successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const deleteCourse = async (req, res) => {
  try {
    await CourseMaster.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
