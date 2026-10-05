const Supplier = require('../models/Supplier');
const Product = require('../models/Product');

// @desc    Get all suppliers with supplied product count
// @route   GET /api/suppliers
// @access  Public
const getSuppliers = async (req, res, next) => {
  try {
    const suppliers = await Supplier.find().sort({ name: 1 });

    const enriched = await Promise.all(
      suppliers.map(async (sup) => {
        const productCount = await Product.countDocuments({ supplier: sup._id });
        return {
          ...sup.toObject(),
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

// @desc    Get single supplier
// @route   GET /api/suppliers/:id
// @access  Public
const getSupplierById = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found',
      });
    }

    const productCount = await Product.countDocuments({ supplier: supplier._id });

    res.json({
      success: true,
      data: {
        ...supplier.toObject(),
        productCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create supplier
// @route   POST /api/suppliers
// @access  Private/Admin
const createSupplier = async (req, res, next) => {
  try {
    const { name, contactPerson, email, phone, address } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Supplier name is required',
      });
    }

    const supplier = await Supplier.create({
      name: name.trim(),
      contactPerson: contactPerson || '',
      email: email || '',
      phone: phone || '',
      address: address || '',
    });

    res.status(201).json({
      success: true,
      data: supplier,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update supplier
// @route   PUT /api/suppliers/:id
// @access  Private/Admin
const updateSupplier = async (req, res, next) => {
  try {
    const { name, contactPerson, email, phone, address } = req.body;
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found',
      });
    }

    if (name) supplier.name = name.trim();
    if (contactPerson !== undefined) supplier.contactPerson = contactPerson;
    if (email !== undefined) supplier.email = email;
    if (phone !== undefined) supplier.phone = phone;
    if (address !== undefined) supplier.address = address;

    await supplier.save();

    res.json({
      success: true,
      data: supplier,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete supplier
// @route   DELETE /api/suppliers/:id
// @access  Private/Admin
const deleteSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found',
      });
    }

    const productsUsingSupplier = await Product.countDocuments({ supplier: supplier._id });
    if (productsUsingSupplier > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete supplier because it supplies ${productsUsingSupplier} product(s)`,
      });
    }

    await Supplier.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Supplier deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
