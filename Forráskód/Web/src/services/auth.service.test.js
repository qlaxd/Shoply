import AuthService from './auth.service';
import api from './api';

// Mock the api module
jest.mock('./api', () => ({
  post: jest.fn()
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key]),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('AuthService', () => {
  beforeEach(() => {
    // Clear localStorage and reset mocks before each test
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  // Tests for validatePassword
  describe('validatePassword', () => {
    test('should accept valid password', () => {
      expect(() => {
        AuthService.validatePassword('ValidPass123');
      }).not.toThrow();
    });

    test('should throw error for short password', () => {
      expect(() => {
        AuthService.validatePassword('Short1');
      }).toThrow('A jelszónak legalább 10 karakter hosszúnak kell lennie!');
    });

    test('should throw error for password without uppercase', () => {
      expect(() => {
        AuthService.validatePassword('nouppercasepass123');
      }).toThrow('A jelszónak tartalmaznia kell legalább egy nagybetűt!');
    });

    test('should throw error for password without lowercase', () => {
      expect(() => {
        AuthService.validatePassword('NOLOWERCASEPASS123');
      }).toThrow('A jelszónak tartalmaznia kell legalább egy kisbetűt!');
    });

    test('should throw error for password without number', () => {
      expect(() => {
        AuthService.validatePassword('NoNumberPassword');
      }).toThrow('A jelszónak tartalmaznia kell legalább egy számot!');
    });
  });

  // Tests for validateEmail
  describe('validateEmail', () => {
    test('should accept valid email', () => {
      expect(() => {
        AuthService.validateEmail('valid@example.com');
      }).not.toThrow();
    });

    test('should throw error for invalid email', () => {
      expect(() => {
        AuthService.validateEmail('invalid-email');
      }).toThrow('Kérlek adj meg egy érvényes email címet!');
    });
  });

  // Tests for validateUsername
  describe('validateUsername', () => {
    test('should accept valid username', () => {
      expect(() => {
        AuthService.validateUsername('valid_user123');
      }).not.toThrow();
    });

    test('should throw error for short username', () => {
      expect(() => {
        AuthService.validateUsername('ab');
      }).toThrow('A felhasználónévnek legalább 3 karakter hosszúnak kell lennie!');
    });

    test('should throw error for username with invalid characters', () => {
      expect(() => {
        AuthService.validateUsername('invalid@user');
      }).toThrow('A felhasználónév csak betűket, számokat és alulvonást tartalmazhat!');
    });
  });

  // Tests for login
  describe('login', () => {
    test('should login successfully and store user data', async () => {
      const mockResponse = {
        data: {
          token: 'test-token',
          userId: '123',
          username: 'testUser'
        }
      };
      api.post.mockResolvedValue(mockResponse);

      const result = await AuthService.login('test@example.com', 'Password123');

      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'Password123'
      });
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'test-token');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('userId', '123');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('username', 'testUser');
      expect(result).toEqual(mockResponse.data);
    });

    test('should throw error when login fails', async () => {
      const errorResponse = new Error('Login failed');
      api.post.mockRejectedValue(errorResponse);

      await expect(AuthService.login('test@example.com', 'Password123')).rejects.toThrow('Login failed');
    });
  });

  // Tests for register
  describe('register', () => {
    test('should register successfully', async () => {
      const mockResponse = {
        data: { success: true, message: 'Registration successful' }
      };
      api.post.mockResolvedValue(mockResponse);

      const result = await AuthService.register('testUser', 'test@example.com', 'Password123');

      expect(api.post).toHaveBeenCalledWith('/auth/register', {
        username: 'testUser',
        email: 'test@example.com',
        password: 'Password123'
      });
      expect(result).toEqual(mockResponse.data);
    });

    test('should throw error when registration fails', async () => {
      const errorResponse = new Error('Registration failed');
      api.post.mockRejectedValue(errorResponse);

      await expect(AuthService.register('testUser', 'test@example.com', 'Password123')).rejects.toThrow('Registration failed');
    });
  });

  // Tests for logout
  describe('logout', () => {
    test('should remove user data from localStorage', () => {
      // Setup - add items to localStorage
      localStorageMock.setItem('token', 'test-token');
      localStorageMock.setItem('userId', '123');
      localStorageMock.setItem('username', 'testUser');

      AuthService.logout();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('userId');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('username');
    });
  });

  // Tests for getCurrentUser
  describe('getCurrentUser', () => {
    test('should return user data when authenticated', () => {
      // Directly set the values in the mock store
      localStorageMock.setItem('token', 'test-token');
      localStorageMock.setItem('userId', '123');
      localStorageMock.setItem('username', 'testUser');
      
      // Make sure getItem returns expected values
      jest.spyOn(window.localStorage, 'getItem').mockImplementation((key) => {
        if (key === 'token') return 'test-token';
        if (key === 'userId') return '123';
        if (key === 'username') return 'testUser';
        return null;
      });

      const user = AuthService.getCurrentUser();

      expect(user).toEqual({
        userId: '123',
        username: 'testUser',
        isAuthenticated: true
      });
    });

    test('should return null values when not authenticated', () => {
      // Make sure localStorage.getItem('token') returns null
      jest.spyOn(window.localStorage, 'getItem').mockImplementation((key) => null);
      
      const user = AuthService.getCurrentUser();

      expect(user).toEqual({
        userId: null,
        username: null,
        isAuthenticated: false
      });
    });
  });

  // Tests for isAuthenticated
  describe('isAuthenticated', () => {
    test('should return true when token exists', () => {
      // Directly mock the getItem to return a token
      jest.spyOn(window.localStorage, 'getItem').mockImplementation((key) => {
        if (key === 'token') return 'test-token';
        return null;
      });

      const result = AuthService.isAuthenticated();

      expect(result).toBe(true);
    });

    test('should return false when token does not exist', () => {
      // Make sure localStorage.getItem('token') returns null
      jest.spyOn(window.localStorage, 'getItem').mockImplementation((key) => null);
      
      const result = AuthService.isAuthenticated();

      expect(result).toBe(false);
    });
  });
}); 