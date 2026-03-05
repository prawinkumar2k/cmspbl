// routes/feetype.routes.js
import express from 'express';
import * as controller from '../controller/feetypeController.js';

const router = express.Router();

router.get('/', controller.list);

// use plain :id here (validate inside controller)
router.get('/:id', controller.getOne);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;
