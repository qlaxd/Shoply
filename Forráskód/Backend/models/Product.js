const mongoose = require('mongoose');
const ProductCatalog = require('./ProductCatalog');

const productSchema = new mongoose.Schema({
  catalogItem: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: ProductCatalog,
    required: false
  },
  name: { // fallback ha nem létezik a katalógusban, akkor megadható a neve
    type: String,
    required: function() { return !this.catalogItem; }
  },
  unit: {
    type: String,
    default: function() {
      return this.catalogItem ? undefined : 'db';
    }
  },
  quantity: { type: Number, required: true },
  isPurchased: { type: Boolean, default: false }
});
 
module.exports = mongoose.model('Product', productSchema);