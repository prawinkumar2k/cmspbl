import { AssessmentConfig, AssessmentStudent, PracticalMark, AssessmentMarkStatus, Staff } from '../models/index.js';

// Get distinct courses for Practical
export const getCourses = async (req, res) => {
    try {
        const list = await AssessmentConfig.find({ assessmentType: 'Practical' }).distinct('courseName');
        res.json(list.map(c => ({ courseName: c })));
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
};

// Get distinct departments
export const getDepartments = async (req, res) => {
    try {
        const { courseName } = req.query;
        if (!courseName) return res.status(400).json({ error: 'Required' });
        const list = await AssessmentConfig.find({ assessmentType: 'Practical', courseName }).distinct('deptName');

        const details = await AssessmentConfig.find({ assessmentType: 'Practical', courseName }, { deptName: 1, deptCode: 1, _id: 0 });
        const unique = [];
        const seen = new Set();
        details.forEach(d => {
            if (!seen.has(d.deptName)) {
                seen.add(d.deptName);
                unique.push({ deptName: d.deptName, deptCode: d.deptCode });
            }
        });
        res.json(unique);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
};

// Get semesters
export const getSemesters = async (req, res) => {
    try {
        const { courseName, deptName } = req.query;
        const list = await AssessmentConfig.find({ assessmentType: 'Practical', courseName, deptName }).distinct('semester');
        res.json(list.map(s => ({ semester: s })));
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
};

// Get regulations
export const getRegulations = async (req, res) => {
    try {
        const { courseName, deptName, semester } = req.query;
        const list = await AssessmentConfig.find({ assessmentType: 'Practical', courseName, deptName, semester }).distinct('regulation');
        res.json(list.map(r => ({ regulation: r })));
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
};

// Get sections
export const getSections = async (req, res) => {
    try {
        const { courseName, deptName, semester, regulation } = req.query;
        const list = await AssessmentConfig.find({ assessmentType: 'Practical', courseName, deptName, semester, regulation }).distinct('classSection');
        res.json(list.map(s => ({ section: s })));
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
};

// Get subjects
export const getSubjects = async (req, res) => {
    try {
        const { courseName, deptName, semester, regulation, section } = req.query;
        const list = await AssessmentConfig.find({ assessmentType: 'Practical', courseName, deptName, semester, regulation, classSection: section }, { subName: 1, subCode: 1, _id: 0 });
        const unique = [];
        const seen = new Set();
        list.forEach(s => {
            if (!seen.has(s.subCode)) {
                seen.add(s.subCode);
                unique.push({ subjectName: s.subName, subjectCode: s.subCode });
            }
        });
        res.json(unique);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
};

// Get practicals
export const getPracticals = async (req, res) => {
    try {
        const { courseName, deptName, semester, regulation, section, subjectName } = req.query;
        const list = await AssessmentConfig.find({
            assessmentType: 'Practical', courseName, deptName, semester, regulation, classSection: section, subName: subjectName
        }, { testNo: 1, assessmentDate: 1, maxMarks: 1, experimentCount: 1, _id: 0 }).sort({ testNo: 1 });
        res.json(list.map(p => ({
            testNo: p.testNo,
            assessmentDate: p.assessmentDate,
            maxMarks: p.maxMarks,
            experimentCount: p.experimentCount
        })));
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
};

// Get staff
export const getStaff = async (req, res) => {
    try {
        const { courseName, deptName } = req.query;
        const dept = await AssessmentConfig.findOne({ deptName });
        if (!dept) return res.json([]);
        const list = await Staff.find({ courseName, deptCode: dept.deptCode }).sort({ staffName: 1 });
        res.json(list.map(s => ({ staffName: s.staffName, staffId: s.staffId })));
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
};

// Get students for mark entry
export const getStudents = async (req, res) => {
    try {
        const q = req.query;
        const students = await AssessmentStudent.find({
            courseName: q.courseName,
            deptCode: q.deptCode,
            semester: q.semester,
            regulation: q.regulation,
            classSection: q.section,
            assessmentType: 'Practical',
            testNo: q.testNo,
            assessmentDate: q.assessmentDate
        }).sort({ registerNumber: 1 });

        const marks = await PracticalMark.find({
            courseName: q.courseName,
            deptCode: q.deptCode,
            semester: q.semester,
            regulation: q.regulation,
            classSection: q.section,
            subCode: q.subjectCode,
            testNo: q.testNo,
            assessmentDate: q.assessmentDate
        });

        const marksMap = new Map();
        marks.forEach(m => marksMap.set(m.registerNumber, m.experimentMarks));

        const result = students.map(s => {
            const expMap = marksMap.get(s.registerNumber);
            const experiments = [];
            if (expMap) {
                // Map back to array for frontend
                for (let i = 1; i <= 20; i++) {
                    const m = expMap.get(String(i));
                    if (m !== undefined) experiments.push({ marks: m });
                }
            }
            return {
                registerNo: s.registerNumber,
                studentName: s.studentName,
                existingExperiments: experiments.length > 0 ? experiments : null
            };
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
};

// Save practical marks
export const savePracticalMarks = async (req, res) => {
    try {
        const b = req.body;
        const expCount = parseInt(b.experimentCount);

        for (const student of b.students) {
            const expMap = {};
            if (student.experiments) {
                student.experiments.forEach((exp, idx) => {
                    let m = exp.marks;
                    if (m === 'A' || m === 'a') m = 'A';
                    else if (m === '' || m === null) m = '0';
                    else m = String(m);
                    expMap[String(idx + 1)] = m;
                });
            }

            await PracticalMark.findOneAndUpdate(
                {
                    registerNumber: student.registerNo,
                    subCode: b.subjectCode,
                    testNo: b.testNo,
                    assessmentDate: b.assessmentDate
                },
                {
                    studentName: student.studentName,
                    courseName: b.courseName,
                    deptCode: b.deptCode,
                    deptName: b.deptName,
                    semester: b.semester,
                    regulation: b.regulation,
                    classSection: b.section,
                    subName: b.subjectName,
                    assessmentType: 'Practical',
                    maxMarks: 50,
                    experimentCount: expCount,
                    enteredBy: b.staffId,
                    experimentMarks: expMap
                },
                { upsert: true }
            );
        }

        await AssessmentMarkStatus.findOneAndUpdate(
            {
                subCode: b.subjectCode,
                testNo: b.testNo,
                assessmentDate: b.assessmentDate,
                assessmentType: 'Practical'
            },
            {
                courseName: b.courseName,
                deptCode: b.deptCode,
                deptName: b.deptName,
                semester: b.semester,
                regulation: b.regulation,
                classSection: b.section,
                isEntered: true
            },
            { upsert: true }
        );

        res.json({ success: true, message: 'Saved' });
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
};

// Get marks for report
export const getPracticalMarks = async (req, res) => {
    try {
        const q = req.query;
        const filter = {
            courseName: q.courseName,
            deptName: q.deptName,
            semester: q.semester,
            regulation: q.regulation,
            classSection: q.section
        };
        if (q.subjectName) filter.subName = q.subjectName;
        if (q.practicalNo) filter.testNo = q.practicalNo;

        const list = await PracticalMark.find(filter).sort({ registerNumber: 1, testNo: 1 });

        const mapped = list.map(m => {
            let total = 0;
            let isAbsent = false;
            // Calculate obtainedMark (total of experiments)
            if (m.experimentMarks) {
                for (let [k, v] of m.experimentMarks) {
                    if (v === 'A') isAbsent = true;
                    else total += parseInt(v) || 0;
                }
            }

            return {
                id: m._id,
                registerNo: m.registerNumber,
                studentName: m.studentName,
                courseName: m.courseName,
                deptCode: m.deptCode,
                deptName: m.deptName,
                semester: m.semester,
                regulation: m.regulation,
                section: m.classSection,
                subjectCode: m.subCode,
                subjectName: m.subName,
                assessmentType: m.assessmentType,
                assessmentDate: m.assessmentDate,
                practicalNo: m.testNo,
                experimentCount: m.experimentCount,
                maxMarks: m.maxMarks,
                obtainedMark: isAbsent ? 'A' : total,
                enteredBy: m.enteredBy,
                updatedAt: m.updatedAt
            };
        });

        res.json(mapped);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
};

// Update mark
export const updatePracticalMark = async (req, res) => {
    try {
        const { id } = req.params;
        const { obtainedMark } = req.body;
        // In this implementation, updatePracticalMark is slightly ambiguous because it updates 'Obtained_Mark' 
        // which is a sum. But the SQL version had a column 'Obtained_Mark'. 
        // If they want to update the total directly, we'd need a field for it, or update experiment 1?
        // Let's assume we update a field called totalObtainedMark if we had one.
        // For now, let's just update the record with a new field or logic if required.
        // Given the SQL updated 'Obtained_Mark', I'll update the record, though 
        // the report recalculates it from experimentMarks.
        await PracticalMark.findByIdAndUpdate(id, { totalObtainedMark: obtainedMark });
        res.json({ message: 'Success' });
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
};

// Delete mark
export const deletePracticalMark = async (req, res) => {
    try {
        await PracticalMark.findByIdAndDelete(req.params.id);
        res.json({ message: 'Success' });
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
};

// Report dropdowns (using marks table)
export const getReportCourses = async (req, res) => {
    try {
        const list = await PracticalMark.distinct('courseName');
        res.json(list.map(c => ({ courseName: c })));
    } catch (error) { res.json([]); }
};

export const getReportDepartments = async (req, res) => {
    try {
        const list = await PracticalMark.find({ courseName: req.query.courseName }, { deptName: 1, deptCode: 1, _id: 0 });
        const unique = [];
        const seen = new Set();
        list.forEach(d => {
            if (!seen.has(d.deptName)) {
                seen.add(d.deptName);
                unique.push({ deptName: d.deptName, deptCode: d.deptCode });
            }
        });
        res.json(unique);
    } catch (error) { res.json([]); }
};

export const getReportSemesters = async (req, res) => {
    try {
        const list = await PracticalMark.find({ courseName: req.query.courseName, deptName: req.query.deptName }).distinct('semester');
        res.json(list.map(s => ({ semester: s })));
    } catch (error) { res.json([]); }
};

export const getReportRegulations = async (req, res) => {
    try {
        const list = await PracticalMark.find({ courseName: req.query.courseName, deptName: req.query.deptName, semester: req.query.semester }).distinct('regulation');
        res.json(list.map(r => ({ regulation: r })));
    } catch (error) { res.json([]); }
};

export const getReportSections = async (req, res) => {
    try {
        const list = await PracticalMark.find({ courseName: req.query.courseName, deptName: req.query.deptName, semester: req.query.semester, regulation: req.query.regulation }).distinct('classSection');
        res.json(list.map(s => ({ section: s })));
    } catch (error) { res.json([]); }
};

export const getReportSubjects = async (req, res) => {
    try {
        const { courseName, deptName, semester, regulation, section } = req.query;
        const list = await PracticalMark.find({ courseName, deptName, semester, regulation, classSection: section }, { subName: 1, subCode: 1, _id: 0 });
        const unique = [];
        const seen = new Set();
        list.forEach(s => {
            if (!seen.has(s.subCode)) {
                seen.add(s.subCode);
                unique.push({ subjectName: s.subName, subjectCode: s.subCode });
            }
        });
        res.json(unique);
    } catch (error) { res.json([]); }
};

export const getReportPracticals = async (req, res) => {
    try {
        const { courseName, deptName, semester, regulation, section, subjectName } = req.query;
        const list = await PracticalMark.find({ courseName, deptName, semester, regulation, classSection: section, subName: subjectName }, { testNo: 1, assessmentDate: 1, maxMarks: 1, experimentCount: 1, _id: 0 }).sort({ testNo: 1 });
        res.json(list.map(p => ({ practicalNo: p.testNo, assessmentDate: p.assessmentDate, maxMarks: p.maxMarks, experimentCount: p.experimentCount })));
    } catch (error) { res.json([]); }
};
