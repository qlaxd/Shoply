import api from './api'; 

const AuthService = {
  validatePassword(password) {
    const minLength = 10;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    if (password.length < minLength) {
      throw new Error('A jelszónak legalább 10 karakter hosszúnak kell lennie!');
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
  },

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Kérlek adj meg egy érvényes email címet!');
    }
  },

  validateUsername(username) {
    if (username.length < 3) {
      throw new Error('A felhasználónévnek legalább 3 karakter hosszúnak kell lennie!');
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      throw new Error('A felhasználónév csak betűket, számokat és alulvonást tartalmazhat!');
    }
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('userId', response.data.userId);
    localStorage.setItem('username', response.data.username);
    return response.data;
  },

  register: async (username, email, password) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }
};

export default AuthService;