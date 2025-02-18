const mongoose = require('mongoose');
const ProductCatalog = require('./ProductCatalog');

const productSchema = new mongoose.Schema({
  catalogItem: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: ProductCatalog,
    required: true
  },
  quantity: { type: Number, required: true },
  isPurchased: { type: Boolean, default: false }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;