import Student from '../models/Student.js';

export const getNominalRollStudents = async (req, res) => {
    try {
        const students = await Student.find({ admissionStatus: 'Admitted' })
            .select('registerNumber studentName dob photoPath deptName deptCode semester year regulation')
            .sort({ registerNumber: 1 });

        res.json({ success: true, data: students, message: 'Nominal roll students fetched successfully' });
    } catch (error) {
        console.error('Error fetching nominal roll students:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch nominal roll students', error: error.message });
    }
};

export const getNominalRollStudentsFiltered = async (req, res) => {
    try {
        const { department, subject_code, year, semester } = req.query;
        const filter = { admissionStatus: 'Admitted' };

        if (department && department !== 'All') filter.deptName = department;
        if (subject_code && subject_code !== 'All') filter.deptCode = subject_code;
        if (year && year !== 'All') filter.year = year;
        if (semester && semester !== 'All') filter.semester = semester;

        const students = await Student.find(filter)
            .select('registerNumber studentName dob photoPath deptName deptCode semester year regulation applicationNo')
            .sort({ applicationNo: 1 });

        res.json({ success: true, data: students, message: 'Filtered nominal roll students fetched successfully' });
    } catch (error) {
        console.error('Error fetching filtered nominal roll students:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch filtered nominal roll students', error: error.message });
    }
};
