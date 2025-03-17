const mongoose = require('mongoose');

const statisticsSchema = new mongoose.Schema({
  // User statistics
  totalUsers: { type: Number, default: 0 },
  activeUsers: { type: Number, default: 0 }, // Active in last 30 days
  newUsersThisMonth: { type: Number, default: 0 },
  
  // List statistics
  totalLists: { type: Number, default: 0 },
  activeLists: { type: Number, default: 0 },
  completedLists: { type: Number, default: 0 },
  averageListsPerUser: { type: Number, default: 0 },
  
  // Product statistics
  totalProducts: { type: Number, default: 0 },
  averageProductsPerList: { type: Number, default: 0 },
  mostAddedProducts: [{
    productName: String,
    count: Number
  }],
  mostPurchasedProducts: [{
    productName: String,
    count: Number
  }],
  
  // Collaboration statistics
  averageContributorsPerList: { type: Number, default: 0 },
  collaborativeListsPercentage: { type: Number, default: 0 },
  
  // Time-based metrics
  dailyActiveUsers: [{ 
    date: Date,
    count: Number
  }],
  weeklyActiveUsers: [{ 
    weekStart: Date,
    count: Number
  }],
  monthlyActiveUsers: [{ 
    monthStart: Date,
    count: Number
  }],
  
  // Last updated timestamp
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Statistics', statisticsSchema);
