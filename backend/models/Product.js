const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    productId: {
      type: String,
      unique: true,
      default: () => `PRD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
      required: [true, 'Supplier is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    stockStatus: {
      type: String,
      enum: {
        values: ['in-stock', 'low-stock', 'out-of-stock'],
        message: '{VALUE} is not a valid stock status',
      },
      default: function () {
        const qty = typeof this.quantity === 'number' ? this.quantity : 0;
        if (qty === 0) return 'out-of-stock';
        if (qty <= 10) return 'low-stock';
        return 'in-stock';
      },
    },
  },
  {
    timestamps: true,
  }
);

// Helper to recalculate stock status and product ID
function calculateProductFields(doc) {
  if (!doc.productId) {
    doc.productId = `PRD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  if (typeof doc.quantity === 'number') {
    if (doc.quantity === 0) {
      doc.stockStatus = 'out-of-stock';
    } else if (doc.quantity <= 10) {
      doc.stockStatus = 'low-stock';
    } else {
      doc.stockStatus = 'in-stock';
    }
  }
}

// Auto-generate productId if missing and auto-calculate stockStatus before validation and save
productSchema.pre('validate', function () {
  calculateProductFields(this);
});

productSchema.pre('save', function () {
  calculateProductFields(this);
});

// Indexes for faster search
productSchema.index({ productName: 1, category: 1 });
productSchema.index({ productName: 1 });
productSchema.index({ category: 1 });

module.exports = mongoose.model('Product', productSchema);
