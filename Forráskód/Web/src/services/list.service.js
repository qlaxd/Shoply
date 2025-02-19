import api from './api';

const ListService = {
  getUserLists: async (userId) => {
    try {
      // Először lekérjük a listákat
      const listsResponse = await api.get(`/lists`);
      
      // Majd lekérjük az összes terméket
      const productsResponse = await api.get('/products');
      
      // A listákhoz hozzárendeljük a termékek részletes adatait
      const listsWithProducts = listsResponse.data.map(list => ({
        ...list,
        products: list.products.map(productId => 
          productsResponse.data.find(product => product._id === productId)
        ).filter(Boolean) // Kiszűrjük az esetleges undefined értékeket
      }));

      return listsWithProducts;
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