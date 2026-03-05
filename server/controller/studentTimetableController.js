import Student from '../models/Student.js';
import ClassTimetable from '../models/ClassTimetable.js';
import Subject from '../models/Subject.js';

export const getStudentTimetable = async (req, res) => {
    try {
        const registerNumber = req.user.staff_id;
        if (!registerNumber) return res.status(400).json({ error: 'Student registration number not found in token' });

        const student = await Student.findOne({ registerNumber })
            .select('deptCode semester year regulation class deptName');

        if (!student) return res.status(404).json({ error: 'Student details not found' });

        // ✅ Replaces: SELECT * FROM class_timetable WHERE ... AND Class_Section = ?
        const timetableRows = await ClassTimetable.find({
            deptCode: student.deptCode,
            semester: student.semester,
            year: student.year,
            regulation: student.regulation,
            classSection: student.class
        });

        // Extract all unique subject codes
        const subjectCodesSet = new Set();
        timetableRows.forEach(row => {
            [row.period1, row.period2, row.period3, row.period4, row.period5, row.period6].forEach(val => {
                if (val && val !== 'Free') val.split('/').forEach(code => subjectCodesSet.add(code.trim()));
            });
        });

        const subjectCodes = Array.from(subjectCodesSet);
        const subjectMap = {};

        if (subjectCodes.length) {
            const subjects = await Subject.find({ subCode: { $in: subjectCodes } }).select('subCode subName');
            subjects.forEach(s => { subjectMap[s.subCode] = s.subName; });
        }

        const resolveSubject = (raw) => {
            if (!raw || raw === 'Free') return { code: 'Free', name: 'Free' };
            const codes = raw.split('/').map(c => c.trim());
            return { code: raw, name: codes.map(c => subjectMap[c] || c).join(' / ') };
        };

        const formattedTimetable = timetableRows.map(row => ({
            dayOrder: row.dayOrder,
            periods: [row.period1, row.period2, row.period3, row.period4, row.period5, row.period6].map(resolveSubject)
        }));

        res.json({
            success: true,
            studentInfo: {
                registerNumber, deptCode: student.deptCode, deptName: student.deptName,
                semester: student.semester, year: student.year, regulation: student.regulation, className: student.class
            },
            timetable: formattedTimetable
        });
    } catch (error) {
        console.error('Error fetching student timetable:', error);
        res.status(500).json({ error: 'Failed to fetch timetable' });
    }
};
