import axios from 'axios';

console.log(process.env.REACT_APP_API_URL)
const API_URL = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:5000/api`; // backend URL

console.log('API_URL:', API_URL);
console.log('process.env:', process.env);
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
// Debug logolás
api.interceptors.request.use(request => {
  console.log('Teljes kimenő kérés: ', request);
  return request;
});

// Debug logok itt is
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