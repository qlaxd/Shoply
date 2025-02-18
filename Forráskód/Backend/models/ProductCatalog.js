const mongoose = require('mongoose');

const ProductCatalogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  categoryHierarchy: [{
    type: String
  }],
  defaultUnit: String,
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

module.exports = mongoose.model('ProductCatalog', ProductCatalogSchema); 