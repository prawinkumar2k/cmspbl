// server/routes/assets.routes.js
import express from 'express';
import { body, param } from 'express-validator';
import * as AssetsController from '../controller/assetController.js';

const router = express.Router();

router.post(
  '/',
  [
    body('assets').notEmpty().withMessage('Asset type required'),
    body('qty').isFloat({ gt: -1 }).withMessage('qty must be a number'),
    body('rate').isFloat({ gt: -1 }).withMessage('rate must be a number')
  ],
  AssetsController.createAssetHandler
);

router.get('/', AssetsController.getAssetsHandler);

router.get('/:id', [param('id').isInt()], AssetsController.getAssetHandler);

router.put('/:id', [param('id').isInt()], AssetsController.updateAssetHandler);

router.delete('/:id', [param('id').isInt()], AssetsController.deleteAssetHandler);

export default router;
