import express from 'express';
import { getAllCommunities, getAllDistricts, getAllCategories, addCategory, getAllSources, getAllCourseDetails } from '../controller/masterDataController.js';

const router = express.Router();

router.get('/community-master', getAllCommunities);
router.get('/district-master', getAllDistricts);
router.get('/category-master', getAllCategories);
router.post('/category-master', addCategory);
router.get('/source-master', getAllSources);
router.get('/course-details', getAllCourseDetails);

export default router;
