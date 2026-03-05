import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
    purchaseId: { type: String, required: true, unique: true, index: true },
    date: { type: String, required: true, index: true },
    productName: { type: String, required: true, index: true },
    brandName: { type: String },
    companyVendor: { type: String },
    purchaseOrderNo: { type: String },
    orderDate: { type: String },
    dcNo: { type: String },
    billNo: { type: String },
    billDate: { type: String },
    qty: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
    vatApplied: { type: Boolean, default: false },
    taxApplied: { type: Boolean, default: false },
    totalAmount: { type: Number, default: 0 },
    currentStock: { type: Number },
    totalStock: { type: Number }
}, { timestamps: true });

export default mongoose.model('Purchase', purchaseSchema);
