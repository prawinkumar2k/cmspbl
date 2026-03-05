/**
 * Auth Controller — MongoDB version
 * Replaces MySQL queries with Mongoose operations
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Role from '../models/Role.js';
import SidebarModule from '../models/SidebarModule.js';
import ActivityLog from '../models/ActivityLog.js';
import Student from '../models/Student.js';
import Staff from '../models/Staff.js';

// ── Helper: Log activity ──────────────────────────────────────────────────────

const logActivity = async (username, role, action) => {
  try {
    await ActivityLog.create({ username, role, action });
  } catch (err) {
    console.error('Failed to log activity:', err.message);
  }
};

// ── Get all roles ─────────────────────────────────────────────────────────────

export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ role: 1 });
    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
};

// ── Login ─────────────────────────────────────────────────────────────────────

export const login = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    console.log(`Login attempt for User: ${username}, Role: ${role}`);

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    if (!role) {
      return res.status(400).json({ error: 'Please select a role' });
    }

    let user, roleId, roleName;

    if (role.toLowerCase() === 'student') {
      // ── Student login from student_master → Student collection ──
      const student = await Student.findOne({ registerNumber: username });

      if (!student) {
        return res.status(401).json({ error: 'Invalid register number or password' });
      }

      // Students may have plain-text password (from legacy MySQL migration)
      let isPasswordValid = false;
      if (password === student.password) {
        isPasswordValid = true;
      } else {
        // Try bcrypt in case password was hashed during migration
        isPasswordValid = await bcrypt.compare(password, student.password || '').catch(() => false);
      }

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid register number or password' });
      }

      const roleDoc = await Role.findOne({ role: { $regex: new RegExp(`^${role}$`, 'i') } });
      roleId = roleDoc?._id || null;
      roleName = role;

      user = {
        id: student._id,
        username: student.registerNumber,
        name: student.studentName,
        staff_id: student.registerNumber,
        password: student.password,
        module_access: [],
        role_id: roleId,
        role_name: roleName,
      };

    } else {
      // ── Staff / Admin login from users collection ──
      const dbUser = await User.findOne({ username });

      if (!dbUser) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const isPasswordValid = await bcrypt.compare(password, dbUser.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Verify role matches
      if (dbUser.role.toLowerCase() !== role.toLowerCase()) {
        return res.status(403).json({
          error: `Access denied. You are not authorized as ${role}. Your role is ${dbUser.role}.`
        });
      }

      const roleDoc = await Role.findOne({ role: { $regex: new RegExp(`^${dbUser.role}$`, 'i') } });
      roleId = roleDoc?._id || null;
      roleName = dbUser.role;

      user = {
        id: dbUser._id,
        username: dbUser.username,
        name: dbUser.staffName,
        staff_id: dbUser.staffId,
        module_access: dbUser.moduleAccess,  // Already an Array in MongoDB
        role_id: roleId,
        role_name: roleName,
      };
    }

    // Generate JWT
    const token = jwt.sign(
      {
        user_id: user.id,
        username: user.username,
        role_id: roleId,
        role_name: roleName,
        staff_name: user.name,
        staff_id: user.staff_id,
        module_access: Array.isArray(user.module_access)
          ? user.module_access.join(',')   // Keep comma string in token for backward compat
          : user.module_access || ''
      },
      process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
      { expiresIn: '24h' }
    );

    await logActivity(user.username, roleName, 'Logged in');
    console.log('Login successful, token generated');

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        staff_name: user.name,
        staff_id: user.staff_id,
        role_id: roleId,
        role_name: roleName,
        module_access: Array.isArray(user.module_access)
          ? user.module_access.join(',')
          : user.module_access || ''
      }
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

// ── Get Sidebar Modules ───────────────────────────────────────────────────────

export const getSidebar = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role_name;

    // Student has no sidebar (uses static sidebar)
    if (userRole?.toLowerCase() === 'student') {
      return res.json({ success: true, data: [] });
    }

    // Admin gets ALL active modules
    if (userRole?.toLowerCase() === 'admin') {
      const allModules = await SidebarModule.find({ isActive: true })
        .sort({ displayOrder: 1, moduleCategory: 1 });
      return res.json({ success: true, data: allModules });
    }

    // Other roles: filter by their moduleAccess array
    const dbUser = await User.findById(userId).select('moduleAccess');
    if (!dbUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const allowedModules = dbUser.moduleAccess || [];
    if (allowedModules.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // ✅ MongoDB: $in instead of MySQL FIND_IN_SET / IN (?,?,?)
    const modules = await SidebarModule.find({
      isActive: true,
      moduleKey: { $in: allowedModules }
    }).sort({ displayOrder: 1, moduleCategory: 1 });

    res.json({ success: true, data: modules });

  } catch (error) {
    console.error('Error fetching sidebar modules:', error);
    res.status(500).json({ error: 'Failed to fetch sidebar modules', details: error.message });
  }
};

// ── Get User Profile ──────────────────────────────────────────────────────────

export const getUserProfile = async (req, res) => {
  try {
    const userRole = req.user.role_name;
    const identId = req.user.staff_id;

    if (userRole?.toLowerCase() === 'student') {
      const student = await Student.findOne(
        { registerNumber: identId },
        { registerNumber: 1, studentName: 1, deptName: 1, stdEmail: 1, studentMobile: 1, dob: 1, currentAddress: 1, photoPath: 1 }
      );

      if (!student) {
        return res.json({
          success: true,
          data: {
            regNo: identId,
            studentName: req.user.staff_name,
            role_name: userRole,
            photo: null
          }
        });
      }

      return res.json({
        success: true,
        data: {
          regNo: student.registerNumber,
          studentName: student.studentName,
          department: student.deptName,
          email: student.stdEmail,
          phone: student.studentMobile,
          dob: student.dob,
          address: student.currentAddress,
          photo: student.photoPath ? `/assets/master/${student.photoPath}` : null,
          role_name: userRole
        }
      });
    }

    // Staff/Admin profile
    const staffId = req.user.staff_id;
    if (!staffId) {
      return res.json({
        success: true,
        data: {
          staff_id: null,
          staff_name: req.user.staff_name,
          designation: null,
          photo: null,
          role_name: userRole
        }
      });
    }

    const staff = await Staff.findOne(
      { staffId },
      { staffId: 1, staffName: 1, designation: 1, photo: 1 }
    );

    if (!staff) {
      return res.json({
        success: true,
        data: {
          staff_id: staffId,
          staff_name: req.user.staff_name,
          designation: null,
          photo: null,
          role_name: userRole
        }
      });
    }

    res.json({
      success: true,
      data: {
        staff_id: staff.staffId,
        staff_name: staff.staffName,
        designation: staff.designation,
        photo: staff.photo ? `/assets/master/${staff.photo}` : null,
        role_name: userRole
      }
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.json({
      success: true,
      data: {
        staff_id: req.user?.staff_id || null,
        staff_name: req.user?.staff_name || 'Unknown',
        designation: null,
        photo: null,
        role_name: req.user?.role_name || 'Unknown'
      }
    });
  }
};

// ── Test User Password (debug endpoint) ──────────────────────────────────────

export const testUserPassword = async (req, res) => {
  try {
    const { username, testPassword } = req.query;
    const user = await User.findOne({ username });

    if (!user) {
      return res.json({ error: 'User not found' });
    }

    let passwordMatch = false;
    if (testPassword) {
      passwordMatch = await bcrypt.compare(testPassword, user.password);
    }

    res.json({
      username: user.username,
      role: user.role,
      passwordHashLength: user.password ? user.password.length : 0,
      passwordStartsWith: user.password ? user.password.substring(0, 7) : '',
      isBcryptHash: user.password
        ? user.password.startsWith('$2a$') || user.password.startsWith('$2b$')
        : false,
      testPassword: testPassword || 'Not provided',
      passwordMatch: testPassword ? passwordMatch : 'No test password provided'
    });
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ error: 'Failed to check user' });
  }
};

// ── Logout ────────────────────────────────────────────────────────────────────

export const logout = async (req, res) => {
  try {
    await logActivity(req.user.username, req.user.role_name, 'Logged out');
    res.json({ success: true, message: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ error: 'Logout failed. Please try again.' });
  }
};
