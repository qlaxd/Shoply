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
  },

  shareList: async (listId, username, permissionLevel) => {
    try {
      await api.post(`/lists/${listId}/share`, { username, permissionLevel });
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a lista megosztása során');
    }
  },

  updateList: async (listId, listData) => {
    try {
      await api.put(`/lists/${listId}`, listData);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a lista frissítésekor');
    }
  },

  unshareList: async (listId, userId) => {
    try {
      await api.delete(`/lists/${listId}/unshare`, { data: { userId } });
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a lista megosztás visszavonása során');
    }
  }

};

export default ListService; 