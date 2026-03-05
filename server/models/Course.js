import mongoose from 'mongoose';

/**
 * Course model — replaces course_details table
 * Used as "branch" in many parts of the system
 */
const courseSchema = new mongoose.Schema({
    courseMode: { type: String },
    deptCode: { type: String, required: true, unique: true, index: true },
    deptName: { type: String, required: true },
    yearOfCourse: { type: Number },
    courseName: { type: String },
    deptOrder: { type: Number },
    aicteApproval: { type: String },
    aicteApprovalNo: { type: String },

    // Semester Codes
    s1: String, s2: String, s3: String, s4: String,
    s5: String, s6: String, s7: String, s8: String,

    // Regulation Codes
    r1: String, r2: String, r3: String, r4: String,
    r5: String, r6: String, r7: String, r8: String,

    // Seat Distribution
    intake: Number, addlSeats: Number,
    oc: Number, bc: Number, bco: Number, bcm: Number,
    mbcDnc: Number, sc: Number, sca: Number, st: Number,
    other: Number, goiQuota: Number, mgtQuota: Number,

    insType: { type: String },
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
