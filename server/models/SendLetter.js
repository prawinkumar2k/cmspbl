import mongoose from 'mongoose';

const sendLetterSchema = new mongoose.Schema({
    date: { type: String, required: true, index: true },
    recipient: { type: String, required: true },
    message: { type: String, required: true },
    address: { type: String, required: true },
    typeOfPost: { type: String, required: true },
    cost: { type: Number, required: true },
    trackingNumber: { type: String },
    status: { type: String, default: 'Sent' }
}, { timestamps: true });

export default mongoose.model('SendLetter', sendLetterSchema);
