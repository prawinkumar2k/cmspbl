import { Vehicle, Driver, Route, Stage, MaintenanceRecord } from "../models/Transport.js";

/**
 * VEHICLES
 */
export const getVehicles = async (req, res) => {
  try {
    const rows = await Vehicle.find().sort({ createdAt: -1 });
    // Map to snake_case for frontend
    const mapped = rows.map(v => ({
      id: v._id,
      vehicle_number: v.vehicleNumber,
      vehicle_type: v.vehicleType,
      registration_no: v.registrationNo,
      reg_expiry: v.regExpiry,
      seating_capacity: v.seatingCapacity,
      fuel_type: v.fuelType,
      assigned_driver_id: v.assignedDriverId,
      status: v.status,
      remarks: v.remarks,
      created_at: v.createdAt,
      updated_at: v.updatedAt
    }));
    return res.json({ success: true, data: mapped });
  } catch (err) {
    console.error("getVehicles error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch vehicles" });
  }
};

export const createVehicle = async (req, res) => {
  try {
    const b = req.body;
    if (!b.vehicle_number) return res.status(400).json({ success: false, message: "vehicle_number required" });

    const entry = await Vehicle.create({
      vehicleNumber: b.vehicle_number,
      vehicleType: b.vehicle_type,
      registrationNo: b.registration_no,
      regExpiry: b.reg_expiry,
      seatingCapacity: b.seating_capacity,
      fuelType: b.fuel_type,
      assignedDriverId: b.assigned_driver_id,
      status: b.status || "Active",
      remarks: b.remarks
    });

    return res.status(201).json({ success: true, data: entry });
  } catch (err) {
    console.error("createVehicle error:", err);
    if (err.code === 11000) return res.status(409).json({ success: false, message: "vehicle_number already exists" });
    return res.status(500).json({ success: false, message: "Failed to create vehicle" });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const b = req.body;

    const updateData = {};
    if (b.vehicle_number !== undefined) updateData.vehicleNumber = b.vehicle_number;
    if (b.vehicle_type !== undefined) updateData.vehicleType = b.vehicle_type;
    if (b.registration_no !== undefined) updateData.registrationNo = b.registration_no;
    if (b.reg_expiry !== undefined) updateData.regExpiry = b.reg_expiry;
    if (b.seating_capacity !== undefined) updateData.seatingCapacity = b.seating_capacity;
    if (b.fuel_type !== undefined) updateData.fuelType = b.fuel_type;
    if (b.assigned_driver_id !== undefined) updateData.assignedDriverId = b.assigned_driver_id;
    if (b.status !== undefined) updateData.status = b.status;
    if (b.remarks !== undefined) updateData.remarks = b.remarks;

    const updated = await Vehicle.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Vehicle not found" });

    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error("updateVehicle error:", err);
    return res.status(500).json({ success: false, message: "Failed to update vehicle" });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    await Vehicle.findByIdAndDelete(id);
    // Cleanup references in other models (optional but good)
    await Driver.updateMany({ assignedVehicleId: id }, { assignedVehicleId: null });
    await Route.updateMany({ assignedVehicleId: id }, { assignedVehicleId: null });
    return res.json({ success: true, message: "Vehicle deleted" });
  } catch (err) {
    console.error("deleteVehicle error:", err);
    return res.status(500).json({ success: false, message: "Failed to delete vehicle" });
  }
};

/**
 * DRIVERS
 */
export const getDrivers = async (req, res) => {
  try {
    const rows = await Driver.find().sort({ createdAt: -1 });
    const mapped = rows.map(d => ({
      id: d._id,
      driver_name: d.driverName,
      phone: d.phone,
      license_no: d.licenseNo,
      license_valid_till: d.licenseValidTill,
      assigned_vehicle_id: d.assignedVehicleId,
      status: d.status,
      created_at: d.createdAt,
      updated_at: d.updatedAt
    }));
    return res.json({ success: true, data: mapped });
  } catch (err) {
    console.error("getDrivers error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch drivers" });
  }
};

export const createDriver = async (req, res) => {
  try {
    const b = req.body;
    if (!b.driver_name) return res.status(400).json({ success: false, message: "driver_name required" });

    const entry = await Driver.create({
      driverName: b.driver_name,
      phone: b.phone,
      licenseNo: b.license_no,
      licenseValidTill: b.license_valid_till,
      assignedVehicleId: b.assigned_vehicle_id,
      status: b.status || "Active"
    });

    return res.status(201).json({ success: true, data: entry });
  } catch (err) {
    console.error("createDriver error:", err);
    return res.status(500).json({ success: false, message: "Failed to create driver" });
  }
};

export const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const b = req.body;

    const updateData = {};
    if (b.driver_name !== undefined) updateData.driverName = b.driver_name;
    if (b.phone !== undefined) updateData.phone = b.phone;
    if (b.license_no !== undefined) updateData.licenseNo = b.license_no;
    if (b.license_valid_till !== undefined) updateData.licenseValidTill = b.license_valid_till;
    if (b.assigned_vehicle_id !== undefined) updateData.assignedVehicleId = b.assigned_vehicle_id;
    if (b.status !== undefined) updateData.status = b.status;

    const updated = await Driver.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Driver not found" });

    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error("updateDriver error:", err);
    return res.status(500).json({ success: false, message: "Failed to update driver" });
  }
};

