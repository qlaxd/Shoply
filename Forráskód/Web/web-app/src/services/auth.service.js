import api from './api';

const AuthService = {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response?.data?.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      } else if (error.request) {
        throw { error: 'Hálózati hiba történt' };
      } else {
        throw { error: 'Ismeretlen hiba történt' };
      }
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
    localStorage.removeItem('token'); // token eltávolítása a localStorage-ből, csak logoutkor
  }
};

export default AuthService;