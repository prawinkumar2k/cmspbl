/**
 * Student Master Controller — MongoDB version
 * Replaces both student_master + student_education_details tables
 * Education details are EMBEDDED in the Student document
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Student from '../models/Student.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Sanitize helper (preserve from original) ──────────────────────────────────
const sanitize = (v) => {
    if (v === null || v === undefined || v === '' || v === 'null' || v === 'undefined') return null;
    if (typeof v === 'string') {
        const trimmed = v.trim();
        if (!isNaN(trimmed) && trimmed !== '') return Number(trimmed);
        return trimmed;
    }
    return v;
};

const safeJsonParse = (v) => {
    if (!v) return [];
    if (typeof v === 'object') return Array.isArray(v) ? v : [];
    try { return JSON.parse(v); } catch { return []; }
};

// ── Build embedded education sub-document from request body ───────────────────
const buildEducationDoc = (data) => {
    let educationSections = data.educationSections || { sslc: true, iti: false, vocational: false, hsc: false };
    if (typeof educationSections === 'string') {
        try { educationSections = JSON.parse(educationSections); } catch { educationSections = { sslc: true, iti: false, vocational: false, hsc: false }; }
    }

    const makeSubjects = (arr, count = 5) =>
        arr.slice(0, count).map(s => ({ subject: s?.subject || null, maxMark: sanitize(s?.max), obtainedMark: sanitize(s?.marks) }));

    const makeAttempts = (arr, count = 5) =>
        arr.slice(0, count).map(a => ({ marksheetNo: a?.marksheetNo || null, registerNo: a?.registerNo || null, month: a?.month || null, year: a?.year || null, totalMarks: sanitize(a?.totalMarks) }));

    const sslcSubjects = safeJsonParse(data.sslcSubjects);
    const sslcAttempts = safeJsonParse(data.sslcExaminationAttempts);
    const itiSubjects = safeJsonParse(data.itiSubjects);
    const itiAttempts = safeJsonParse(data.itiExaminationAttempts);
    const vocSubjects = safeJsonParse(data.vocSubjects);
    const hscSubjects = safeJsonParse(data.hscSubjects);

    return {
        hasSslc: !!educationSections.sslc,
        hasIti: !!educationSections.iti,
        hasVocational: !!educationSections.vocational,
        hasHsc: !!educationSections.hsc,

        sslc: educationSections.sslc ? {
            schoolName: data.sslcSchoolName || null,
            board: data.sslcBoard || null,
            yearOfPassing: data.sslcYearOfPassing || null,
            registerNo: data.sslcRegisterNo || null,
            marksheetNo: data.sslcMarksheetNo || null,
            subjects: makeSubjects(sslcSubjects),
            totalMax: sanitize(data.sslcTotalMax),
            totalObtained: sanitize(data.sslcTotalMarks),
            percentage: sanitize(data.sslcPercentage),
            attempts: makeAttempts(sslcAttempts),
        } : undefined,

        iti: educationSections.iti ? {
            schoolName: data.itiSchoolName || null,
            yearOfPassing: data.itiYearOfPassing || null,
            subjects: makeSubjects(itiSubjects),
            totalMax: sanitize(data.itiTotalMax),
            totalObtained: sanitize(data.itiTotalMarks),
            percentage: sanitize(data.itiPercentage),
            attempts: makeAttempts(itiAttempts),
        } : undefined,

        vocational: educationSections.vocational ? {
            schoolName: data.vocSchoolName || null,
            yearOfPassing: data.vocYearOfPassing || null,
            subjects: makeSubjects(vocSubjects),
            totalMax: sanitize(data.vocTotalMax),
            totalObtained: sanitize(data.vocTotalMarks),
            percentage: sanitize(data.vocPercentage),
        } : undefined,

        hsc: educationSections.hsc ? {
            schoolName: data.hscSchoolName || null,
            board: data.hscBoard || null,
            yearOfPassing: data.hscYearOfPassing || null,
            registerNo: data.hscRegisterNo || null,
            examType: data.hscExamType || null,
            majorStream: data.hscMajorStream || null,
            subjects: makeSubjects(hscSubjects, 6),
            totalMax: sanitize(data.hscTotalMax),
            totalObtained: sanitize(data.hscTotalMarks),
            percentage: sanitize(data.hscPercentage),
            cutoff: sanitize(data.hscCutoff),
        } : undefined,
    };
};

// ── Build main student fields from request body ───────────────────────────────
const buildStudentDoc = (data, photoPath = '') => ({
    applicationNo: data.Application_No,
    stdUid: data.Std_UID || null,
    registerNumber: data.Register_Number || null,
    studentName: data.Student_Name,
    gender: data.Gender,
    dob: data.Dob,
    age: sanitize(data.Age),
    stdEmail: data.Std_Email || null,
    photoPath: photoPath,
    fatherName: data.Father_Name || null, fatherMobile: data.Father_Mobile || null,
    fatherOccupation: data.Father_Occupation || null, motherName: data.Mother_Name || null,
    motherMobile: data.Mother_Mobile || null, motherOccupation: data.Mother_Occupation || null,
    guardianName: data.Guardian_Name || null, guardianMobile: data.Guardian_Mobile || null,
    guardianOccupation: data.Guardian_Occupation || null, guardianRelation: data.Guardian_Relation || null,
    bloodGroup: data.Blood_Group || null, nationality: data.Nationality || null,
    religion: data.Religion || null, community: data.Community || null,
    caste: data.Caste || null,
    physicallyChallenged: data.Physically_Challenged || null,
    maritalStatus: data.Marital_Status || null,
    aadhaarNo: data.Aadhaar_No || null, panNo: data.Pan_No || null,
    motherTongue: data.Mother_Tongue || null, emisNumber: data.emisNumber || null,
    mediumOfInstruction: data.mediumOfInstruction || null,
    fatherAnnualIncome: sanitize(data.fatherAnnualIncome),
    motherAnnualIncome: sanitize(data.motherAnnualIncome),
    guardianAnnualIncome: sanitize(data.guardianAnnualIncome),
    permanentDistrict: data.Permanent_District || null, permanentState: data.Permanent_State || null,
    permanentPincode: data.Permanent_Pincode || null, permanentAddress: data.Permanent_Address || null,
    currentDistrict: data.Current_District || null, currentState: data.Current_State || null,
    currentPincode: data.Current_Pincode || null, currentAddress: data.Current_Address || null,
    bankName: data.bankName || null, bankBranch: data.bankBranch || null,
    accountNumber: data.accountNumber || null, ifscCode: data.ifscCode || null,
    micrCode: data.micrCode || null,
    scholarship: data.Scholarship || null, firstGraduate: data.First_Graduate || null,
    bankLoan: data.Bank_Loan || null, modeOfJoining: data.Mode_Of_Joinig || null,
    reference: data.Reference || null, present: data.Present || null,
    courseName: data.Course_Name || null, deptName: data.Dept_Name || null,
    deptCode: data.Dept_Code || null, semester: data.Semester || null,
    year: data.Year || null, admissionDate: data.Admission_Date || null,
    hostelRequired: data.Hostel_Required || null, transportRequired: data.Transport_Required || null,
    admissionStatus: data.Admission_Status || 'Admitted',
    studentMobile: data.Student_Mobile || null, rollNumber: data.Roll_Number || null,
    regulation: data.Regulation || null, classTeacher: data.Class_Teacher || null,
    class: data.Class || null, allocatedQuota: data.Allocated_Quota || null,
    academicYear: data.Academic_Year || null,
});

// ── Add Student ───────────────────────────────────────────────────────────────

export const addStudent = async (req, res) => {
    try {
        console.log('========== ADD STUDENT REQUEST ==========');
        const data = req.body;
        let photoPath = '';

        if (req.file) {
            photoPath = req.file.filename;
            console.log('📷 Photo saved as:', photoPath);
        } else {
            console.log('⚠️ No photo provided for new student');
        }

        // ✅ MongoDB: single document insert with embedded education
        // No second INSERT needed — education is embedded!
        const studentDoc = {
            ...buildStudentDoc(data, photoPath),
            education: buildEducationDoc(data),
        };

        const result = await Student.create(studentDoc);
        console.log('✅✅ STUDENT SAVED COMPLETELY - Application_No:', data.Application_No);
        res.json({ success: true, id: result._id });

    } catch (err) {
        console.error('❌❌ ERROR IN addStudent:', err.message);
        if (err.code === 11000) return res.status(400).json({ error: 'Application number or register number already exists' });
        res.status(500).json({ error: err.message });
    }
};

// ── Get Students ──────────────────────────────────────────────────────────────

export const getStudents = async (req, res) => {
    try {
        const filter = {};
        if (req.query.deptCode) filter.deptCode = req.query.deptCode;
        if (req.query.semester) filter.semester = req.query.semester;
        if (req.query.year) filter.year = req.query.year;
        if (req.query.academicYear) filter.academicYear = req.query.academicYear;
        if (req.query.admissionStatus) filter.admissionStatus = req.query.admissionStatus;
        if (req.query.regulation) filter.regulation = req.query.regulation;

        const students = await Student.find(filter).sort({ studentName: 1 });
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ── Get student by Application No ────────────────────────────────────────────

export const getStudentByAppNo = async (req, res) => {
    try {
        const student = await Student.findOne({ applicationNo: req.params.appNo });
        if (!student) return res.status(404).json({ error: 'Student not found' });
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ── Get student by Register Number ───────────────────────────────────────────

export const getStudentByRegNo = async (req, res) => {
    try {
        const student = await Student.findOne({ registerNumber: req.params.regNo });
        if (!student) return res.status(404).json({ error: 'Student not found' });
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ── Edit Student ──────────────────────────────────────────────────────────────

export const editStudent = async (req, res) => {
    try {
        const appNo = req.params.appNo || req.params.id;
        const data = req.body;
        console.log('========== EDIT STUDENT REQUEST ==========');
        console.log('📝 Editing student AppNo:', appNo);

        const existing = await Student.findOne({ applicationNo: appNo });
        if (!existing) return res.status(404).json({ error: 'Student not found' });

        let photoPath = existing.photoPath;

        if (req.file) {
            // Delete old photo if exists
            if (existing.photoPath) {
                const oldPath = path.join(__dirname, '../../uploads', existing.photoPath);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                    console.log('🗑️ Old photo deleted:', existing.photoPath);
                }
            }
            photoPath = req.file.filename;
            console.log('📷 New photo saved as:', photoPath);
        }

        // ✅ MongoDB: single findOneAndUpdate with embedded education update
        const updateDoc = {
            ...buildStudentDoc(data, photoPath),
            education: buildEducationDoc(data),
        };

        await Student.findOneAndUpdate(
            { applicationNo: appNo },
            { $set: updateDoc },
            { new: true }
        );

        console.log('✅✅ STUDENT UPDATED COMPLETELY - Application_No:', appNo);
        res.json({ success: true });

    } catch (err) {
        console.error('❌❌ ERROR IN editStudent:', err.message);
        res.status(500).json({ error: err.message });
    }
};

// ── Delete Student ────────────────────────────────────────────────────────────

export const deleteStudent = async (req, res) => {
    try {
        const appNo = req.params.appNo || req.params.id;

        const student = await Student.findOne({ applicationNo: appNo });
        if (!student) return res.status(404).json({ error: 'Student not found' });

        // Delete photo if exists
        if (student.photoPath) {
            const photoFilePath = path.join(__dirname, '../../uploads', student.photoPath);
            if (fs.existsSync(photoFilePath)) {
                fs.unlinkSync(photoFilePath);
                console.log('🗑️ Student photo deleted:', student.photoPath);
            }
        }

        await Student.findOneAndDelete({ applicationNo: appNo });
        console.log('✅ Student deleted - Application_No:', appNo);
        res.json({ success: true, message: 'Student deleted successfully' });

    } catch (err) {
        console.error('❌ Error deleting student:', err.message);
        res.status(500).json({ error: err.message });
    }
};

// ── Check if Application No exists ───────────────────────────────────────────

export const checkApplicationNo = async (req, res) => {
    try {
        const { appNo, excludeId } = req.query;
        if (!appNo) return res.json({ exists: false });
        const filter = { applicationNo: appNo };
        if (excludeId) filter._id = { $ne: excludeId };
        const existing = await Student.findOne(filter).select('_id');
        res.json({ exists: !!existing });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ── Check if Register Number exists ──────────────────────────────────────────

export const checkRegisterNo = async (req, res) => {
    try {
        const { regNo, excludeId } = req.query;
        if (!regNo) return res.json({ exists: false });
        const filter = { registerNumber: regNo };
        if (excludeId) filter._id = { $ne: excludeId };
        const existing = await Student.findOne(filter).select('_id');
        res.json({ exists: !!existing });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ── Get students by department ────────────────────────────────────────────────

export const getStudentsByDept = async (req, res) => {
    try {
        const { deptCode, semester, academicYear } = req.query;
        const filter = { admissionStatus: 'Admitted' };
        if (deptCode) filter.deptCode = deptCode;
        if (semester) filter.semester = semester;
        if (academicYear) filter.academicYear = academicYear;

        const students = await Student.find(filter)
            .select('applicationNo registerNumber studentName rollNumber deptCode deptName semester year')
            .sort({ rollNumber: 1, studentName: 1 });

        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ── Get education details by Application No ───────────────────────────────────
// Education is embedded — just return the education field

export const getEducationDetails = async (req, res) => {
    try {
        const student = await Student.findOne(
            { applicationNo: req.params.appNo },
            { education: 1, applicationNo: 1 }
        );
        if (!student) return res.status(404).json({ error: 'Student not found' });
        res.json(student.education);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ── Get student strength list ─────────────────────────────────────────────────

export const getStrengthList = async (req, res) => {
    try {
        const { academicYear } = req.query;
        const filter = { admissionStatus: 'Admitted' };
        if (academicYear) filter.academicYear = academicYear;

        // ✅ MongoDB aggregation for grouped counts
        const strength = await Student.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: { deptCode: '$deptCode', semester: '$semester' },
                    deptName: { $first: '$deptName' },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    deptCode: '$_id.deptCode',
                    semester: '$_id.semester',
                    deptName: 1,
                    count: 1
                }
            },
            { $sort: { deptName: 1, semester: 1 } }
        ]);

        res.json(strength);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ── Bulk update admission status ──────────────────────────────────────────────

export const updateAdmissionStatus = async (req, res) => {
    try {
        const { applicationNos, status } = req.body;
        if (!applicationNos || !applicationNos.length) {
            return res.status(400).json({ error: 'No application numbers provided' });
        }

        const result = await Student.updateMany(
            { applicationNo: { $in: applicationNos } },
            { $set: { admissionStatus: status } }
        );

        res.json({ success: true, updated: result.modifiedCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ── Search students ───────────────────────────────────────────────────────────

export const searchStudents = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) return res.json([]);

        // ✅ MongoDB regex-based text search
        const regex = new RegExp(q, 'i');
        const students = await Student.find({
            $or: [
                { studentName: regex },
                { registerNumber: regex },
                { applicationNo: regex },
                { studentMobile: regex }
            ],
            admissionStatus: 'Admitted'
        })
            .select('applicationNo registerNumber studentName deptName semester year')
            .limit(20)
            .sort({ studentName: 1 });

        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ── Missing Metadata / Helper Exports ────────────────────────────────────────

export const getMetaData = async (req, res) => {
    try {
        // Return distinct lists for dropdowns
        const courses = await Student.distinct('courseName');
        const depts = await Student.aggregate([
            { $group: { _id: '$deptCode', deptName: { $first: '$deptName' } } },
            { $project: { _id: 0, Dept_Code: '$_id', Dept_Name: '$deptName' } }
        ]);
        const semesters = await Student.distinct('semester');
        const regulations = await Student.distinct('regulation');

        res.json({
            courses: courses.map(c => ({ Course_Name: c })),
            departments: depts,
            semesters: semesters.map(s => ({ Semester: s })),
            regulations: regulations.map(r => ({ Regulation: r }))
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getCommunityMaster = async (req, res) => {
    // Static list to match masterDataController
    const communities = ['OC', 'BC', 'BCM', 'BCO', 'BC(Others)', 'MBC', 'DNC', 'SC', 'SCA', 'ST', 'Others'];
    res.json(communities.map(c => ({ Community: c })));
};

export const getLatestSerials = async (req, res) => {
    try {
        const { deptCode } = req.query;
        const filter = deptCode ? { deptCode } : {};

        const lastApp = await Student.findOne(filter).sort({ applicationNo: -1 }).select('applicationNo');
        const lastStd = await Student.findOne(filter).sort({ registerNumber: -1 }).select('registerNumber');

        res.json({
            latestApplicationNo: lastApp ? lastApp.applicationNo : null,
            latestStudentId: lastStd ? lastStd.registerNumber : null
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getNextIds = async (req, res) => {
    // Basic implementation: find max and add 1
    try {
        const last = await Student.findOne().sort({ registerNumber: -1 }).select('registerNumber');
        const nextId = last && !isNaN(last.registerNumber) ? parseInt(last.registerNumber) + 1 : 1000;
        res.json({ nextId });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const debugSchema = async (req, res) => {
    // Return a sample document to inspect structure
    try {
        const sample = await Student.findOne();
        res.json({
            modelName: 'Student',
            collection: 'students',
            sample: sample
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getStudentImage = async (req, res) => {
    try {
        const { filename } = req.params;
        const imagePath = path.join(__dirname, '../../uploads/student/', filename);
        if (fs.existsSync(imagePath)) {
            res.sendFile(imagePath);
        } else {
            res.status(404).json({ error: 'Image not found' });
        }
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getStudentEducationByAppNo = async (req, res) => {
    try {
        const student = await Student.findOne({ applicationNo: req.params.appNo }).select('education');
        if (!student) return res.status(404).json({ error: 'Student not found' });
        res.json(student.education || {});
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const deleteStudentEducationByAppNo = async (req, res) => {
    try {
        await Student.findOneAndUpdate(
            { applicationNo: req.params.appNo },
            { $unset: { education: 1 } }
        );
        res.json({ success: true, message: 'Education details cleared' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

