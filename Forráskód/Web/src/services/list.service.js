import api from './api';

const ListService = {
  getUserLists: async (userId) => {
    try {
      const response = await api.get(`/lists`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a listák betöltésekor');
    }
  },

  deleteList: async (listId) => {
    try {
      await api.delete(`/lists/${listId}`);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a lista törlésekor');
    }
  }
};

export default ListService; 