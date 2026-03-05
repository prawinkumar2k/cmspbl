import mongoose from 'mongoose';

/* assessment_configuration table */
const assessmentConfigSchema = new mongoose.Schema({
    assessmentType: { type: String, required: true, index: true }, // e.g., Practical, Theory, Assignment, Unit Test
    courseName: { type: String, required: true },
    deptName: { type: String, required: true },
    deptCode: { type: String, required: true, index: true },
    semester: { type: String, required: true },
    regulation: { type: String, required: true },
    classSection: { type: String, required: true },
    subName: { type: String, required: true },
    subCode: { type: String, required: true, index: true },
    testNo: { type: Number, required: true },
    assessmentDate: { type: String, required: true },
    maxMarks: { type: Number },
    experimentCount: { type: Number, default: 0 },
}, { timestamps: true });

assessmentConfigSchema.index({ assessmentDate: 1, assessmentType: 1, subCode: 1, classSection: 1, testNo: 1 }, { unique: true });

/* assessment_students table */
const assessmentStudentSchema = new mongoose.Schema({
    registerNumber: { type: String, required: true, index: true },
    studentName: { type: String },
    courseName: { type: String },
    deptName: { type: String },
    deptCode: { type: String },
    semester: { type: String },
    regulation: { type: String },
    classSection: { type: String },
    assessmentType: { type: String },
    testNo: { type: Number },
    assessmentDate: { type: String },
}, { timestamps: true });

assessmentStudentSchema.index({ registerNumber: 1, assessmentType: 1, testNo: 1, assessmentDate: 1 }, { unique: true });

/* practical_mark table */
const practicalMarkSchema = new mongoose.Schema({
    registerNumber: { type: String, required: true, index: true },
    studentName: { type: String },
    courseName: { type: String },
    deptName: { type: String },
    deptCode: { type: String },
    semester: { type: String },
    regulation: { type: String },
    classSection: { type: String },
    subCode: { type: String, index: true },
    subName: { type: String },
    assessmentType: { type: String, default: 'Practical' },
    assessmentDate: { type: String },
    testNo: { type: Number },
    maxMarks: { type: Number, default: 50 },
    experimentCount: { type: Number },
    enteredBy: { type: String },
    experimentMarks: {
        type: Map,
        of: String, // 'A' or '10' etc
        default: {}
    }
}, { timestamps: true });

practicalMarkSchema.index({ registerNumber: 1, subCode: 1, assessmentDate: 1, testNo: 1 }, { unique: true });

/* unit_test_mark_entered table */
const unitTestMarkSchema = new mongoose.Schema({
    registerNumber: { type: String, required: true, index: true },
    studentName: { type: String },
    courseName: { type: String },
    deptName: { type: String },
    deptCode: { type: String },
    semester: { type: String },
    regulation: { type: String },
    classSection: { type: String },
    subCode: { type: String, index: true },
    subName: { type: String },
    assessmentType: { type: String, default: 'Unit Test' },
    assessmentDate: { type: String },
    testNo: { type: Number },
    maxMarks: { type: Number },
    obtainedMark: { type: String }, // 'A' or string number
    enteredBy: { type: String },
}, { timestamps: true });

unitTestMarkSchema.index({ registerNumber: 1, subCode: 1, assessmentDate: 1, testNo: 1 }, { unique: true });

/* assignment_mark_entered table */
const assignmentMarkSchema = new mongoose.Schema({
    registerNumber: { type: String, required: true, index: true },
    studentName: { type: String },
    courseName: { type: String },
    deptName: { type: String },
    deptCode: { type: String },
    semester: { type: String },
    regulation: { type: String },
    classSection: { type: String },
    subCode: { type: String, index: true },
    subName: { type: String },
    assessmentType: { type: String, default: 'Assignment' },
    assessmentDate: { type: String },
    testNo: { type: Number },
    maxMarks: { type: Number },
    obtainedMark: { type: String }, // 'A' or string number
    enteredBy: { type: String },
}, { timestamps: true });

assignmentMarkSchema.index({ registerNumber: 1, subCode: 1, assessmentDate: 1, testNo: 1 }, { unique: true });

/* status tracker */
const assessmentMarkStatusSchema = new mongoose.Schema({
    courseName: { type: String },
    deptCode: { type: String },
    deptName: { type: String },
    semester: { type: String },
    regulation: { type: String },
    classSection: { type: String },
    subCode: { type: String },
    assessmentType: { type: String },
    testNo: { type: Number },
    assessmentDate: { type: String },
    isEntered: { type: Boolean, default: true }
}, { timestamps: true });

assessmentMarkStatusSchema.index({ subCode: 1, testNo: 1, assessmentDate: 1, assessmentType: 1 }, { unique: true });

export const AssessmentConfig = mongoose.model('AssessmentConfig', assessmentConfigSchema);
export const AssessmentStudent = mongoose.model('AssessmentStudent', assessmentStudentSchema);
export const PracticalMark = mongoose.model('PracticalMark', practicalMarkSchema);
export const UnitTestMark = mongoose.model('UnitTestMark', unitTestMarkSchema);
export const AssignmentMark = mongoose.model('AssignmentMark', assignmentMarkSchema);
export const AssessmentMarkStatus = mongoose.model('AssessmentMarkStatus', assessmentMarkStatusSchema);
// For compatibility with old practical code:
export const PracticalMarkStatus = AssessmentMarkStatus;