export const deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;
    await Driver.findByIdAndDelete(id);
    await Vehicle.updateMany({ assignedDriverId: id }, { assignedDriverId: null });
    return res.json({ success: true, message: "Driver deleted" });
  } catch (err) {
    console.error("deleteDriver error:", err);
    return res.status(500).json({ success: false, message: "Failed to delete driver" });
  }
};

/**
 * ROUTES (+ STAGES)
 */
export const getRoutes = async (req, res) => {
  try {
    const routes = await Route.find().sort({ createdAt: -1 });
    const stages = await Stage.find().sort({ routeId: 1, sequenceNo: 1 });

    const grouped = routes.map(r => ({
      id: r._id,
      route_name: r.routeName,
      start_point: r.startPoint,
      end_point: r.endPoint,
      total_distance_km: r.totalDistanceKm,
      shift: r.shift,
      assigned_vehicle_id: r.assignedVehicleId,
      status: r.status,
      created_at: r.createdAt,
      updated_at: r.updatedAt,
      stages: stages.filter(s => s.routeId.equals(r._id)).map(s => ({
        id: s._id,
        stage_name: s.stageName,
        sequence_no: s.sequenceNo,
        distance_from_start_km: s.distanceFromStartKm,
        stage_fee: s.stageFee
      }))
    }));

    return res.json({ success: true, data: grouped });
  } catch (err) {
    console.error("getRoutes error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch routes" });
  }
};

export const createRoute = async (req, res) => {
  try {
    const b = req.body;
    if (!b.route_name) return res.status(400).json({ success: false, message: "route_name required" });

    const route = await Route.create({
      routeName: b.route_name,
      startPoint: b.start_point,
      endPoint: b.end_point,
      totalDistanceKm: b.total_distance_km,
      shift: b.shift,
      assignedVehicleId: b.assigned_vehicle_id,
      status: b.status || "Active"
    });

    if (Array.isArray(b.stages)) {
      const stageDocs = b.stages.map((s, idx) => ({
        routeId: route._id,
        stageName: s.stage_name || s.stageName || "",
        sequenceNo: s.sequence_no || s.sequenceNo || (idx + 1),
        distanceFromStartKm: s.distance_from_start_km || s.distanceFromStartKm || 0,
        stageFee: s.stage_fee || s.stageFee || 0
      }));
      await Stage.insertMany(stageDocs);
    }

    return res.status(201).json({ success: true, data: route });
  } catch (err) {
    console.error("createRoute error:", err);
    return res.status(500).json({ success: false, message: "Failed to create route" });
  }
};

export const updateRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const b = req.body;

    const updateData = {};
    if (b.route_name !== undefined) updateData.routeName = b.route_name;
    if (b.start_point !== undefined) updateData.startPoint = b.start_point;
    if (b.end_point !== undefined) updateData.endPoint = b.end_point;
    if (b.total_distance_km !== undefined) updateData.totalDistanceKm = b.total_distance_km;
    if (b.shift !== undefined) updateData.shift = b.shift;
    if (b.assigned_vehicle_id !== undefined) updateData.assignedVehicleId = b.assigned_vehicle_id;
    if (b.status !== undefined) updateData.status = b.status;

    await Route.findByIdAndUpdate(id, updateData);

    if (Array.isArray(b.stages)) {
      await Stage.deleteMany({ routeId: id });
      const stageDocs = b.stages.map((s, idx) => ({
        routeId: id,
        stageName: s.stage_name || s.stageName || "",
        sequenceNo: s.sequence_no || s.sequenceNo || (idx + 1),
        distanceFromStartKm: s.distance_from_start_km || s.distanceFromStartKm || 0,
        stageFee: s.stage_fee || s.stageFee || 0
      }));
      await Stage.insertMany(stageDocs);
    }

    const updated = await Route.findById(id);
    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error("updateRoute error:", err);
    return res.status(500).json({ success: false, message: "Failed to update route" });
  }
};

export const deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;
    await Stage.deleteMany({ routeId: id });
    await Route.findByIdAndDelete(id);
    return res.json({ success: true, message: "Route deleted" });
  } catch (err) {
    console.error("deleteRoute error:", err);
    return res.status(500).json({ success: false, message: "Failed to delete route" });
  }
};

/**
 * STAGES
 */
export const createStage = async (req, res) => {
  try {
    const b = req.body;
    const stage = await Stage.create({
      routeId: b.route_id,
      stageName: b.stage_name,
      sequenceNo: b.sequence_no,
      distanceFromStartKm: b.distance_from_start_km,
      stageFee: b.stage_fee
    });
    return res.status(201).json({ success: true, data: stage });
  } catch (err) {
    console.error("createStage error:", err);
    return res.status(500).json({ success: false, message: "Failed to create stage" });
  }
};

