import StatisticsService from '../../services/statistics.service';
import api from '../../services/api';
import API_ROUTES from '../../services/routes';

// Mock the api module
jest.mock('../../services/api', () => ({
  get: jest.fn()
}));

describe('StatisticsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserPersonalStats', () => {
    test('should fetch and return user personal statistics', async () => {
      const mockStatsData = {
        totalLists: 5,
        completedLists: 2,
        totalItems: 35,
        completedItems: 20,
        mostUsedCategories: [
          { name: 'Groceries', count: 15 },
          { name: 'Electronics', count: 8 }
        ]
      };
      api.get.mockResolvedValue({ data: mockStatsData });

      const result = await StatisticsService.getUserPersonalStats();

      expect(api.get).toHaveBeenCalledWith(API_ROUTES.STATISTICS.USER_PERSONAL);
      expect(result).toEqual(mockStatsData);
    });

    test('should throw error with API message when fetching statistics fails', async () => {
      const error = new Error('Network error');
      error.response = { data: { message: 'Failed to retrieve statistics' } };
      api.get.mockRejectedValue(error);

      await expect(StatisticsService.getUserPersonalStats()).rejects.toThrow('Failed to retrieve statistics');
    });

    test('should throw generic error when no specific error message is available', async () => {
      const error = new Error('Network error');
      api.get.mockRejectedValue(error);

      await expect(StatisticsService.getUserPersonalStats()).rejects.toThrow('Error loading personal statistics');
    });
  });
}); 