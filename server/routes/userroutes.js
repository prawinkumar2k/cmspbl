import express from 'express';
import { 
  getRoles, 
  createRole, 
  getModules, 
  getStaff, 
  getUsers,
  createUser,
  updateUser,
  deleteUser
} from '../controller/userController.js';

const router = express.Router();

// Role routes
router.get('/roles', getRoles);
router.post('/roles', createRole);

// Module routes
router.get('/modules', getModules);

// Staff routes
router.get('/staff', getStaff);

// User routes
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;
