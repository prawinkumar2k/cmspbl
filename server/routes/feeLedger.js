// routes/feeLedger.routes.js
import express from 'express';
import {
  getAll, getById, create, update, remove, bulkUpdateBalances
} from '../controller/feeLedgerController.js';

const router = express.Router();

router.get('/', getAll);                 // GET /api/fee-ledger
router.get('/:id', getById);             // GET /api/fee-ledger/:id
router.post('/', create);                // POST /api/fee-ledger
router.put('/:id', update);              // PUT /api/fee-ledger/:id
router.delete('/:id', remove);           // DELETE /api/fee-ledger/:id

// bulk update balances
router.post('/bulk-update-balances', bulkUpdateBalances); // POST /api/fee-ledger/bulk-update-balances

export default router;
