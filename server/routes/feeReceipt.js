// routes/feeReceipt.routes.js
import express from "express";
import {
  create,
  list,
  getOne,
  updateOne,
  markPaid,
  remove,
} from "../controller/feeReceiptController.js";

const router = express.Router();

// /api/fee-receipt
router.route("/")
  .post(create)    // Create new receipt
  .get(list);      // List receipts (with filters)

// /api/fee-receipt/:id
router.route("/:id")
  .get(getOne)     // Get one receipt
  .patch(updateOne) // Update receipt
  .delete(remove);  // Delete receipt

// /api/fee-receipt/:id/paid
router.patch("/:id/paid", markPaid); // Mark paid / add payment

export default router;
