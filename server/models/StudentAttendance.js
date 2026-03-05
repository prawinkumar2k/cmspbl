import mongoose from 'mongoose';

/**
 * StudentAttendance model — replaces student_attendance_entry table
 * Also replaces overall_att_date_wise and dept_attendance_date_wise VIEWs
 * (those become aggregation pipelines on this collection)
 */
const studentAttendanceSchema = new mongoose.Schema({
    registerNumber: { type: String, required: true, index: true },
    studentName: { type: String },
    deptCode: { type: String, index: true },
    deptName: { type: String },
    semester: { type: String },
    year: { type: String },
    academicYear: { type: String },
    subjectCode: { type: String },
    subjectName: { type: String },
    attDate: { type: Date, required: true, index: true },
    attStatus: { type: String, required: true, enum: ['present', 'absent', 'onDuty', 'medicalLeave'], index: true },
    period: { type: String },  // period number (e.g., "1", "1,2")
    markedBy: { type: String },  // staff ID who marked
}, { timestamps: true });

// Critical compound indexes for dashboard & attendance queries
studentAttendanceSchema.index({ attDate: 1, attStatus: 1 });
studentAttendanceSchema.index({ registerNumber: 1, attDate: -1 });
studentAttendanceSchema.index({ deptCode: 1, attDate: 1 });
studentAttendanceSchema.index({ attDate: 1, deptCode: 1, attStatus: 1 });

export default mongoose.model('StudentAttendance', studentAttendanceSchema);
