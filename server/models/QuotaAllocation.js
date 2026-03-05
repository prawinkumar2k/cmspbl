import mongoose from 'mongoose';

const quotaAllocationSchema = new mongoose.Schema({
    type: { type: String, required: true }, // GQ, MQ
    courseName: { type: String },
    deptCode: { type: String, index: true },
    oc: { type: Number, default: 0 },
    bc: { type: Number, default: 0 },
    bco: { type: Number, default: 0 },
    bcm: { type: Number, default: 0 },
    mbc: { type: Number, default: 0 },
    sc: { type: Number, default: 0 },
    sca: { type: Number, default: 0 },
    st: { type: Number, default: 0 },
    other: { type: Number, default: 0 },
    totSeat: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('QuotaAllocation', quotaAllocationSchema);
