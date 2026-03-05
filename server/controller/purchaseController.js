import { validationResult } from 'express-validator';
import { Purchase } from '../models/index.js';

function ensureNumber(n, fallback = null) {
  if (n === '' || n == null) return fallback;
  const num = Number(n);
  return Number.isFinite(num) ? num : fallback;
}

const devError = (err) => (process.env.NODE_ENV === 'production' ? { message: err.message } : { message: err.message, stack: err.stack });

function generatePurchaseId() {
  return 'PUR' + Date.now().toString().slice(-8);
}

export const createPurchaseHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const qty = ensureNumber(req.body.qty, 0);
    const rate = ensureNumber(req.body.rate, 0);
    const payload = {
      purchaseId: req.body.purchaseId || generatePurchaseId(),
      date: req.body.date || new Date().toISOString().split('T')[0],
      productName: req.body.productName ?? null,
      brandName: req.body.brandName ?? null,
      companyVendor: req.body.companyVendor ?? null,
      purchaseOrderNo: req.body.purchaseOrderNo ?? null,
      orderDate: req.body.orderDate ?? null,
      dcNo: req.body.dcNo ?? null,
      billNo: req.body.billNo ?? null,
      billDate: req.body.billDate ?? null,
      qty,
      rate,
      vatApplied: !!req.body.vatApplied,
      taxApplied: !!req.body.taxApplied,
      totalAmount: req.body.totalAmount != null ? ensureNumber(req.body.totalAmount, rate * qty) : rate * qty,
      currentStock: ensureNumber(req.body.currentStock, null),
      totalStock: ensureNumber(req.body.totalStock, null)
    };

    const purchase = await Purchase.create(payload);
    return res.status(201).json({ message: 'Purchase created', data: purchase });
  } catch (err) {
    console.error('createPurchaseHandler error:', err);
    return res.status(500).json({ message: 'Failed to create purchase', error: err.message, ...devError(err) });
  }
};

export const listPurchasesHandler = async (req, res) => {
  try {
    let limit = parseInt(req.query.limit ?? 50, 10);
    let offset = parseInt(req.query.offset ?? 0, 10);

    const rows = await Purchase.find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    return res.json({ data: rows, meta: { limit, offset } });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch purchases', error: err.message, ...devError(err) });
  }
};

export const getPurchaseHandler = async (req, res) => {
  try {
    const row = await Purchase.findById(req.params.id);
    if (!row) return res.status(404).json({ message: 'Purchase not found' });
    return res.json({ data: row });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message, ...devError(err) });
  }
};

export const updatePurchaseHandler = async (req, res) => {
  try {
    const body = { ...req.body };
    if ('qty' in body) body.qty = ensureNumber(body.qty, 0);
    if ('rate' in body) body.rate = ensureNumber(body.rate, 0);
    if ('totalAmount' in body) body.totalAmount = ensureNumber(body.totalAmount, 0);
    if ('currentStock' in body) body.currentStock = ensureNumber(body.currentStock, null);
    if ('totalStock' in body) body.totalStock = ensureNumber(body.totalStock, null);

    const purchase = await Purchase.findByIdAndUpdate(req.params.id, { $set: body }, { new: true });
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });
    return res.json({ message: 'Purchase updated', data: purchase });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update purchase', error: err.message, ...devError(err) });
  }
};

export const deletePurchaseHandler = async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndDelete(req.params.id);
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });
    return res.json({ message: 'Purchase deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete purchase', error: err.message, ...devError(err) });
  }
};
