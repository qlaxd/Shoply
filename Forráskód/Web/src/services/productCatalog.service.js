import api from './api';

const ProductCatalogService = {
  // Összes katalógus elem lekérdezése
  getAllCatalogItems: async () => {
    try {
      const response = await api.get('/product-catalogs');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a katalógus elemek betöltésekor');
    }
  },

  // Katalógus elem keresése
  searchCatalogItems: async (query) => {
    try {
      const response = await api.get(`/product-catalogs/search`, {
        params: { query }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a katalógus elemek keresésekor');
    }
  },

  // Katalógus elem lekérdezése ID alapján
  getCatalogItemById: async (id) => {
    try {
      const response = await api.get(`/product-catalogs/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a katalógus elem betöltésekor');
    }
  },

  // Új katalógus elem létrehozása (admin jogosultság szükséges)
  createCatalogItem: async (catalogData) => {
    try {
      const response = await api.post('/product-catalogs', catalogData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a katalógus elem létrehozásakor');
    }
  },

  // Katalógus elem frissítése (admin jogosultság szükséges)
  updateCatalogItem: async (id, catalogData) => {
    try {
      const response = await api.put(`/product-catalogs/${id}`, catalogData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a katalógus elem frissítésekor');
    }
  },

  // Katalógus elem törlése (admin jogosultság szükséges)
  deleteCatalogItem: async (id) => {
    try {
      const response = await api.delete(`/product-catalogs/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a katalógus elem törlésekor');
    }
  }
};

export default ProductCatalogService;