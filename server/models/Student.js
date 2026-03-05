import mongoose from 'mongoose';

// ─── Sub-schemas for embedded education details ──────────────────────────────

const subjectMarkSchema = new mongoose.Schema({
    subject: { type: String, default: null },
    maxMark: { type: Number, default: null },
    obtainedMark: { type: Number, default: null }
}, { _id: false });

const attemptSchema = new mongoose.Schema({
    marksheetNo: { type: String, default: null },
    registerNo: { type: String, default: null },
    month: { type: String, default: null },
    year: { type: String, default: null },
    totalMarks: { type: Number, default: null }
}, { _id: false });

const sslcSchema = new mongoose.Schema({
    schoolName: { type: String, default: null },
    board: { type: String, default: null },
    yearOfPassing: { type: String, default: null },
    registerNo: { type: String, default: null },
    marksheetNo: { type: String, default: null },
    subjects: { type: [subjectMarkSchema], default: [] },
    totalMax: { type: Number, default: null },
    totalObtained: { type: Number, default: null },
    percentage: { type: Number, default: null },
    attempts: { type: [attemptSchema], default: [] }
}, { _id: false });

const itiSchema = new mongoose.Schema({
    schoolName: { type: String, default: null },
    yearOfPassing: { type: String, default: null },
    subjects: { type: [subjectMarkSchema], default: [] },
    totalMax: { type: Number, default: null },
    totalObtained: { type: Number, default: null },
    percentage: { type: Number, default: null },
    attempts: { type: [attemptSchema], default: [] }
}, { _id: false });

const vocationalSchema = new mongoose.Schema({
    schoolName: { type: String, default: null },
    yearOfPassing: { type: String, default: null },
    subjects: { type: [subjectMarkSchema], default: [] },
    totalMax: { type: Number, default: null },
    totalObtained: { type: Number, default: null },
    percentage: { type: Number, default: null }
}, { _id: false });

const hscSchema = new mongoose.Schema({
    schoolName: { type: String, default: null },
    board: { type: String, default: null },
    yearOfPassing: { type: String, default: null },
    registerNo: { type: String, default: null },
    examType: { type: String, default: null },
    majorStream: { type: String, default: null },
    subjects: { type: [subjectMarkSchema], default: [] },
    totalMax: { type: Number, default: null },
    totalObtained: { type: Number, default: null },
    percentage: { type: Number, default: null },
    cutoff: { type: Number, default: null }
}, { _id: false });

// Embedded education details (replaces student_education_details table via JOIN)
const educationSchema = new mongoose.Schema({
    hasSslc: { type: Boolean, default: false },
    hasIti: { type: Boolean, default: false },
    hasVocational: { type: Boolean, default: false },
    hasHsc: { type: Boolean, default: false },
    sslc: { type: sslcSchema },
    iti: { type: itiSchema },
    vocational: { type: vocationalSchema },
    hsc: { type: hscSchema }
}, { _id: false });

// ─── Main Student Schema ─────────────────────────────────────────────────────

const studentSchema = new mongoose.Schema({
    // Identity
    applicationNo: { type: String, required: true, unique: true, index: true },
    stdUid: { type: String, default: null },
    registerNumber: { type: String, sparse: true, index: true },
    studentName: { type: String, required: true },
    gender: { type: String },
    dob: { type: String },
    age: { type: Number },
    stdEmail: { type: String },
    photoPath: { type: String, default: '' },

    // Family
    fatherName: { type: String }, fatherMobile: { type: String }, fatherOccupation: { type: String },
    motherName: { type: String }, motherMobile: { type: String }, motherOccupation: { type: String },
    guardianName: { type: String }, guardianMobile: { type: String },
    guardianOccupation: { type: String }, guardianRelation: { type: String },

    // Personal
    bloodGroup: { type: String }, nationality: { type: String },
    religion: { type: String }, community: { type: String }, caste: { type: String },
    physicallyChallenged: { type: String }, maritalStatus: { type: String },
    aadhaarNo: { type: String }, panNo: { type: String },
    motherTongue: { type: String }, emisNumber: { type: String },
    mediumOfInstruction: { type: String },
    fatherAnnualIncome: { type: Number }, motherAnnualIncome: { type: Number },
    guardianAnnualIncome: { type: Number },

    // Address
    permanentDistrict: { type: String }, permanentState: { type: String },
    permanentPincode: { type: String }, permanentAddress: { type: String },
    currentDistrict: { type: String }, currentState: { type: String },
    currentPincode: { type: String }, currentAddress: { type: String },

    // Bank
    bankName: { type: String }, bankBranch: { type: String },
    accountNumber: { type: String }, ifscCode: { type: String }, micrCode: { type: String },

    // Admission
    scholarship: { type: String }, firstGraduate: { type: String }, bankLoan: { type: String },
    modeOfJoining: { type: String }, reference: { type: String }, present: { type: String },
    courseName: { type: String }, deptName: { type: String }, deptCode: { type: String, index: true },
    semester: { type: String }, year: { type: String },
    admissionDate: { type: String }, hostelRequired: { type: String }, transportRequired: { type: String },
    admissionStatus: { type: String, default: 'Admitted', index: true },
    studentMobile: { type: String }, rollNumber: { type: String },
    regulation: { type: String }, classTeacher: { type: String },
    class: { type: String }, allocatedQuota: { type: String },
    academicYear: { type: String, index: true },

    // Arrear / Subject registrations
    arrearSem1: { type: String, default: null },
    arrearSem2: { type: String, default: null },
    arrearSem3: { type: String, default: null },
    arrearSem4: { type: String, default: null },
    arrearSem5: { type: String, default: null },
    arrearSem6: { type: String, default: null },
    arrearSem7: { type: String, default: null },
    arrearSem8: { type: String, default: null },

}, { timestamps: true });

// Compound indexes for common queries
studentSchema.index({ deptCode: 1, admissionStatus: 1 });
studentSchema.index({ academicYear: 1, deptCode: 1 });

export default mongoose.model('Student', studentSchema);
