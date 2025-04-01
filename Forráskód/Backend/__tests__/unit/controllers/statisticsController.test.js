const Statistics = require('../../../models/Statistics');
const User = require('../../../models/User');
const List = require('../../../models/List');
const ProductCatalog = require('../../../models/ProductCatalog');
const statisticsController = require('../../../controllers/statisticsController');

// Mock all models
jest.mock('../../../models/Statistics');
jest.mock('../../../models/User');
jest.mock('../../../models/List');
jest.mock('../../../models/ProductCatalog');

describe('Statistics Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup request and response
    req = {
      user: { id: 'user123' },
      params: {},
      body: {},
      query: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('getStatistics', () => {
    test('should return existing statistics', async () => {
      // Arrange
      const mockStats = { 
        totalUsers: 5, 
        activeUsers: 3,
        lastUpdated: new Date()
      };
      
      Statistics.findOne.mockResolvedValue(mockStats);
      
      // Act
      await statisticsController.getStatistics(req, res);
      
      // Assert
      expect(Statistics.findOne).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockStats);
    });

    test('should create statistics if none exist', async () => {
      // Arrange
      const mockStats = { 
        totalUsers: 5, 
        activeUsers: 3,
        lastUpdated: new Date()
      };
      
      // First call returns null, second call (after creation) returns stats
      Statistics.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(mockStats);
      Statistics.create.mockResolvedValue({});
      
      // Mock updateStatistics implementation
      statisticsController.updateStatistics = jest.fn().mockResolvedValue(mockStats);
      
      // Act
      await statisticsController.getStatistics(req, res);
      
      // Assert
      expect(Statistics.findOne).toHaveBeenCalledTimes(2);
      expect(Statistics.create).toHaveBeenCalledWith({});
      expect(statisticsController.updateStatistics).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockStats);
    });

    test('should handle errors', async () => {
      // Arrange
      const error = new Error('Database error');
      Statistics.findOne.mockRejectedValue(error);
      
      // Act
      await statisticsController.getStatistics(req, res);
      
      // Assert
      expect(Statistics.findOne).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Error retrieving statistics'
      }));
    });
  });

  describe('getUserGrowthStats', () => {
    test('should return user growth statistics', async () => {
      // Arrange
      const mockStats = {
        totalUsers: 100,
        activeUsers: 50,
        newUsersThisMonth: 10,
        monthlyActiveUsers: [
          { monthStart: new Date(), count: 45 }
        ]
      };
      
      Statistics.findOne.mockResolvedValue(mockStats);
      
      // Act
      await statisticsController.getUserGrowthStats(req, res);
      
      // Assert
      expect(Statistics.findOne).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        totalUsers: mockStats.totalUsers,
        activeUsers: mockStats.activeUsers,
        newUsersThisMonth: mockStats.newUsersThisMonth,
        monthlyActiveUsers: mockStats.monthlyActiveUsers
      });
    });

    test('should return 404 if no statistics found', async () => {
      // Arrange
      Statistics.findOne.mockResolvedValue(null);
      
      // Act
      await statisticsController.getUserGrowthStats(req, res);
      
      // Assert
      expect(Statistics.findOne).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'No statistics available'
      }));
    });

    test('should handle errors', async () => {
      // Arrange
      const error = new Error('Database error');
      Statistics.findOne.mockRejectedValue(error);
      
      // Act
      await statisticsController.getUserGrowthStats(req, res);
      
      // Assert
      expect(Statistics.findOne).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Error retrieving user growth statistics'
      }));
    });
  });

  describe('getListActivityStats', () => {
    test('should return list activity statistics', async () => {
      // Arrange
      const mockStats = {
        totalLists: 200,
        activeLists: 150,
        completedLists: 50,
        averageListsPerUser: 2,
        collaborativeListsPercentage: 30
      };
      
      Statistics.findOne.mockResolvedValue(mockStats);
      
      // Act
      await statisticsController.getListActivityStats(req, res);
      
      // Assert
      expect(Statistics.findOne).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        totalLists: mockStats.totalLists,
        activeLists: mockStats.activeLists,
        completedLists: mockStats.completedLists,
        averageListsPerUser: mockStats.averageListsPerUser,
        collaborativeListsPercentage: mockStats.collaborativeListsPercentage
      });
    });

    test('should return 404 if no statistics found', async () => {
      // Arrange
      Statistics.findOne.mockResolvedValue(null);
      
      // Act
      await statisticsController.getListActivityStats(req, res);
      
      // Assert
      expect(Statistics.findOne).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'No statistics available'
      }));
    });

    test('should handle errors', async () => {
      // Arrange
      const error = new Error('Database error');
      Statistics.findOne.mockRejectedValue(error);
      
      // Act
      await statisticsController.getListActivityStats(req, res);
      
      // Assert
      expect(Statistics.findOne).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Error retrieving list activity statistics'
      }));
    });
  });

  describe('getProductStats', () => {
    test('should return product statistics', async () => {
      // Arrange
      const mockStats = {
        totalProducts: 500,
        averageProductsPerList: 5,
        mostAddedProducts: [
          { productName: 'Product 1', count: 30 },
          { productName: 'Product 2', count: 25 }
        ],
        mostPurchasedProducts: [
          { productName: 'Product 1', count: 28 },
          { productName: 'Product 3', count: 22 }
        ]
      };
      
      Statistics.findOne.mockResolvedValue(mockStats);
      
      // Act
      await statisticsController.getProductStats(req, res);
      
      // Assert
      expect(Statistics.findOne).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        totalProducts: mockStats.totalProducts,
        averageProductsPerList: mockStats.averageProductsPerList,
        mostAddedProducts: mockStats.mostAddedProducts,
        mostPurchasedProducts: mockStats.mostPurchasedProducts
      });
    });

    test('should return 404 if no statistics found', async () => {
      // Arrange
      Statistics.findOne.mockResolvedValue(null);
      
      // Act
      await statisticsController.getProductStats(req, res);
      
      // Assert
      expect(Statistics.findOne).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'No statistics available'
      }));
    });

    test('should handle errors', async () => {
      // Arrange
      const error = new Error('Database error');
      Statistics.findOne.mockRejectedValue(error);
      
      // Act
      await statisticsController.getProductStats(req, res);
      
      // Assert
      expect(Statistics.findOne).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Error retrieving product statistics'
      }));
    });
  });

  describe('getUserPersonalStats', () => {
    test('should return user personal statistics', async () => {
      // Arrange
      const mockActiveLists = [
        { _id: 'list1', status: 'active', products: [], createdAt: new Date() }
      ];
      
      const mockCompletedLists = [
        { _id: 'list2', status: 'completed', products: [], createdAt: new Date() }
      ];
      
      const mockSharedLists = [
        { _id: 'list3', status: 'active', products: [], createdAt: new Date() }
      ];
      
      // Simulate lists with different statuses
      List.find.mockImplementation((query) => {
        if (query.owner === 'user123') {
          return Promise.resolve([...mockActiveLists, ...mockCompletedLists]);
        } else if (query['sharedUsers.user'] === 'user123') {
          return Promise.resolve(mockSharedLists);
        }
        return Promise.resolve([]);
      });
      
      // Act
      await statisticsController.getUserPersonalStats(req, res);
      
      // Assert
      expect(List.find).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        totalOwnedLists: 2,
        totalSharedLists: 1,
        lastUpdated: expect.any(Date)
      }));
    });

    test('should handle lists with products', async () => {
      // Arrange
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const mockLists = [
        { 
          _id: 'list1', 
          status: 'active', 
          products: [
            { name: 'Product 1', isPurchased: true },
            { name: 'Product 1', isPurchased: false },
            { name: 'Product 2', isPurchased: true }
          ],
          createdAt: new Date()
        },
        {
          _id: 'list2',
          status: 'completed',
          products: [
            { name: 'Product 3', isPurchased: true }
          ],
          createdAt: thirtyDaysAgo
        }
      ];
      
      List.find.mockResolvedValue(mockLists);
      
      // Act
      await statisticsController.getUserPersonalStats(req, res);
      
      // Assert
      expect(List.find).toHaveBeenCalledWith({ owner: 'user123' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        totalProducts: 4,
        totalPurchasedProducts: 3,
        productCompletionRate: 75,
        mostAddedProducts: expect.arrayContaining([
          expect.objectContaining({ productName: 'Product 1', count: 2 })
        ])
      }));
    });

    test('should handle errors', async () => {
      // Arrange
      const error = new Error('Database error');
      List.find.mockRejectedValue(error);
      
      // Act
      await statisticsController.getUserPersonalStats(req, res);
      
      // Assert
      expect(List.find).toHaveBeenCalledWith({ owner: 'user123' });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Error retrieving personal statistics'
      }));
    });
  });
}); 