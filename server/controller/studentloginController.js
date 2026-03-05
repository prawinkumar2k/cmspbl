import Student from '../models/Student.js';

export const getAdmittedStudents = async (req, res) => {
    try {
        const students = await Student.find({ admissionStatus: 'Admitted' })
            .select('_id deptName deptCode semester year studentName registerNumber password')
            .sort({ semester: 1 });

        const processed = students.map(s => ({
            ...s.toObject(),
            // Match old MySQL field names for frontend compat
            Id: s._id,
            Dept_Name: s.deptName?.includes('(') ? s.deptName.split('(')[0].trim() : s.deptName,
            Dept_Code: s.deptCode,
            Semester: s.semester,
            Year: s.year,
            Student_Name: s.studentName,
            Register_Number: s.registerNumber,
        }));

        res.json(processed);
    } catch (err) {
        console.error('Error fetching admitted students:', err);
        res.status(500).json({ error: 'Failed to fetch admitted students' });
    }
};

export const updateStudentPassword = async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) return res.status(400).json({ error: 'Password is required' });

    try {
        const result = await Student.findByIdAndUpdate(id, { password }, { new: true });
        if (!result) return res.status(404).json({ error: 'Student not found' });

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
        console.error('Error updating student password:', err);
        res.status(500).json({ error: 'Failed to update password' });
    }
};
