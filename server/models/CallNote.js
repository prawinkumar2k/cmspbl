import mongoose from 'mongoose';

const callNoteSchema = new mongoose.Schema({
    role: { type: String },
    tenantId: { type: String },
    tenantName: { type: String },
    studentEqid: { type: String, index: true },
    studentName: { type: String },
    callNoteDate: { type: String },
    callNoteTime: { type: String },
    outcome: { type: String },
    callNotes: { type: String },
    nextFollowUp: { type: String }
}, { timestamps: true });

export default mongoose.model('CallNote', callNoteSchema);
