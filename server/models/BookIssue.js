import mongoose from 'mongoose';

const bookIssueSchema = new mongoose.Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    accessionNo: { type: String, index: true },
    bookTitle: { type: String },
    borrowerType: { type: String, enum: ['Student', 'Staff'], default: 'Student' },
    borrowerId: { type: String, required: true, index: true },   // Register_Number or Staff_ID
    borrowerName: { type: String },
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date },
    returnDate: { type: Date, default: null },
    fineAmount: { type: Number, default: 0 },
    isReturned: { type: Boolean, default: false }
}, { timestamps: true });

bookIssueSchema.index({ borrowerId: 1, isReturned: 1 });
bookIssueSchema.index({ dueDate: 1, isReturned: 1 });

export default mongoose.model('BookIssue', bookIssueSchema);
