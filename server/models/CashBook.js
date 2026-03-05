import mongoose from 'mongoose';

const cashBookSchema = new mongoose.Schema({
    date: { type: Date, required: true, index: true },
    voucher: { type: String },
    type: { type: String }, // Income / Expense / etc.
    detail: { type: String },
    category: { type: String, index: true },
    amount: { type: Number, required: true },
    mode: { type: String }, // Cash / Cheque / etc.
}, { timestamps: true });

cashBookSchema.index({ date: -1 });

export const CashBook = mongoose.model('CashBook', cashBookSchema);
