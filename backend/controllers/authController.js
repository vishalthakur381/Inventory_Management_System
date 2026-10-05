const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (id, role, name) => {
  return jwt.sign(
    { id, role, name },
    process.env.JWT_SECRET || 'inventory_jwt_secret_dev_key_2026',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'staff',
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role, user.name),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role, user.name),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({
      success: true,
      data: user || req.user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (admin)
// @route   GET /api/auth/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new staff member (owner / admin only)
// @route   POST /api/auth/staff
// @access  Private/Admin
const createStaffUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, warehouseLocation } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide staff name, work email, and password',
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user or staff member already exists with this email',
      });
    }

    const staffUser = await User.create({
      name,
      email,
      password,
      role: 'staff',
    });

    res.status(201).json({
      success: true,
      message: 'Staff member created successfully with read-only access',
      data: {
        _id: staffUser._id,
        name: staffUser.name,
        email: staffUser.email,
        role: staffUser.role,
        phone: phone || '',
        warehouseLocation: warehouseLocation || 'Central Warehouse',
        createdAt: staffUser.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a staff user (owner / admin only)
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (targetUser._id.toString() === req.user.id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Owner cannot delete their own account',
      });
    }

    if (targetUser.role === 'admin' && targetUser.email === 'admin@bharatstock.in') {
      return res.status(400).json({
        success: false,
        message: 'Default system administrator cannot be removed',
      });
    }

    await targetUser.deleteOne();

    res.json({
      success: true,
      message: 'Staff member removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
  createStaffUser,
  deleteUser,
};
