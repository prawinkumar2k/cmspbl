import mongoose from 'mongoose';

/* Each doc = one staff member's full allocation for a semester */
const subAlloc = (n) => ({
    [`sub${n}Name`]: { type: String, default: null },
    [`sub${n}Code`]: { type: String, default: null },
    [`sub${n}DeptCode`]: { type: String, default: null },
    [`sub${n}DeptName`]: { type: String, default: null },
    [`sub${n}Semester`]: { type: Number, default: null },
    [`sub${n}Regulation`]: { type: String, default: null },
});

const subjectAllocationSchema = new mongoose.Schema({
    staffId: { type: String, required: true, index: true },
    staffName: { type: String },
    academicYear: { type: String, index: true },
    semType: { type: String },
    courseName: { type: String },
    deptName: { type: String },
    deptCode: { type: String, index: true },
    semester: { type: Number },
    regulation: { type: String },
    ...subAlloc(1), ...subAlloc(2), ...subAlloc(3), ...subAlloc(4),
    ...subAlloc(5), ...subAlloc(6), ...subAlloc(7),
}, { timestamps: true });

export default mongoose.model('SubjectAllocation', subjectAllocationSchema);
