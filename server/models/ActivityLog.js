import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
    username: { type: String, required: true, index: true },
    role: { type: String },
    action: { type: String, required: true },
    description: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
    timestamp: { type: Date, default: Date.now, index: true }
}, {
    // Don't use createdAt/updatedAt — we use our own timestamp field
    timestamps: false
});

// Index for recent activity queries
activityLogSchema.index({ timestamp: -1 });
activityLogSchema.index({ username: 1, timestamp: -1 });

export default mongoose.model('ActivityLog', activityLogSchema);
