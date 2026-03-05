import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    accessionNo: { type: String, unique: true, index: true },
    title: { type: String, required: true },
    author: { type: String },
    publisher: { type: String },
    edition: { type: String },
    year: { type: String },
    isbn: { type: String },
    subject: { type: String },
    department: { type: String },
    price: { type: Number },
    totalCopies: { type: Number, default: 1 },
    availableCopies: { type: Number, default: 1 },
    rack: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Book', bookSchema);
