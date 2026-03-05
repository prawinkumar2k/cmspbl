// routes/transport.routes.js
import express from "express";
import * as ctrl from "../controller/transportController.js";

const router = express.Router();

// Vehicles
router.get("/vehicles", ctrl.getVehicles);
router.post("/vehicles", ctrl.createVehicle);
router.patch("/vehicles/:id", ctrl.updateVehicle);
router.delete("/vehicles/:id", ctrl.deleteVehicle);

// Drivers
router.get("/drivers", ctrl.getDrivers);
router.post("/drivers", ctrl.createDriver);
router.patch("/drivers/:id", ctrl.updateDriver);
router.delete("/drivers/:id", ctrl.deleteDriver);

// Routes (with stages)
router.get("/routes", ctrl.getRoutes);               // returns routes with stages
router.post("/routes", ctrl.createRoute);            // body includes stages array
router.patch("/routes/:id", ctrl.updateRoute);       // replace route fields and stages
router.delete("/routes/:id", ctrl.deleteRoute);

// Stages (optional single-stage CRUD)
router.post("/stages", ctrl.createStage);
router.patch("/stages/:id", ctrl.updateStage);
router.delete("/stages/:id", ctrl.deleteStage);

// Maintenance
router.get("/maintenance", ctrl.getMaintenance);
router.post("/maintenance", ctrl.createMaintenance);
router.patch("/maintenance/:id", ctrl.updateMaintenance);
router.delete("/maintenance/:id", ctrl.deleteMaintenance);

// Bulk save / import
router.post("/save-all", ctrl.saveAllTransportMaster);   // replace all tables
router.post("/import", ctrl.importTransportData);        // merge or replace based on payload.mode

export default router;
