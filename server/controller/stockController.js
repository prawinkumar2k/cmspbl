import fs from 'fs';
import path from 'path';
import { validationResult } from 'express-validator';
import { Stock } from '../models/index.js';

const DEMO_PREVIEW_LOCAL = '/mnt/data/e0a6cee1-09c7-4b51-8528-7c1e715f9d07.png';

const parseNumber = (val, fallback = 0) => {
  if (val == null || val === '') return fallback;
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
};

const normalizeString = (val) => {
  if (val == null) return undefined;
  const s = String(val).trim();
  return s === '' ? undefined : s;
};

const devError = (err) => {
  return process.env.NODE_ENV === 'production'
    ? { message: err.message }
    : { message: err.message, stack: err.stack };
};

function generateStockId() {
  return 'STK' + Date.now().toString().slice(-8);
}

// Handler functions
export const createStockHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    let scanImagePath = null;
    if (req.file) {
      scanImagePath = `/uploads/stock/scans/${req.file.filename}`;
    }

    const rate = parseNumber(req.body.rate, 0);
    const qty = parseNumber(req.body.qty, 0);
    const totalValueProvided =
      req.body.totalValue != null && req.body.totalValue !== '' ? parseNumber(req.body.totalValue, null) : null;

    const payload = {
      stockId: normalizeString(req.body.stockId) || generateStockId(),
      date: normalizeString(req.body.date) || new Date().toISOString().split('T')[0],
      code: normalizeString(req.body.code) || null,
      productName: normalizeString(req.body.productName) || null,
      brandName: normalizeString(req.body.brandName) || null,
      rate,
      qty,
      scale: normalizeString(req.body.scale) || 'Bundle',
      totalValue: totalValueProvided != null ? totalValueProvided : (rate * qty),
      scanImage: scanImagePath,
      createdBy: req.body.createdBy || null,
      updatedBy: req.body.updatedBy || null,
      status: normalizeString(req.body.status) || 'Active'
    };

    const stock = await Stock.create(payload);
    return res.status(201).json({ success: true, message: 'Stock created', data: stock });
  } catch (err) {
    console.error('createStockHandler error:', err);
    return res.status(500).json({ success: false, ...devError(err) });
  }
};

export const listStocksHandler = async (req, res) => {
  try {
    const q = req.query;
    let limit = parseInt(q.limit ?? 50, 10);
    let offset = parseInt(q.offset ?? 0, 10);

    const filter = {};
    if (q.productName) filter.productName = new RegExp(q.productName, 'i');
    if (q.brandName) filter.brandName = new RegExp(q.brandName, 'i');
    if (q.dateFrom || q.dateTo) {
      filter.date = {};
      if (q.dateFrom) filter.date.$gte = q.dateFrom;
      if (q.dateTo) filter.date.$lte = q.dateTo;
    }
    if (q.search) {
      const s = new RegExp(q.search, 'i');
      filter.$or = [
        { productName: s },
        { brandName: s },
        { code: s },
        { stockId: s }
      ];
    }

    const rows = await Stock.find(filter)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    return res.json({ success: true, data: rows, meta: { limit, offset } });
  } catch (err) {
    console.error('listStocksHandler error:', err);
    return res.status(500).json({ success: false, ...devError(err) });
  }
};

export const getStockHandler = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) return res.status(404).json({ success: false, message: 'Stock not found' });

    const data = stock.toObject();
    if (!data.scanImage) data.scanImage = DEMO_PREVIEW_LOCAL;

    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, ...devError(err) });
  }
};

export const updateStockHandler = async (req, res) => {
  try {
    const body = { ...req.body };
    if ('rate' in body) body.rate = body.rate === '' ? 0 : parseNumber(body.rate, 0);
    if ('qty' in body) body.qty = body.qty === '' ? 0 : parseNumber(body.qty, 0);
    if ('totalValue' in body) body.totalValue = body.totalValue === '' ? 0 : parseNumber(body.totalValue, 0);

    if (req.file) {
      body.scanImage = `/uploads/stock/scans/${req.file.filename}`;
    }

    const stock = await Stock.findByIdAndUpdate(req.params.id, { $set: body }, { new: true });
    if (!stock) return res.status(404).json({ success: false, message: 'Stock not found' });
    return res.json({ success: true, message: 'Stock updated', data: stock });
  } catch (err) {
    return res.status(500).json({ success: false, ...devError(err) });
  }
};

export const deleteStockHandler = async (req, res) => {
  try {
    const stock = await Stock.findByIdAndDelete(req.params.id);
    if (!stock) return res.status(404).json({ success: false, message: 'Stock not found' });
    return res.json({ success: true, message: 'Stock deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, ...devError(err) });
  }
};

export const scanLookupHandler = async (req, res) => {
  try {
    const barcode = normalizeString(req.body.barcode || req.body.code);
    if (!barcode) return res.status(400).json({ success: false, message: 'Missing barcode' });

    const product = await Stock.findOne({ $or: [{ code: barcode }, { stockId: barcode }] }).sort({ createdAt: -1 });
    if (!product) {
      return res.json({ success: false, found: false, message: 'Product not found' });
    }

    const data = product.toObject();
    if (!data.scanImage) data.scanImage = DEMO_PREVIEW_LOCAL;
    return res.json({ success: true, found: true, autoFill: data });
  } catch (err) {
    return res.status(500).json({ success: false, ...devError(err) });
  }
};

export const dailyReportHandler = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const data = await Stock.aggregate([
      { $match: { date: today } },
      {
        $group: {
          _id: "$productName",
          total_added: { $sum: "$qty" },
          total_value: { $sum: { $multiply: ["$rate", "$qty"] } }
        }
      },
      { $project: { product_name: "$_id", total_added: 1, total_value: 1, _id: 0 } },
      { $sort: { total_added: -1 } }
    ]);
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, ...devError(err) });
  }
};

export const monthlyReportHandler = async (req, res) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    // Simplified month matching for String dates YYYY-MM-DD
    const prefix = `${year}-${month.toString().padStart(2, '0')}`;

    const data = await Stock.aggregate([
      { $match: { date: { $regex: new RegExp(`^${prefix}`) } } },
      {
        $group: {
          _id: "$productName",
          total_added: { $sum: "$qty" },
          total_value: { $sum: { $multiply: ["$rate", "$qty"] } }
        }
      },
      { $project: { product_name: "$_id", total_added: 1, total_value: 1, _id: 0 } },
      { $sort: { total_value: -1 } }
    ]);
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, ...devError(err) });
  }
};
