import mongoose from 'mongoose';

/* exam_fee table — per-student exam fee record */
const examFeeSchema = new mongoose.Schema({
    regNo: { type: String, index: true },
    studName: { type: String },
    course: { type: String },
    sem: { type: String },
    fine: { type: Number, default: 0 },
    fee: { type: Number, default: 0 },
    totFee: { type: Number, default: 0 },
    sem1: { type: String, default: '' }, sem2: { type: String, default: '' },
    sem3: { type: String, default: '' }, sem4: { type: String, default: '' },
    sem5: { type: String, default: '' }, sem6: { type: String, default: '' },
    sem7: { type: String, default: '' }, sem8: { type: String, default: '' },
}, { timestamps: true });

/* exam_seat_plan_report — hall chart / theory name list */
const examSeatPlanSchema = new mongoose.Schema({
    examDate: { type: Date, index: true },
    dayOrder: { type: String },
    session: { type: String, index: true },
    hallCode: { type: String },
    hallName: { type: String },
    seatLabel: { type: String },
    colLetter: { type: String },
    registerNumber: { type: String },
    studentName: { type: String },
    subjectCode: { type: String },
    subjectName: { type: String },
    deptCode: { type: String },
    deptName: { type: String },
    deptShort: { type: String },
    semester: { type: Number },
}, { timestamps: false });

examSeatPlanSchema.index({ examDate: 1, session: 1 });

/* exam_timetable — checklist report */
const examTimetableSchema = new mongoose.Schema({
    deptCode: { type: String, index: true },
    deptName: { type: String },
    subCode: { type: String, index: true },
    subName: { type: String },
    examDate: { type: String }, // Using String to match other date formats like YYYY-MM-DD
    dayOrder: { type: String },
    session: { type: String, index: true },
    regulation: { type: String },
    semester: { type: String },
    year: { type: String },
    qpc: { type: String },
    elective: { type: String },
    electiveNo: { type: String },
    regularCount: { type: Number, default: 0 },
    arrearCount: { type: Number, default: 0 }
}, { timestamps: true });

/* exam_timetable_student_list */
const examStudentListSchema = new mongoose.Schema({
    deptCode: { type: String, index: true },
    registerNumber: { type: String },
    subCode: { type: String },
    examType: { type: String, enum: ['R', 'A'] }, // Regular / Arrear
}, { timestamps: true });

export const ExamFee = mongoose.model('ExamFee', examFeeSchema);
export const ExamSeatPlan = mongoose.model('ExamSeatPlan', examSeatPlanSchema);
export const ExamTimetable = mongoose.model('ExamTimetable', examTimetableSchema);
export const ExamStudentList = mongoose.model('ExamStudentList', examStudentListSchema);

/* practical_exam_timetable — scheduling report */
const practicalExamTimetableSchema = new mongoose.Schema({
    deptCode: { type: String, index: true },
    deptName: { type: String },
    subCode: { type: String, index: true },
    subName: { type: String },
    examDate: { type: String },
    dayOrder: { type: String },
    session: { type: String, index: true },
    startTime: { type: String },
    endTime: { type: String },
    regulation: { type: String },
    semester: { type: String },
    year: { type: String },
    qpc: { type: String },
    elective: { type: String },
    electiveNo: { type: String },
    regularCount: { type: Number, default: 0 },
    arrearCount: { type: Number, default: 0 }
}, { timestamps: true });

export const PracticalExamTimetable = mongoose.model('PracticalExamTimetable', practicalExamTimetableSchema);

/* hall_master table */
const hallMasterSchema = new mongoose.Schema({
    hallCode: { type: String, required: true, unique: true, index: true },
    hallName: { type: String, required: true },
    totalRows: { type: Number, default: 0 },
    totalColumns: { type: Number, default: 0 },
    seatingCapacity: { type: Number, default: 0 },
    blockName: { type: String },
    floorNumber: { type: String },
    hallType: { type: String },
    status: { type: String, default: 'active', index: true },
}, { timestamps: true });

/* exam_generation table */
const examGenerationSchema = new mongoose.Schema({
    examDate: { type: Date, required: true, index: true },
    session: { type: String, required: true, index: true },
    subjectCode: { type: String, required: true, index: true },
    subjectName: { type: String },
    deptCode: { type: String, required: true, index: true },
    deptName: { type: String },
    semester: { type: String },
    regulation: { type: String },
    hallCode: { type: String, required: true, index: true },
    hallName: { type: String },
    hallCapacity: { type: Number },
    row: { type: Number },
    col: { type: Number },
    registerNumber: { type: String, required: true, index: true },
    studentName: { type: String },
    seatNo: { type: String },
}, { timestamps: true });

examGenerationSchema.index({ examDate: 1, session: 1, hallCode: 1, row: 1, col: 1 }, { unique: true });
examGenerationSchema.index({ examDate: 1, session: 1, subjectCode: 1, registerNumber: 1 }, { unique: true });

export const HallMaster = mongoose.model('HallMaster', hallMasterSchema);
export const ExamGeneration = mongoose.model('ExamGeneration', examGenerationSchema);

/* exam_attendance table */
const examAttendanceSchema = new mongoose.Schema({
    examDate: { type: Date, required: true, index: true },
    session: { type: String, required: true, index: true },
    subjectCode: { type: String, required: true, index: true },
    subjectName: { type: String },
    deptCode: { type: String, required: true, index: true },
    deptName: { type: String },
    semester: { type: String },
    regulation: { type: String },
    hallCode: { type: String, required: true, index: true },
    hallName: { type: String },
    hallCapacity: { type: Number },
    seatNo: { type: String },
    row: { type: Number },
    col: { type: Number },
    registerNumber: { type: String, required: true, index: true },
    studentName: { type: String },
    attendanceStatus: { type: String }, // Present / Absent
}, { timestamps: true });

export const ExamAttendance = mongoose.model('ExamAttendance', examAttendanceSchema);

/* univ_mark_entered table */
const univMarkSchema = new mongoose.Schema({
    registerNumber: { type: String, required: true, index: true },
    studentName: { type: String },
    deptCode: { type: String, index: true },
    semester: { type: String },
    regulation: { type: String },
    subCode: { type: String, index: true },
    subName: { type: String },
    internalMark: { type: String }, // Present as String to allow 'A'
    externalMark: { type: String },
    totalMark: { type: String },
    status: { type: String }, // 'P' or 'F'
    attemptLevel: { type: String },
    academicYear: { type: String, index: true },
    enteredBy: { type: String }
}, { timestamps: true });

export const UnivMark = mongoose.model('UnivMark', univMarkSchema);
