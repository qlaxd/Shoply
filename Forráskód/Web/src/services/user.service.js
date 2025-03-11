import api from './api';

const UserService = {
  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a felhasználói profil betöltésekor');
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await api.put('/users/profile', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a felhasználói profil frissítésekor');
    }
  },

  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/users/password', passwordData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a jelszó módosításakor');
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a felhasználó betöltésekor');
    }
  },

  searchUsers: async (searchTerm) => {
    try {
      const response = await api.get(`/users/search?query=${encodeURIComponent(searchTerm)}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a felhasználók keresésekor');
    }
  }
};

export default UserService; 