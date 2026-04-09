import Student from '../models/Student.js';

export const getArrearStudents = async (req, res) => {
    try {
        const { deptCode, semester, regulation } = req.query;
        const filter = {};
        if (deptCode) filter.deptCode = deptCode;
        if (semester) filter.semester = semester;
        if (regulation) filter.regulation = regulation;

        const students = await Student.find(filter)
            .select('registerNumber studentName photoPath arrearSem1 arrearSem2 arrearSem3 arrearSem4 arrearSem5 arrearSem6 arrearSem7 arrearSem8 _id');

        // Return in legacy field format for frontend compatibility
        res.json(students.map(s => ({
            Id: s._id,
            Register_Number: s.registerNumber,
            Student_Name: s.studentName,
            Photo_Path: s.photoPath,
            S1: s.arrearSem1 || null, S2: s.arrearSem2 || null,
            S3: s.arrearSem3 || null, S4: s.arrearSem4 || null,
            S5: s.arrearSem5 || null, S6: s.arrearSem6 || null,
            S7: s.arrearSem7 || null, S8: s.arrearSem8 || null,
        })));
    } catch (err) {
        console.error('Error fetching arrear students:', err);
        res.status(500).json({ error: err.message });
    }
};

export const updateArrearMarks = async (req, res) => {
    try {
        const { students } = req.body;
        if (!students?.length) return res.status(400).json({ error: 'Invalid students data' });

        // ✅ Promise.all with findByIdAndUpdate replaces parallel SQL UPDATEs
        await Promise.all(students.map(s =>
            Student.findByIdAndUpdate(s.Id, {
                arrearSem1: s.S1 || null, arrearSem2: s.S2 || null,
                arrearSem3: s.S3 || null, arrearSem4: s.S4 || null,
                arrearSem5: s.S5 || null, arrearSem6: s.S6 || null,
                arrearSem7: s.S7 || null, arrearSem8: s.S8 || null,
            })
        ));

        res.json({ success: true, message: 'Arrear marks updated successfully' });
    } catch (err) {
        console.error('Error updating arrear marks:', err);
        res.status(500).json({ error: err.message });
    }
};

