import api from './api';

const ListService = {
  getUserLists: async () => {
    try {
      const response = await api.get(`/lists`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a listák betöltésekor');
    }
  },

  getListById: async (listId) => {
    try {
      const response = await api.get(`/lists/${listId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a lista betöltésekor');
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
      const response = await api.post(`/lists/${listId}/share`, { username, permissionLevel });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a lista megosztása során');
    }
  },

  updateList: async (listId, listData) => {
    try {
      const response = await api.put(`/lists/${listId}`, listData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a lista frissítésekor');
    }
  },

  unshareList: async (listId, userId) => {
    try {
      const response = await api.delete(`/lists/${listId}/unshare`, { data: { userId } });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a lista megosztás visszavonása során');
    }
  },

  createList: async (listData) => {
    try {
      const response = await api.post('/lists', listData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a lista létrehozásakor');
    }
  },

  // Termékekkel kapcsolatos műveletek
  addProductToList: async (listId, productData) => {
    try {
      const response = await api.post(`/lists/${listId}/products`, productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a termék hozzáadása során');
    }
  },

  removeProductFromList: async (listId, productId) => {
    try {
      const response = await api.delete(`/lists/${listId}/products/${productId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a termék eltávolítása során');
    }
  },

  updateProductInList: async (listId, productId, productData) => {
    try {
      const response = await api.put(`/lists/${listId}/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a termék módosítása során');
    }
  }
};

export default ListService; 