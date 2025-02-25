const mongoose = require('mongoose');

const productCatalogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  category:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  defaultUnit: String,
  barcode: {
    type: String,
    unique: true,
    sparse: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastUsed: {
    type: Date,
    default: Date.now
  },
  usageCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Teljes szöveges keresés támogatása
productCatalogSchema.index({ name: "text" });

module.exports = mongoose.model('ProductCatalog', productCatalogSchema); 