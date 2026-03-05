// server/routes/stock.routes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { body } from 'express-validator';
import * as StockController from '../controller/stockController.js';

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = path.join(process.cwd(), 'public', 'uploads', 'stock', 'scans');
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.png';
    cb(null, unique + ext);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    // accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  }
});

// Create (supports multipart/form-data with field name 'scanImage')
router.post(
  '/',
  upload.single('scanImage'),
  [
    body('productName').optional().trim().notEmpty().withMessage('productName is required'),
    body('brandName').optional().trim().notEmpty().withMessage('brandName is required'),
    body('rate').optional().custom((v) => { if (v === undefined || v === null || v === '') return true; const n=Number(v); return Number.isFinite(n) && n > 0; }).withMessage('rate must be > 0'),
    body('qty').optional().custom((v) => { if (v === undefined || v === null || v === '') return true; const n=Number(v); return Number.isFinite(n) && n > 0; }).withMessage('qty must be > 0'),
  ],
  StockController.createStockHandler
);

// Scan lookup (barcode)
router.post('/scan', StockController.scanLookupHandler);

// Read list
router.get('/', StockController.listStocksHandler);

// Read one
router.get('/:id', StockController.getStockHandler);

// Update (supports optional file upload)
router.put('/:id', upload.single('scanImage'), StockController.updateStockHandler);

// Delete
router.delete('/:id', StockController.deleteStockHandler);

// Reports
router.get('/report/daily', StockController.dailyReportHandler);
router.get('/report/monthly', StockController.monthlyReportHandler);

export default router;
