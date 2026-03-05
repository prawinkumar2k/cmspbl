import Student from '../models/Student.js';
import Staff from '../models/Staff.js';
import Subject from '../models/Subject.js';

export const getStudentAcademicDetails = async (req, res) => {
    try {
        const registerNumber = req.user.username;

        const student = await Student.findOne({ registerNumber });
        if (!student) return res.status(404).json({ success: false, error: 'Student not found' });

        // ✅ Replaces: LEFT JOIN staff_master ON s.Class_Teacher = sm.Staff_ID
        let classTeacherName = student.classTeacher;
        if (student.classTeacher) {
            const teacher = await Staff.findOne({ staffId: student.classTeacher }).select('staffName');
            if (teacher) classTeacherName = teacher.staffName;
        }

        // ✅ Replaces: LEFT JOIN staff_subject (subject assignments)
        const subjects = await Subject.find({
            deptCode: student.deptCode,
            semester: student.semester
        }).select('subCode subName subType');

        // ✅ Resolve arrears from arrearCodes fields embedded in Student (S1-S8 style)
        // Assumes Student model has arrearSem1...arrearSem8 storing comma-separated codes
        const currentSem = parseInt(student.semester) || 0;
        const arrearList = [];

        for (let i = 1; i < currentSem; i++) {
            const arrearField = `arrearSem${i}`;
            const arrearCodesStr = student[arrearField];
            if (arrearCodesStr && arrearCodesStr.trim() !== '' && arrearCodesStr.toLowerCase() !== 'null') {
                const codes = arrearCodesStr.split(',').map(c => c.trim()).filter(Boolean);
                if (codes.length) {
                    const arrearSubjects = await Subject.find({ subCode: { $in: codes } }).select('subCode subName');
                    arrearSubjects.forEach(sub => arrearList.push({
                        semester: i, code: sub.subCode, name: sub.subName, status: 'Arrear'
                    }));
                }
            }
        }

        res.status(200).json({
            success: true,
            profile: {
                Register_Number: student.registerNumber,
                Student_Name: student.studentName,
                Dept_Name: student.deptName,
                Dept_Code: student.deptCode,
                Semester: student.semester,
                Year: student.year,
                Class: student.class,
                Class_Teacher: classTeacherName,
                Academic_Year: student.academicYear,
                Course_Name: student.courseName,
                Regulation: student.regulation,
            },
            subjects: subjects.map(s => ({ Sub_Code: s.subCode, Sub_Name: s.subName, Sub_Type: s.subType })),
            arrears: arrearList
        });
    } catch (err) {
        console.error('Error in getStudentAcademicDetails:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
