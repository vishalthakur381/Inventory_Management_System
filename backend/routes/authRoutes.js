const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
  createStaffUser,
  deleteUser,
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.post('/staff', protect, authorize('admin'), createStaffUser);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router;

