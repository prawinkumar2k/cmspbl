import { TransportEntry } from '../models/index.js';

// Get transport entries
export const getTransportEntries = async (req, res) => {
  try {
    const { date, busNumber, routeName, shift } = req.query;
    const filter = {};
    if (date) filter.date = date;
    if (busNumber) filter.busNumber = busNumber;
    if (routeName) filter.routeName = routeName;
    if (shift) filter.shift = shift;

    const rows = await TransportEntry.find(filter).sort({ date: -1, _id: -1 });
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed" });
  }
};

// Get by ID
export const getTransportEntryById = async (req, res) => {
  try {
    const row = await TransportEntry.findById(req.params.id);
    if (!row) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: row });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed" });
  }
};

// Create
export const createTransportEntry = async (req, res) => {
  try {
    const b = req.body;
    const row = await TransportEntry.create({
      date: b.date,
      shift: b.shift,
      busNumber: b.busNumber,
      vehicleType: b.vehicleType,
      capacity: b.capacity,
      registrationNo: b.registrationNo,
      fitnessExpiry: b.fitnessExpiry,
      permitExpiry: b.permitExpiry,
      insuranceExpiry: b.insuranceExpiry,
      routeName: b.routeName,
      routeNo: b.routeNo,
      stageNo: b.stageNo,
      stageName: b.stageName,
      amount: b.amount,
      driver: b.driver,
      driverId: b.driverId,
      gateEntryTime: b.gateEntryTime,
      gateExitTime: b.gateExitTime,
      startOdo: b.startOdo,
      endOdo: b.endOdo,
      distance: b.distance,
      collectedAmount: b.collectedAmount,
      fuelIssued: b.fuelIssued,
      fuelType: b.fuelType,
      mileage: b.mileage,
      issues: b.issues,
      remarks: b.remarks,
      createdBy: b.createdBy
    });
    res.status(201).json({ success: true, data: row });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed" });
  }
};

// Update
export const updateTransportEntry = async (req, res) => {
  try {
    const b = req.body;
    const update = {
      date: b.date,
      shift: b.shift,
      busNumber: b.busNumber,
      vehicleType: b.vehicleType,
      capacity: b.capacity,
      registrationNo: b.registrationNo,
      fitnessExpiry: b.fitnessExpiry,
      permitExpiry: b.permitExpiry,
      insuranceExpiry: b.insuranceExpiry,
      routeName: b.routeName,
      routeNo: b.routeNo,
      stageNo: b.stageNo,
      stageName: b.stageName,
      amount: b.amount,
      driver: b.driver,
      driverId: b.driverId,
      gateEntryTime: b.gateEntryTime,
      gateExitTime: b.gateExitTime,
      startOdo: b.startOdo,
      endOdo: b.endOdo,
      distance: b.distance,
      collectedAmount: b.collectedAmount,
      fuelIssued: b.fuelIssued,
      fuelType: b.fuelType,
      mileage: b.mileage,
      issues: b.issues,
      remarks: b.remarks,
      createdBy: b.createdBy
    };

    // Remove undefined
    Object.keys(update).forEach(key => update[key] === undefined && delete update[key]);

    const row = await TransportEntry.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!row) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: row });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed" });
  }
};

// Delete
export const deleteTransportEntry = async (req, res) => {
  try {
    const row = await TransportEntry.findByIdAndDelete(req.params.id);
    if (!row) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed" });
  }
};
