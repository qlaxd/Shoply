import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api' || 'http://192.168.64.3:5000/api'; // backend URL

// Axios példány
const api = axios.create({ 
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Request interceptor a token hozzáadásához
// a headerben nem adjuk meg külön a tokent, mert az Axios interceptor minden requestben hozzáadja a tokent a headerhez
api.interceptors.request.use(
  (config) => {
    console.log('Kimenő kérés:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });
    const token = localStorage.getItem('token'); // token lekérése a localStorage-ből
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

api.interceptors.response.use(
  (response) => {
    console.log('Válasz:', response);
    return response;
  },
  (error) => {
    console.error('Response hiba:', error.response || error);
    return Promise.reject(error);
  }
);

export default api; 