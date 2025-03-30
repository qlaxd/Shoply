import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:5000/api`; // backend URL

// Axios példány
const api = axios.create({ 
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
  proxy: false,
  timeout: 10000
});

// Request interceptor a token hozzáadásához
// a headerben nem adjuk meg külön a tokent, mert az Axios interceptor minden requestben hozzáadja a tokent a headerhez
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // token lekérése a localStorage-ből
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // token hozzáadása a headerhez
    }
    return config;
  },
  (error) => {
    console.error('Request hiba: ', error);
    return Promise.reject(error);
  }
);

// Debug logok itt is
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || 
        (error.response?.status === 400 && error.response?.data?.message === 'Invalid token.')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;