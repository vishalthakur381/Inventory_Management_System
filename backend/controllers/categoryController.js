const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc    Get all categories with product counts
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    
    // Enrich categories with product count
    const enriched = await Promise.all(
      categories.map(async (cat) => {
        const productCount = await Product.countDocuments({ category: cat._id });
        return {
          ...cat.toObject(),
          productCount,
        };
      })
    );

    res.json({
      success: true,
      count: enriched.length,
      data: enriched,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const productCount = await Product.countDocuments({ category: category._id });

    res.json({
      success: true,
      data: {
        ...category.toObject(),
        productCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
      });
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists',
      });
    }

    const category = await Category.create({
      name: name.trim(),
      description: description || '',
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    if (name) category.name = name.trim();
    if (description !== undefined) category.description = description;

    await category.save();

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Check if category is used in products
    const productsUsingCategory = await Product.countDocuments({ category: category._id });
    if (productsUsingCategory > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category because it is linked to ${productsUsingCategory} product(s)`,
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Category deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
