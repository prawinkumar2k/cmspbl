import mongoose from 'mongoose';

const academicCalendarSchema = new mongoose.Schema({
    calendarDate: { type: Date, required: true },
    dayOrder: { type: String },
    eventTitle: { type: String, default: null },
    description: { type: String, default: null },
    label: { type: String, default: null },
    eventTiming: { type: String, default: null },
    status: { type: String, enum: ['H', 'W'], default: 'W' }, // H=Holiday, W=Working
    reason: { type: String, default: null },
}, { timestamps: true });

academicCalendarSchema.index({ calendarDate: 1 }, { unique: true });

const academicCalendarDateFixSchema = new mongoose.Schema({
    startDate: { type: Date },
    endDate: { type: Date },
    totalWeeks: { type: Number },
}, { timestamps: true });

export const AcademicCalendar = mongoose.model('AcademicCalendar', academicCalendarSchema);
export const AcademicCalendarDateFix = mongoose.model('AcademicCalendarDateFix', academicCalendarDateFixSchema);
