// API végpontok konstantásai
const API_ROUTES = {
  // Autentikációs végpontok
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  
  // Felhasználói végpontok
  USER: {
    PROFILE: '/users/me',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/password',
    GET_BY_ID: (id) => `/users/${id}`,
    SEARCH: '/users/search',
  },
  
  // Admin végpontok
  ADMIN: {
    ALL_USERS: '/admin/users',
    PROMOTE_USER: (id) => `/admin/promote/${id}`,
    USER_STATS: '/admin/stats/users',
  },
  
  // Lista végpontok
  LIST: {
    ALL: '/lists',
    BY_ID: (id) => `/lists/${id}`,
    SHARE: (id) => `/lists/${id}/share`,
    UNSHARE: (id) => `/lists/${id}/unshare`,
    ADD_PRODUCT: (id) => `/lists/${id}/products`,
    REMOVE_PRODUCT: (listId, productId) => `/lists/${listId}/products/${productId}`,
    UPDATE_PRODUCT: (listId, productId) => `/lists/${listId}/products/${productId}`,
  },
  
  // Termékkatalógus végpontok
  PRODUCT_CATALOG: {
    ALL: '/productCatalogs',
    BY_ID: (id) => `/productCatalogs/${id}`,
    SEARCH: '/productCatalogs/search',
  },
  
  // Kategória végpontok
  CATEGORY: {
    ALL: '/categories',
    BY_ID: (id) => `/categories/${id}`,
    SEARCH: '/categories/search',
  },
  
  // Statisztika végpontok
  STATISTICS: {
    USER_PERSONAL: '/statistics/personal',
  },
};

export default API_ROUTES; 