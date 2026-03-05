import { validationResult } from 'express-validator';
import { Asset } from '../models/index.js';

const devError = (err) => {
  return process.env.NODE_ENV === 'production'
    ? { message: err.message }
    : { message: err.message, stack: err.stack };
};

function ensureNumber(n, fallback = 0) {
  const num = Number(n);
  return Number.isFinite(num) ? num : fallback;
}

const normalizeString = (val) => {
  if (val == null) return undefined;
  const s = String(val).trim();
  return s === '' ? undefined : s;
};

function generateAssetId() {
  return 'ASSET-' + Date.now().toString().slice(-8);
}

export const createAssetHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const qty = ensureNumber(req.body.qty, 0);
    const rate = ensureNumber(req.body.rate, 0);
    const assetData = {
      assetId: normalizeString(req.body.assetId) || generateAssetId(),
      date: normalizeString(req.body.date) || new Date().toISOString().split('T')[0],
      assets: normalizeString(req.body.assets) ?? null,
      location: normalizeString(req.body.location) ?? null,
      description: normalizeString(req.body.description) ?? null,
      condition: normalizeString(req.body.condition) ?? null,
      qty,
      rate,
      amount: req.body.amount !== undefined ? ensureNumber(req.body.amount, qty * rate) : qty * rate,
      status: normalizeString(req.body.status) ?? 'Active',
      createdBy: req.body.createdBy ?? null
    };

    const result = await Asset.create(assetData);
    return res.status(201).json({ success: true, message: 'Asset created', data: result });
  } catch (err) {
    console.error('createAssetHandler error:', err);
    return res.status(500).json({ success: false, ...devError(err) });
  }
};

export const getAssetsHandler = async (req, res) => {
  try {
    let limit = parseInt(req.query.limit ?? 100, 10);
    let offset = parseInt(req.query.offset ?? 0, 10);

    const rows = await Asset.find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    return res.json({ success: true, data: rows, meta: { limit, offset } });
  } catch (err) {
    return res.status(500).json({ success: false, ...devError(err) });
  }
};

export const getAssetHandler = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ success: false, message: 'Asset not found' });
    return res.json({ success: true, data: asset });
  } catch (err) {
    return res.status(500).json({ success: false, ...devError(err) });
  }
};

export const updateAssetHandler = async (req, res) => {
  try {
    const body = { ...req.body };
    if ('qty' in body) body.qty = ensureNumber(body.qty, 0);
    if ('rate' in body) body.rate = ensureNumber(body.rate, 0);
    if ('amount' in body) body.amount = ensureNumber(body.amount, 0);

    const asset = await Asset.findByIdAndUpdate(req.params.id, { $set: body }, { new: true });
    if (!asset) return res.status(404).json({ success: false, message: 'Asset not found' });
    return res.json({ success: true, message: 'Asset updated', data: asset });
  } catch (err) {
    return res.status(500).json({ success: false, ...devError(err) });
  }
};

export const deleteAssetHandler = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id);
    if (!asset) return res.status(404).json({ success: false, message: 'Asset not found' });
    return res.json({ success: true, message: 'Asset deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, ...devError(err) });
  }
};
