import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { addStudent, editStudent, deleteStudent, getStudents, getStudentByAppNo, getStudentEducationByAppNo, deleteStudentEducationByAppNo, getMetaData, getLatestSerials, getNextIds, debugSchema, getCommunityMaster, getStudentImage, getStudentByRegNo } from '../controller/studentMasterController.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directory exists - use server's uploads folder for Docker compatibility
const uploadDir = path.join(__dirname, '../uploads/student/');
console.log('📁 Upload directory path:', uploadDir);

try {
  if (!fs.existsSync(uploadDir)) {
    console.log('⚠️ Upload directory does not exist, creating it...');
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('✅ Upload directory created successfully');
  } else {
    console.log('✅ Upload directory already exists');
  }
} catch (err) {
  console.error('❌ Failed to ensure upload directory exists:', uploadDir, err);
}

// Multer setup for photo upload with better error handling
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      // Ensure directory exists before saving
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log('📁 Created upload directory:', uploadDir);
      }
      console.log('📤 Uploading file to:', uploadDir);
      cb(null, uploadDir);
    } catch (err) {
      console.error('❌ Error in destination callback:', err);
      cb(err);
    }
  },
  filename: function (req, file, cb) {
    try {
      const ext = path.extname(file.originalname);
      let appNo = req.body.Application_No || Date.now();
      // Remove any commas or duplicates from appNo
      appNo = String(appNo).split(',')[0].trim();
      const filename = `${appNo}${ext}`;
      console.log('📝 Saving file as:', filename, '(from appNo:', req.body.Application_No, ')');
      cb(null, filename);
    } catch (err) {
      console.error('❌ Error in filename callback:', err);
      cb(err);
    }
  }
});

// Multer upload with error handling
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    console.log('📄 File received:', file.originalname, 'Type:', file.mimetype);
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      console.log('✅ Image file accepted');
      cb(null, true);
    } else {
      console.error('❌ Invalid file type:', file.mimetype);
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Add student (with photo upload)
router.post('/add', upload.single('photo'), addStudent);

// Edit student (with photo upload)
// Multer expects multipart bodies (commonly with POST). Some clients send PUT with multipart,
// so temporarily switch req.method to POST while multer parses, then restore to PUT.
router.put(
  '/edit/:id',
  (req, res, next) => {
    req.method = 'POST'; // Trick multer so it reads multipart body
    next();
  },
  upload.single('photo'), // multer parses file + body now
  (req, res, next) => {
    req.method = 'PUT'; // Restore original method
    next();
  },
  editStudent
);

// Delete student
router.delete('/delete/:id', deleteStudent);

// Get all students
router.get('/', getStudents); // <-- Add this line for /api/studentMaster
router.get('/all', getStudents);
router.get('/students', getStudents);

// Get metadata (courses, departments, semesters)
// MUST come before /:appNo to avoid being matched as appNo parameter
router.get('/metadata', getMetaData);

// Get community master
router.get('/community-master', getCommunityMaster);

// Get next roll/register ids for a Dept_Code
router.get('/next-ids', getNextIds);

// Get latest serials for Application_No and Student_ID for a Dept_Code
router.get('/latest-serials', getLatestSerials);

// Get education details by Application Number
router.get('/education/:appNo', getStudentEducationByAppNo);

// Delete education details by Application Number
router.delete('/education/:appNo', deleteStudentEducationByAppNo);

// Debug helper - Get database schema
router.get('/debug/schema', debugSchema);

// Get student by Application Number (must come AFTER specific named routes)
router.get('/:appNo', getStudentByAppNo);

// Serve student image
router.get('/student/student-image/:filename', getStudentImage);

// Get student by Register Number
router.get('/register/:regNo', getStudentByRegNo);

export default router;
