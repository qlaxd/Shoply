import api from './api'; 

class AuthService { 
  validatePassword(password) {
    const minLength = 10;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    if (password.length < minLength) {
      alert('A jelszónak legalább 10 karakter hosszúnak kell lennie!');
    }
    if (!hasUpperCase) {
      throw new Error('A jelszónak tartalmaznia kell legalább egy nagybetűt!');
    }
    if (!hasLowerCase) {
      throw new Error('A jelszónak tartalmaznia kell legalább egy kisbetűt!');
    }
    if (!hasNumber) {
      throw new Error('A jelszónak tartalmaznia kell legalább egy számot!');
    }
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Kérlek adj meg egy érvényes email címet!');
    }
  }

  validateUsername(username) {
    if (username.length < 3) {
      throw new Error('A felhasználónévnek legalább 3 karakter hosszúnak kell lennie!');
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      throw new Error('A felhasználónév csak betűket, számokat és alulvonást tartalmazhat!');
    }
  }

  async login(email, password) { 
    try {
      this.validateEmail(email);
      this.validatePassword(password);

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
      this.validateUsername(username);
      this.validateEmail(email);
      this.validatePassword(password);

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