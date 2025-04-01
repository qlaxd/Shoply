const mongoose = require('mongoose');
const Statistics = require('../../../models/Statistics');

describe('Statistics Model Test', () => {
  // Test statistics creation with default values
  test('should create a statistics document with default values', async () => {
    const statistics = new Statistics({});
    const savedStats = await statistics.save();
    
    // Verify default values
    expect(savedStats._id).toBeDefined();
    expect(savedStats.totalUsers).toBe(0);
    expect(savedStats.activeUsers).toBe(0);
    expect(savedStats.newUsersThisMonth).toBe(0);
    expect(savedStats.totalLists).toBe(0);
    expect(savedStats.activeLists).toBe(0);
    expect(savedStats.completedLists).toBe(0);
    expect(savedStats.averageListsPerUser).toBe(0);
    expect(savedStats.totalProducts).toBe(0);
    expect(savedStats.averageProductsPerList).toBe(0);
    expect(savedStats.mostAddedProducts).toEqual([]);
    expect(savedStats.mostPurchasedProducts).toEqual([]);
    expect(savedStats.averageContributorsPerList).toBe(0);
    expect(savedStats.collaborativeListsPercentage).toBe(0);
    expect(savedStats.dailyActiveUsers).toEqual([]);
    expect(savedStats.weeklyActiveUsers).toEqual([]);
    expect(savedStats.monthlyActiveUsers).toEqual([]);
    expect(savedStats.lastUpdated).toBeDefined();
    expect(savedStats.createdAt).toBeDefined();
    expect(savedStats.updatedAt).toBeDefined();
  });
  
  // Test statistics creation with custom values
  test('should create a statistics document with custom values', async () => {
    const now = new Date();
    const customStats = {
      totalUsers: 100,
      activeUsers: 75,
      newUsersThisMonth: 25,
      totalLists: 200,
      activeLists: 150,
      completedLists: 50,
      averageListsPerUser: 2,
      totalProducts: 500,
      averageProductsPerList: 5,
      mostAddedProducts: [
        { productName: 'Milk', count: 50 },
        { productName: 'Bread', count: 45 }
      ],
      mostPurchasedProducts: [
        { productName: 'Eggs', count: 40 },
        { productName: 'Butter', count: 35 }
      ],
      averageContributorsPerList: 1.5,
      collaborativeListsPercentage: 30,
      dailyActiveUsers: [
        { date: now, count: 60 }
      ],
      weeklyActiveUsers: [
        { weekStart: now, count: 70 }
      ],
      monthlyActiveUsers: [
        { monthStart: now, count: 75 }
      ],
      lastUpdated: now
    };
    
    const statistics = new Statistics(customStats);
    const savedStats = await statistics.save();
    
    // Verify custom values
    expect(savedStats.totalUsers).toBe(customStats.totalUsers);
    expect(savedStats.activeUsers).toBe(customStats.activeUsers);
    expect(savedStats.newUsersThisMonth).toBe(customStats.newUsersThisMonth);
    expect(savedStats.totalLists).toBe(customStats.totalLists);
    expect(savedStats.activeLists).toBe(customStats.activeLists);
    expect(savedStats.completedLists).toBe(customStats.completedLists);
    expect(savedStats.averageListsPerUser).toBe(customStats.averageListsPerUser);
    expect(savedStats.totalProducts).toBe(customStats.totalProducts);
    expect(savedStats.averageProductsPerList).toBe(customStats.averageProductsPerList);
    
    // Verify arrays
    expect(savedStats.mostAddedProducts).toHaveLength(2);
    expect(savedStats.mostAddedProducts[0].productName).toBe('Milk');
    expect(savedStats.mostAddedProducts[0].count).toBe(50);
    expect(savedStats.mostAddedProducts[1].productName).toBe('Bread');
    expect(savedStats.mostAddedProducts[1].count).toBe(45);
    
    expect(savedStats.mostPurchasedProducts).toHaveLength(2);
    expect(savedStats.mostPurchasedProducts[0].productName).toBe('Eggs');
    expect(savedStats.mostPurchasedProducts[0].count).toBe(40);
    expect(savedStats.mostPurchasedProducts[1].productName).toBe('Butter');
    expect(savedStats.mostPurchasedProducts[1].count).toBe(35);
    
    expect(savedStats.dailyActiveUsers).toHaveLength(1);
    expect(savedStats.weeklyActiveUsers).toHaveLength(1);
    expect(savedStats.monthlyActiveUsers).toHaveLength(1);
    
    // The dates will be stored as Date objects, so convert to timestamps for comparison
    expect(savedStats.dailyActiveUsers[0].date.getTime()).toBe(customStats.dailyActiveUsers[0].date.getTime());
    expect(savedStats.weeklyActiveUsers[0].weekStart.getTime()).toBe(customStats.weeklyActiveUsers[0].weekStart.getTime());
    expect(savedStats.monthlyActiveUsers[0].monthStart.getTime()).toBe(customStats.monthlyActiveUsers[0].monthStart.getTime());
    
    expect(savedStats.lastUpdated.getTime()).toBe(customStats.lastUpdated.getTime());
  });
  
  // Test updating statistics
  test('should update statistics', async () => {
    const statistics = new Statistics({
      totalUsers: 50,
      activeUsers: 30
    });
    
    const savedStats = await statistics.save();
    
    // Update statistics
    savedStats.totalUsers = 60;
    savedStats.activeUsers = 40;
    savedStats.lastUpdated = new Date();
    savedStats.mostAddedProducts.push({ productName: 'Coffee', count: 20 });
    
    const updatedStats = await savedStats.save();
    
    // Verify updates
    expect(updatedStats.totalUsers).toBe(60);
    expect(updatedStats.activeUsers).toBe(40);
    expect(updatedStats.mostAddedProducts).toHaveLength(1);
    expect(updatedStats.mostAddedProducts[0].productName).toBe('Coffee');
    expect(updatedStats.mostAddedProducts[0].count).toBe(20);
  });
  
  // Test adding time-based metrics
  test('should add time-based metrics', async () => {
    const statistics = new Statistics({});
    const savedStats = await statistics.save();
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Add daily metrics
    savedStats.dailyActiveUsers.push(
      { date: yesterday, count: 40 },
      { date: today, count: 45 }
    );
    
    // Add weekly metrics
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay()); // First day of the week
    
    savedStats.weeklyActiveUsers.push(
      { weekStart: thisWeek, count: 65 }
    );
    
    // Add monthly metrics
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    savedStats.monthlyActiveUsers.push(
      { monthStart: thisMonth, count: 85 }
    );
    
    const updatedStats = await savedStats.save();
    
    // Verify time-based metrics
    expect(updatedStats.dailyActiveUsers).toHaveLength(2);
    expect(updatedStats.weeklyActiveUsers).toHaveLength(1);
    expect(updatedStats.monthlyActiveUsers).toHaveLength(1);
    
    // Verify dates (comparing day for simplicity)
    expect(updatedStats.dailyActiveUsers[0].date.getDate()).toBe(yesterday.getDate());
    expect(updatedStats.dailyActiveUsers[1].date.getDate()).toBe(today.getDate());
    expect(updatedStats.weeklyActiveUsers[0].weekStart.getDate()).toBe(thisWeek.getDate());
    expect(updatedStats.monthlyActiveUsers[0].monthStart.getDate()).toBe(thisMonth.getDate());
    
    // Verify counts
    expect(updatedStats.dailyActiveUsers[0].count).toBe(40);
    expect(updatedStats.dailyActiveUsers[1].count).toBe(45);
    expect(updatedStats.weeklyActiveUsers[0].count).toBe(65);
    expect(updatedStats.monthlyActiveUsers[0].count).toBe(85);
  });
}); 