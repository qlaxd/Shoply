import api from './api';

const CategoryService = {
  getAllCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a kategóriák betöltésekor');
    }
  },

  getCategoryById: async (categoryId) => {
    try {
      const response = await api.get(`/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a kategória betöltésekor');
    }
  },

  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a kategória létrehozásakor');
    }
  },

  updateCategory: async (categoryId, categoryData) => {
    try {
      const response = await api.put(`/categories/${categoryId}`, categoryData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a kategória frissítésekor');
    }
  },

  deleteCategory: async (categoryId) => {
    try {
      await api.delete(`/categories/${categoryId}`);
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a kategória törlésekor');
    }
  },

  searchCategories: async (searchTerm) => {
    try {
      const response = await api.get(`/categories/search?search=${encodeURIComponent(searchTerm)}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a kategóriák keresésekor');
    }
  }
};

export default CategoryService; 