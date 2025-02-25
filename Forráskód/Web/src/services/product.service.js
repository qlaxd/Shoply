import api from './api';

const ProductService = {
  // Összes termék lekérdezése
  getAllProducts: async () => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a termékek betöltésekor');
    }
  },
  
  // Termékek keresése
  searchProducts: async (query) => {
    try {
      const response = await api.get(`/products/search`, {
        params: { query }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a termékek keresésekor');
    }
  },

  // Termék lekérdezése ID alapján
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a termék betöltésekor');
    }
  },

  // Új termék létrehozása
  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a termék létrehozásakor');
    }
  },

  // Termék frissítése
  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a termék frissítésekor');
    }
  },

  // Termék törlése
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hiba a termék törlésekor');
    }
  }
};

export default ProductService;