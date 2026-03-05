// server/routes/purchase.routes.js
import express from 'express';
import * as PurchaseController from '../controller/purchaseController.js';

const router = express.Router();

/**
 * Helper to resolve a handler function from the controller module.
 * Accepts multiple candidate names (in order) and returns the first function found.
 * Throws a helpful error if none are present.
 */
function resolveHandler(...candidates) {
  for (const name of candidates) {
    if (typeof PurchaseController[name] === 'function') return PurchaseController[name];
  }
  throw new Error(
    `Purchase route handler not found. Tried: ${candidates.join(', ')}. ` +
    `Check exports in ../controller/purchaseController.js`
  );
}

// resolve likely handler names (covers variations you have in different files)
const getAllHandler = resolveHandler('getAllPurchases', 'listPurchasesHandler', 'listPurchases', 'getAll');
const getOneHandler = resolveHandler('getPurchase', 'getPurchaseHandler', 'getOne', 'get');
const createHandler = resolveHandler('createPurchase', 'createPurchaseHandler', 'create');
const updateHandler = resolveHandler('updatePurchase', 'updatePurchaseHandler', 'update');
const deleteHandler = resolveHandler('deletePurchase', 'deletePurchaseHandler', 'removePurchase', 'delete');

router.get('/', getAllHandler);
router.get('/:id', getOneHandler);
router.post('/', createHandler);
router.put('/:id', updateHandler);
router.delete('/:id', deleteHandler);

export default router;
