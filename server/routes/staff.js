import express from 'express';
import {
  getAllDesignations,
  getAllReligions,
  getAllCommunities,
  getAllDept_Names,
  getNextStaffId,
  insertStaffDetails,
  getAllStaff,
  updateStaffDetails,
  deleteStaffDetails,
  getStaffImage
} from '../controller/staffDetails.js';
import multer from 'multer';
import { fileURLToPath } from 'url';
import path from 'path';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer config for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/staff'));
  },
  filename: function (req, file, cb) {
    // Extract extension
    const ext = path.extname(file.originalname);
    // Use Staff_ID from the form data, fallback to Date.now() if not present
    let staffId = req.body?.Staff_ID || Date.now();
    // Remove any unwanted characters from staffId
    staffId = String(staffId).replace(/[^a-zA-Z0-9]/g, '');
    cb(null, `${staffId}${ext}`);
  }
});

const upload = multer({ storage });

const router = express.Router();

router.get('/designation_master', getAllDesignations);
router.get('/religion_master', getAllReligions);
router.get('/community_master', getAllCommunities);
router.get('/department_master', getAllDept_Names);
router.get('/next_staff_id', getNextStaffId);
router.post('/staff_master', upload.single('Photo'), insertStaffDetails);
router.get('/staff_master', getAllStaff);
router.put('/staff_master/:id', upload.single('Photo'), updateStaffDetails);
router.delete('/staff_master/:id', deleteStaffDetails);
router.get('/staff/staff-image/:filename', getStaffImage);

export default router;
