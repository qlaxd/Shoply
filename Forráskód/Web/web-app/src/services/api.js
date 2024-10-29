import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Axios példány
const api = axios.create({ 
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor a token hozzáadásához
// a headerben nem adjuk meg külön a tokent, mert az Axios interceptor minden requestben hozzáadja a tokent a headerhez
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // token hozzáadása a headerhez
      console.log('Token hozzáadva a headerhez: ', config.headers.Authorization, token);
    }
    return config;
  },
  (error) => {
    console.error('Request hiba: ', error);
    return Promise.reject(error);
  }
);

export default api;