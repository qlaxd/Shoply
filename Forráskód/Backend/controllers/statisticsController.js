const Statistics = require('../models/Statistics');
const User = require('../models/User');
const List = require('../models/List');
const ProductCatalog = require('../models/ProductCatalog');

/**
 * Get all statistics
 */
exports.getStatistics = async (req, res) => {
  try {
    let statistics = await Statistics.findOne();
    
    // If no statistics document exists yet, create one
    if (!statistics) {
      statistics = await Statistics.create({});
      await this.updateStatistics();
      statistics = await Statistics.findOne();
    }
    
    res.status(200).json(statistics);
  } catch (err) {
    console.error('Error in getStatistics:', err);
    res.status(500).json({ message: 'Error retrieving statistics', error: err.message });
  }
};

/**
 * Update all statistics - this is a resource-intensive operation
 * Should be scheduled to run periodically (e.g., once per day)
 */
exports.updateStatistics = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);
    
    // User statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ 
      lastLogin: { $gte: thirtyDaysAgo } 
    });
    const newUsersThisMonth = await User.countDocuments({ 
      createdAt: { $gte: firstDayOfMonth } 
    });
    
    // List statistics
    const totalLists = await List.countDocuments();
    const activeLists = await List.countDocuments({ completed: false });
    const completedLists = await List.countDocuments({ completed: true });
    const averageListsPerUser = totalUsers > 0 ? totalLists / totalUsers : 0;
    
    // Product statistics
    const allLists = await List.find().populate('products');
    let productCounts = {};
    let purchasedProductCounts = {};
    let totalProducts = 0;
    let listProductCounts = [];
    
    for (const list of allLists) {
      if (!list.products) continue;
      
      listProductCounts.push(list.products.length);
      totalProducts += list.products.length;
      
      for (const product of list.products) {
        // Count product occurrences
        if (!productCounts[product.name]) {
          productCounts[product.name] = 0;
        }
        productCounts[product.name]++;
        
        // Count purchased product occurrences
        if (product.purchased) {
          if (!purchasedProductCounts[product.name]) {
            purchasedProductCounts[product.name] = 0;
          }
          purchasedProductCounts[product.name]++;
        }
      }
    }
    
    // Calculate average products per list
    const averageProductsPerList = listProductCounts.length > 0 
      ? listProductCounts.reduce((sum, count) => sum + count, 0) / listProductCounts.length 
      : 0;
    
    // Get top 10 most added products
    const mostAddedProducts = Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([productName, count]) => ({ productName, count }));
    
    // Get top 10 most purchased products
    const mostPurchasedProducts = Object.entries(purchasedProductCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([productName, count]) => ({ productName, count }));
    
    // Collaboration statistics
    let contributorCounts = [];
    let collaborativeLists = 0;
    
    for (const list of allLists) {
      // Count unique contributors
      if (!list.products) continue;
      
      const contributors = new Set();
      for (const product of list.products) {
        if (product.addedBy) {
          contributors.add(product.addedBy.toString());
        }
      }
      
      const contributorCount = contributors.size;
      contributorCounts.push(contributorCount);
      
      // A list is collaborative if it has more than one contributor
      if (contributorCount > 1) {
        collaborativeLists++;
      }
    }
    
    const averageContributorsPerList = contributorCounts.length > 0 
      ? contributorCounts.reduce((sum, count) => sum + count, 0) / contributorCounts.length 
      : 0;
    
    const collaborativeListsPercentage = totalLists > 0 
      ? (collaborativeLists / totalLists) * 100 
      : 0;
    
    // Time-based user metrics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const activeUsersToday = await User.countDocuments({
      lastLogin: { $gte: today }
    });
    
    // Get the start of the current week (Sunday)
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const activeUsersThisWeek = await User.countDocuments({
      lastLogin: { $gte: startOfWeek }
    });
    
    // Update or create statistics document
    const statistics = await Statistics.findOneAndUpdate({}, {
      totalUsers,
      activeUsers,
      newUsersThisMonth,
      totalLists,
      activeLists,
      completedLists,
      averageListsPerUser,
      totalProducts,
      averageProductsPerList,
      mostAddedProducts,
      mostPurchasedProducts,
      averageContributorsPerList,
      collaborativeListsPercentage,
      $push: {
        dailyActiveUsers: { 
          date: today, 
          count: activeUsersToday 
        },
        weeklyActiveUsers: { 
          weekStart: startOfWeek, 
          count: activeUsersThisWeek 
        },
        monthlyActiveUsers: { 
          monthStart: firstDayOfMonth, 
          count: activeUsers 
        }
      },
      lastUpdated: new Date()
    }, { upsert: true, new: true });
    
    // If this was called via API request, send response
    if (res) {
      res.status(200).json({ 
        message: 'Statistics updated successfully', 
        statistics 
      });
    }
    
    return statistics;
  } catch (err) {
    console.error('Error in updateStatistics:', err);
    
    // If this was called via API request, send error response
    if (res) {
      res.status(500).json({ 
        message: 'Error updating statistics', 
        error: err.message 
      });
    }
    
    throw err;
  }
};

/**
 * Get user growth statistics
 */
exports.getUserGrowthStats = async (req, res) => {
  try {
    const statistics = await Statistics.findOne();
    
    if (!statistics) {
      return res.status(404).json({ message: 'No statistics available' });
    }
    
    const userGrowth = {
      totalUsers: statistics.totalUsers,
      activeUsers: statistics.activeUsers,
      newUsersThisMonth: statistics.newUsersThisMonth,
      monthlyActiveUsers: statistics.monthlyActiveUsers
    };
    
    res.status(200).json(userGrowth);
  } catch (err) {
    console.error('Error in getUserGrowthStats:', err);
    res.status(500).json({ message: 'Error retrieving user growth statistics', error: err.message });
  }
};

/**
 * Get list activity statistics
 */
exports.getListActivityStats = async (req, res) => {
  try {
    const statistics = await Statistics.findOne();
    
    if (!statistics) {
      return res.status(404).json({ message: 'No statistics available' });
    }
    
    const listActivity = {
      totalLists: statistics.totalLists,
      activeLists: statistics.activeLists,
      completedLists: statistics.completedLists,
      averageListsPerUser: statistics.averageListsPerUser,
      collaborativeListsPercentage: statistics.collaborativeListsPercentage
    };
    
    res.status(200).json(listActivity);
  } catch (err) {
    console.error('Error in getListActivityStats:', err);
    res.status(500).json({ message: 'Error retrieving list activity statistics', error: err.message });
  }
};

/**
 * Get product statistics
 */
exports.getProductStats = async (req, res) => {
  try {
    const statistics = await Statistics.findOne();
    
    if (!statistics) {
      return res.status(404).json({ message: 'No statistics available' });
    }
    
    const productStats = {
      totalProducts: statistics.totalProducts,
      averageProductsPerList: statistics.averageProductsPerList,
      mostAddedProducts: statistics.mostAddedProducts,
      mostPurchasedProducts: statistics.mostPurchasedProducts
    };
    
    res.status(200).json(productStats);
  } catch (err) {
    console.error('Error in getProductStats:', err);
    res.status(500).json({ message: 'Error retrieving product statistics', error: err.message });
  }
};
