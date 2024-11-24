import api from './api'; 

class AuthService { 
  async login(email, password) { 
    try {
      const response = await api.post('/auth/login', { email, password }); // bejelentkezési kérés küldése a backendnek
      if (response.data.token) {
        localStorage.setItem('token', response.data.token); // token mentése a localStorage-be
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Bejelentkezési hiba');
    }
  }

  async register(username, email, password) {
    try {
      const response = await api.post('/auth/register', { // regisztrációs kérés küldése a backendnek
        username,
        email,
        password
      });
      return response.data; 
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Regisztrációs hiba');
    }
  }

  logout() {
    localStorage.removeItem('token'); // token eltávolítása a localStorage-ből kijelentkezéskor
  }
}
// sajnos először létre kell hozni egy új pédányt és utána exportálni, mert az ESLint warning üzenetet ír ki
const authService = new AuthService(); 
export default authService;