import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
    vehicleNumber: { type: String, required: true, unique: true, index: true },
    vehicleType: { type: String },
    registrationNo: { type: String },
    regExpiry: { type: String },
    seatingCapacity: { type: Number },
    fuelType: { type: String },
    assignedDriverId: { type: String, default: null }, // staffId
    status: { type: String, default: 'Active' },
    remarks: { type: String },
}, { timestamps: true });

const driverSchema = new mongoose.Schema({
    driverName: { type: String, required: true },
    phone: { type: String },
    licenseNo: { type: String },
    licenseValidTill: { type: String },
    assignedVehicleId: { type: String, default: null },
    status: { type: String, default: 'Active' },
}, { timestamps: true });

const routeSchema = new mongoose.Schema({
    routeName: { type: String, required: true, unique: true },
    startPoint: { type: String },
    endPoint: { type: String },
    totalDistanceKm: { type: Number },
    shift: { type: String },
    assignedVehicleId: { type: String, default: null },
    status: { type: String, default: 'Active' },
}, { timestamps: true });

const stageSchema = new mongoose.Schema({
    routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true, index: true },
    stageName: { type: String, required: true },
    sequenceNo: { type: Number, default: 1 },
    distanceFromStartKm: { type: Number, default: 0 },
    stageFee: { type: Number, default: 0 },
}, { timestamps: true });

const maintenanceSchema = new mongoose.Schema({
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true, index: true },
    date: { type: String, required: true },
    type: { type: String },
    cost: { type: Number, default: 0 },
    notes: { type: String },
}, { timestamps: true });

export const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export const Driver = mongoose.model('Driver', driverSchema);
export const Route = mongoose.model('Route', routeSchema);
export const Stage = mongoose.model('Stage', stageSchema);
export const MaintenanceRecord = mongoose.model('MaintenanceRecord', maintenanceSchema);

const transportEntrySchema = new mongoose.Schema({
    date: { type: String, required: true, index: true },
    shift: { type: String },
    busNumber: { type: String, index: true },
    vehicleType: { type: String },
    capacity: { type: Number },
    registrationNo: { type: String },
    fitnessExpiry: { type: String },
    permitExpiry: { type: String },
    insuranceExpiry: { type: String },
    routeName: { type: String },
    routeNo: { type: String },
    stageNo: { type: String },
    stageName: { type: String },
    amount: { type: Number },
    driver: { type: String },
    driverId: { type: String },
    gateEntryTime: { type: String },
    gateExitTime: { type: String },
    startOdo: { type: Number },
    endOdo: { type: Number },
    distance: { type: Number },
    collectedAmount: { type: Number },
    fuelIssued: { type: Number },
    fuelType: { type: String },
    mileage: { type: Number },
    issues: { type: String },
    remarks: { type: String },
    createdBy: { type: String }
}, { timestamps: true });

export const TransportEntry = mongoose.model('TransportEntry', transportEntrySchema);
