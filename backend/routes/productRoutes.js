const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  adjustStock,
  deleteProduct,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

// Only admin can adjust stock levels (staff has strict read-only access)
router.patch('/:id/stock', protect, authorize('admin'), adjustStock);

module.exports = router;
