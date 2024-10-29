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
        throw new Error(error.response.data.error || 'Bejelentkezési hiba');
      } else if (error.request) {
        throw new Error('Hálózati hiba történt');
      } else {
        throw new Error('Ismeretlen hiba történt');
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