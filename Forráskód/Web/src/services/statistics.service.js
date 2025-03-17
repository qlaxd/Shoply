import api from './api';
import API_ROUTES from './routes';

const StatisticsService = {
  getUserPersonalStats: async () => {
    try {
      const response = await api.get(API_ROUTES.STATISTICS.USER_PERSONAL);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error loading personal statistics');
    }
  }
};

export default StatisticsService; 