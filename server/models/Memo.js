import mongoose from 'mongoose';

const staffMemoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
    date: { type: Date },
    departments: { type: [String], default: [] },
    staff: { type: [String], default: [] },
}, { timestamps: true });

const studentMemoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
    date: { type: Date },
    courses: { type: [String], default: [] },
    departments: { type: [String], default: [] },
    students: { type: [String], default: [] },
    semester: { type: String },
    year: { type: String },
    section: { type: String },
}, { timestamps: true });

export const StaffMemo = mongoose.model('StaffMemo', staffMemoSchema);
export const StudentMemo = mongoose.model('StudentMemo', studentMemoSchema);
