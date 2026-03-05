/**
 * User Controller — MongoDB version
 * Replaces all MySQL db.query() with Mongoose operations
 */

import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Role from '../models/Role.js';
import SidebarModule from '../models/SidebarModule.js';
import Staff from '../models/Staff.js';

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

// ── Create new role ───────────────────────────────────────────────────────────

export const createRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ error: 'Role name is required' });
    }

    // Case-insensitive duplicate check
    const existing = await Role.findOne({ role: { $regex: new RegExp(`^${role}$`, 'i') } });
    if (existing) {
      return res.status(400).json({ error: 'Role already exists. Please select from existing roles.' });
    }

    const newRole = await Role.create({ role });

    res.status(201).json({
      success: true,
      id: newRole._id,
      role: newRole.role
    });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ error: 'Failed to create role' });
  }
};

// ── Get all sidebar modules ───────────────────────────────────────────────────

export const getModules = async (req, res) => {
  try {
    const modules = await SidebarModule.find({ isActive: true })
      .select('moduleName moduleKey moduleCategory isActive');
    res.json(modules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
};

// ── Get all staff (for user creation dropdown) ────────────────────────────────

export const getStaff = async (req, res) => {
  try {
    const staff = await Staff.find()
      .select('staffId staffName')
      .sort({ staffName: 1 });
    res.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
};

// ── Get all users ─────────────────────────────────────────────────────────────

export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// ── Create new user ───────────────────────────────────────────────────────────

export const createUser = async (req, res) => {
  try {
    const { userRole, staffName, staffId, userId, password, accessModules } = req.body;

    if (!userRole || !staffName || !staffId || !userId || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Convert accessModules object { "dashboard": true, "hr": false } → Array of keys
    const selectedModules = Object.keys(accessModules || {})
      .filter(key => accessModules[key] === true);

    if (selectedModules.length === 0) {
      return res.status(400).json({ error: 'At least one module must be selected' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      role: userRole,
      staffName,
      staffId,
      username: userId,
      password: hashedPassword,
      moduleAccess: selectedModules,  // ✅ Array in MongoDB, no comma-string
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      id: newUser._id
    });

  } catch (error) {
    console.error('Error creating user:', error);

    if (error.code === 11000) {
      // MongoDB duplicate key error
      return res.status(400).json({ error: 'User ID already exists' });
    }

    res.status(500).json({ error: 'Failed to create user' });
  }
};

// ── Update user ───────────────────────────────────────────────────────────────

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { userRole, staffName, staffId, userId, password, accessModules } = req.body;

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!userRole || !staffName || !staffId || !userId || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const selectedModules = Object.keys(accessModules || {})
      .filter(key => accessModules[key] === true);

    if (selectedModules.length === 0) {
      return res.status(400).json({ error: 'At least one module must be selected' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(id, {
      role: userRole,
      staffName,
      staffId,
      username: userId,
      password: hashedPassword,
      moduleAccess: selectedModules,
    });

    res.json({ success: true, message: 'User updated successfully' });

  } catch (error) {
    console.error('Error updating user:', error);

    if (error.code === 11000) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    res.status(500).json({ error: 'Failed to update user' });
  }
};

// ── Delete user ───────────────────────────────────────────────────────────────

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await User.findByIdAndDelete(id);

    res.json({ success: true, message: 'User deleted successfully' });

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
