/**
 * Master Data Controller — MongoDB version
 * community_master, district_master → static arrays (no separate table needed)
 * category_master → Category model
 * course_details → Course model
 */
import { Category } from '../models/MasterData.js';
import Course from '../models/Course.js';

// Static lookup data (replaces simple lookup tables)
const COMMUNITIES = ['OC', 'BC', 'BCM', 'BCO', 'BC(Others)', 'MBC', 'DNC', 'SC', 'SCA', 'ST', 'Others'];
const DISTRICTS = ['Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni', 'Thirupattur', 'Thiruvallur', 'Thiruvannamalai', 'Thiruvarur', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tiruppur', 'Tiruvannamalai', 'Vellore', 'Villupuram', 'Virudhunagar'];

export const getAllCommunities = async (req, res) => {
  res.json({ success: true, data: COMMUNITIES.map(c => ({ Community: c })) });
};

export const getAllDistricts = async (req, res) => {
  res.json({ success: true, data: DISTRICTS.map(d => ({ District: d })) });
};

export const getAllCategories = async (req, res) => {
  try {
    const cats = await Category.find().sort({ categoryName: 1 });
    res.json({ success: true, data: cats.map(c => ({ category_id: c._id, category_name: c.categoryName })) });
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const addCategory = async (req, res) => {
  try {
    const { category_name } = req.body;
    if (!category_name?.trim()) return res.status(400).json({ success: false, message: 'Category name is required' });

    const existing = await Category.findOne({ categoryName: category_name.trim() });
    if (existing) return res.status(400).json({ success: false, message: 'Category already exists' });

    const cat = await Category.create({ categoryName: category_name.trim() });
    res.json({ success: true, message: 'Category added successfully', data: { category_id: cat._id, category_name: cat.categoryName } });
  } catch (err) {
    console.error('Error adding category:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getAllSources = async (req, res) => {
  // Static source list — no separate collection needed
  const sources = ['Walk-in', 'Social Media', 'Newspaper', 'Referral', 'Website', 'Phone', 'Others'];
  res.json({ success: true, data: sources.map((s, i) => ({ id: i + 1, source: s })) });
};

export const getAllCourseDetails = async (req, res) => {
  try {
    const courses = await Course.find().select('deptCode deptName').sort({ deptName: 1 });
    res.json({ success: true, data: courses.map(c => ({ Dept_Code: c.deptCode, Dept_Name: c.deptName })) });
  } catch (err) {
    console.error('Error fetching course details:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};