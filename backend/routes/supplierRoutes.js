const express = require('express');
const router = express.Router();
const {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require('../controllers/supplierController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getSuppliers)
  .post(protect, authorize('admin'), createSupplier);

router.route('/:id')
  .get(getSupplierById)
  .put(protect, authorize('admin'), updateSupplier)
  .delete(protect, authorize('admin'), deleteSupplier);

module.exports = router;
