const Product = require('../models/Product');

// @desc    Get all products with search, filtering, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { search, category, supplier, stockStatus, sort = '-createdAt', page = 1, limit = 50 } = req.query;

    const query = {};

    // Search query on productName or productId
    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: 'i' } },
        { productId: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (supplier) {
      query.supplier = supplier;
    }

    if (stockStatus) {
      query.stockStatus = stockStatus;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name')
      .populate('supplier', 'name email phone')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name description')
      .populate('supplier', 'name contactPerson email phone address');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { productName, category, supplier, price, quantity } = req.body;

    if (!productName || !category || !supplier || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide productName, category, supplier, and price',
      });
    }

    const product = await Product.create({
      productName: productName.trim(),
      category,
      supplier,
      price: Number(price),
      quantity: Number(quantity) || 0,
    });

    const populated = await Product.findById(product._id)
      .populate('category', 'name')
      .populate('supplier', 'name');

    res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const { productName, category, supplier, price, quantity } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (productName) product.productName = productName.trim();
    if (category) product.category = category;
    if (supplier) product.supplier = supplier;
    if (price !== undefined) product.price = Number(price);
    if (quantity !== undefined) product.quantity = Number(quantity);

    await product.save();

    const populated = await Product.findById(product._id)
      .populate('category', 'name')
      .populate('supplier', 'name');

    res.json({
      success: true,
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Quick adjust product quantity (+/-)
// @route   PATCH /api/products/:id/stock
// @access  Private (Admin or Staff)
const adjustStock = async (req, res, next) => {
  try {
    const { change, newQuantity } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (newQuantity !== undefined) {
      product.quantity = Math.max(0, Number(newQuantity));
    } else if (change !== undefined) {
      product.quantity = Math.max(0, product.quantity + Number(change));
    } else {
      return res.status(400).json({
        success: false,
        message: 'Provide change (+/- amount) or newQuantity',
      });
    }

    await product.save();

    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: {
        _id: product._id,
        productName: product.productName,
        productId: product.productId,
        quantity: product.quantity,
        stockStatus: product.stockStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product removed successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  adjustStock,
  deleteProduct,
};
