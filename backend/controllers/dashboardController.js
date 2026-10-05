const Product = require('../models/Product');
const Category = require('../models/Category');
const Supplier = require('../models/Supplier');

// @desc    Get dashboard metrics & summary
// @route   GET /api/dashboard/stats
// @access  Public
const getDashboardStats = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalSuppliers = await Supplier.countDocuments();

    const lowStockCount = await Product.countDocuments({ stockStatus: 'low-stock' });
    const outOfStockCount = await Product.countDocuments({ stockStatus: 'out-of-stock' });
    const inStockCount = await Product.countDocuments({ stockStatus: 'in-stock' });

    // Inventory value and total units
    const products = await Product.find({}, 'price quantity');
    const totalInventoryValue = products.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
    const totalUnits = products.reduce((acc, curr) => acc + curr.quantity, 0);

    // Recent low stock items
    const lowStockAlerts = await Product.find({
      stockStatus: { $in: ['low-stock', 'out-of-stock'] },
    })
      .populate('category', 'name')
      .populate('supplier', 'name')
      .sort('quantity')
      .limit(6);

    // Category breakdown
    const categories = await Category.find({}, 'name');
    const categoryStats = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat._id });
        return {
          name: cat.name,
          count,
        };
      })
    );

    res.json({
      success: true,
      data: {
        kpis: {
          totalProducts,
          totalCategories,
          totalSuppliers,
          totalInventoryValue: Number(totalInventoryValue.toFixed(2)),
          totalUnits,
          inStockCount,
          lowStockCount,
          outOfStockCount,
        },
        lowStockAlerts,
        categoryStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
