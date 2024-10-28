import api from './api';


const AuthService = {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  async register(username, email, password) {
    try {
      const response = await api.post('/auth/register', {
        username,
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  logout() {
    localStorage.removeItem('token');
  }
};

export default AuthService;