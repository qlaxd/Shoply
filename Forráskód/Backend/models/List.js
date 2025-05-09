const mongoose = require('mongoose');
const Category = require('./Category');
const ProductCatalog = require('./ProductCatalog');

const listSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  sharedUsers: [{
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    permissionLevel: { 
      type: String, 
      enum: ['view', 'edit'], 
      default: 'view' 
    }
  }],
  priority: { 
    type: Number, 
    default: 0 
  },
  products: [{
    catalogItem: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'ProductCatalog'
    },
    name: {
      type: String,
      required: function() { return !this.catalogItem; }
    },
    quantity: { 
      type: Number, 
      default: 1 
    },
    unit: {
      type: String,
      default: function() {
        return this.catalogItem ? undefined : 'db';
      }
    },
    isPurchased: { 
      type: Boolean, 
      default: false 
    },
    addedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    notes: String
  }],
  version: { 
    type: Number, 
    default: 1 
  },
  lastModified: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'archived'], 
    default: 'active' 
  },
  deleted: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

// Indexek a jobb teljesítményért
listSchema.index({ owner: 1, title: 1 });
listSchema.index({ "products.name": "text" });

module.exports = mongoose.model('List', listSchema);