import mongoose from 'mongoose';

const receiveLetterSchema = new mongoose.Schema({
    letterId: { type: String, index: true },
    date: { type: String, required: true, index: true },
    sender: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, required: true },
    replay: { type: String, required: true },
    receivedDate: { type: String },
    receivedBy: { type: String },
    priority: { type: String, default: 'Normal' },
    department: { type: String }
}, { timestamps: true });

export default mongoose.model('ReceiveLetter', receiveLetterSchema);
