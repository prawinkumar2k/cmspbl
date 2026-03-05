// routes/feeCollection.routes.js
import express from "express";
import * as controller from "../controller/feeCollectionController.js";

const router = express.Router();

// Create
router.post("/", controller.create);

// Read list (supports filters via query params)
router.get("/", controller.list);

// Read single
router.get("/:id", controller.getOne);

// Update
router.put("/:id", controller.updateOne);

// Delete
router.delete("/:id", controller.remove);

export default router;
