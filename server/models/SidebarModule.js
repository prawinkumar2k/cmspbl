import mongoose from 'mongoose';

const sidebarModuleSchema = new mongoose.Schema({
    moduleName: { type: String, required: true },
    moduleKey: { type: String, required: true, unique: true, index: true },
    moduleCategory: { type: String, default: '' },
    modulePath: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 999 }
}, { timestamps: true });

export default mongoose.model('SidebarModule', sidebarModuleSchema);