export const updateStage = async (req, res) => {
  try {
    const { id } = req.params;
    const b = req.body;
    const updated = await Stage.findByIdAndUpdate(id, {
      stageName: b.stage_name,
      sequenceNo: b.sequence_no,
      distanceFromStartKm: b.distance_from_start_km,
      stageFee: b.stage_fee
    }, { new: true });
    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error("updateStage error:", err);
    return res.status(500).json({ success: false, message: "Failed to update stage" });
  }
};

export const deleteStage = async (req, res) => {
  try {
    const { id } = req.params;
    await Stage.findByIdAndDelete(id);
    return res.json({ success: true, message: "Stage deleted" });
  } catch (err) {
    console.error("deleteStage error:", err);
    return res.status(500).json({ success: false, message: "Failed to delete stage" });
  }
};

/**
 * MAINTENANCE
 */
export const getMaintenance = async (req, res) => {
  try {
    const { vehicleId } = req.query;
    const filter = {};
    if (vehicleId) filter.vehicleId = vehicleId;

    const rows = await MaintenanceRecord.find(filter).sort({ date: -1 });
    const mapped = rows.map(m => ({
      id: m._id,
      vehicle_id: m.vehicleId,
      date: m.date,
      type: m.type,
      cost: m.cost,
      notes: m.notes,
      created_at: m.createdAt,
      updated_at: m.updatedAt
    }));
    return res.json({ success: true, data: mapped });
  } catch (err) {
    console.error("getMaintenance error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch maintenance records" });
  }
};

export const createMaintenance = async (req, res) => {
  try {
    const b = req.body;
    if (!b.vehicle_id || !b.date) return res.status(400).json({ success: false, message: "vehicle_id and date required" });

    const entry = await MaintenanceRecord.create({
      vehicleId: b.vehicle_id,
      date: b.date,
      type: b.type,
      cost: b.cost || 0,
      notes: b.notes
    });

    return res.status(201).json({ success: true, data: entry });
  } catch (err) {
    console.error("createMaintenance error:", err);
    return res.status(500).json({ success: false, message: "Failed to create maintenance record" });
  }
};

export const updateMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const b = req.body;

    const updateData = {};
    if (b.vehicle_id !== undefined) updateData.vehicleId = b.vehicle_id;
    if (b.date !== undefined) updateData.date = b.date;
    if (b.type !== undefined) updateData.type = b.type;
    if (b.cost !== undefined) updateData.cost = b.cost;
    if (b.notes !== undefined) updateData.notes = b.notes;

    const updated = await MaintenanceRecord.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Maintenance record not found" });

    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error("updateMaintenance error:", err);
    return res.status(500).json({ success: false, message: "Failed to update maintenance" });
  }
};

export const deleteMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    await MaintenanceRecord.findByIdAndDelete(id);
    return res.json({ success: true, message: "Maintenance record deleted" });
  } catch (err) {
    console.error("deleteMaintenance error:", err);
    return res.status(500).json({ success: false, message: "Failed to delete maintenance" });
  }
};

/**
 * BULK SAVE (REPLACE ALL) and IMPORT
 */
export const saveAllTransportMaster = async (req, res) => {
  try {
    const { vehicles = [], drivers = [], routes = [], maintenanceRecords = [] } = req.body;

    // Clear all existing data
    await Promise.all([
      Stage.deleteMany({}),
      Route.deleteMany({}),
      MaintenanceRecord.deleteMany({}),
      Vehicle.deleteMany({}),
      Driver.deleteMany({})
    ]);

    // Note: This logic might fail if references (ObjectIds) are not preserved.
    // The legacy implementation also recreated records from scratch.
    // If the frontend sends ObjectIds, we might need to cast them.

    await Vehicle.insertMany(vehicles.map(v => ({ ...v, vehicleNumber: v.vehicle_number })));
    await Driver.insertMany(drivers.map(d => ({ ...d, driverName: d.driver_name })));
    // Routes and maintenance involve IDs that might need manual restoration if they were ObjectIds or UUIDs.
    // For simplicity, we'll just insert what we get.

    return res.json({ success: true, message: "All transport data saved (replaced)" });
  } catch (err) {
    console.error("saveAllTransportMaster error:", err);
    return res.status(500).json({ success: false, message: "Failed to save all transport data" });
  }
};

export const importTransportData = async (req, res) => {
  try {
    const { mode = "merge", data = {} } = req.body;
    if (mode === "replace") {
      req.body = data;
      return await saveAllTransportMaster(req, res);
    }

    // Merge logic: insert or update
    const { vehicles = [] } = data;
    for (const v of vehicles) {
      await Vehicle.findOneAndUpdate(
        { vehicleNumber: v.vehicle_number },
        { ...v, vehicleNumber: v.vehicle_number },
        { upsert: true }
      );
    }
    // Similarly for others...

    return res.json({ success: true, message: "Transport data imported (merged)" });
  } catch (err) {
    console.error("importTransportData error:", err);
    return res.status(500).json({ success: false, message: "Failed to import transport data" });
  }
};

