import api from '../../services/api';
import AuthService from '../../services/auth.service';

// Mock the api module
jest.mock('../../services/api');

describe('AuthService', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: jest.fn(key => store[key] || null),
      setItem: jest.fn((key, value) => {
        store[key] = value;
      }),
      removeItem: jest.fn(key => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        store = {};
      })
    };
  })();

  beforeAll(() => {
    // Set up localStorage mock before all tests
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

  beforeEach(() => {
    // Clear all mocks and localStorage before each test
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  afterEach(() => {
    // Clean up after each test
    localStorageMock.clear();
  });

  describe('validatePassword', () => {
    it('should accept valid password', () => {
      const validPassword = 'ValidPass123';
      expect(() => AuthService.validatePassword(validPassword)).not.toThrow();
    });

    it('should reject password shorter than 10 characters', () => {
      const shortPassword = 'Short123';
      expect(() => AuthService.validatePassword(shortPassword))
        .toThrow('A jelszónak legalább 10 karakter hosszúnak kell lennie!');
    });

    it('should reject password without uppercase letter', () => {
      const noUpperPassword = 'password123';
      expect(() => AuthService.validatePassword(noUpperPassword))
        .toThrow('A jelszónak tartalmaznia kell legalább egy nagybetűt!');
    });

    it('should reject password without lowercase letter', () => {
      const noLowerPassword = 'PASSWORD123';
      expect(() => AuthService.validatePassword(noLowerPassword))
        .toThrow('A jelszónak tartalmaznia kell legalább egy kisbetűt!');
    });

    it('should reject password without number', () => {
      const noNumberPassword = 'PasswordTest';
      expect(() => AuthService.validatePassword(noNumberPassword))
        .toThrow('A jelszónak tartalmaznia kell legalább egy számot!');
    });
  });

  describe('validateEmail', () => {
    it('should accept valid email', () => {
      const validEmail = 'test@example.com';
      expect(() => AuthService.validateEmail(validEmail)).not.toThrow();
    });

    it('should reject invalid email format', () => {
      const invalidEmails = [
        'test@',
        '@example.com',
        'test@.com',
        'test.com',
        'test@example.',
        'test@@example.com'
      ];

      invalidEmails.forEach(email => {
        expect(() => AuthService.validateEmail(email))
          .toThrow('Kérlek adj meg egy érvényes email címet!');
      });
    });
  });

  describe('validateUsername', () => {
    it('should accept valid username', () => {
      const validUsernames = ['user123', 'User_123', 'username'];
      validUsernames.forEach(username => {
        expect(() => AuthService.validateUsername(username)).not.toThrow();
      });
    });

    it('should reject username shorter than 3 characters', () => {
      const shortUsername = 'us';
      expect(() => AuthService.validateUsername(shortUsername))
        .toThrow('A felhasználónévnek legalább 3 karakter hosszúnak kell lennie!');
    });

    it('should reject username with special characters', () => {
      const invalidUsernames = ['user@123', 'user.name', 'user-name', 'user name'];
      invalidUsernames.forEach(username => {
        expect(() => AuthService.validateUsername(username))
          .toThrow('A felhasználónév csak betűket, számokat és alulvonást tartalmazhat!');
      });
    });
  });

  describe('login', () => {
    it('should login successfully and store user data', async () => {
      const mockResponse = {
        data: {
          token: 'mock-token',
          userId: 'user123',
          username: 'testuser'
        }
      };
      api.post.mockResolvedValueOnce(mockResponse);

      const result = await AuthService.login('test@example.com', 'Password123');

      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'Password123'
      });
      expect(localStorage.setItem).toHaveBeenCalledWith('token', mockResponse.data.token);
      expect(localStorage.setItem).toHaveBeenCalledWith('userId', mockResponse.data.userId);
      expect(localStorage.setItem).toHaveBeenCalledWith('username', mockResponse.data.username);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle login failure', async () => {
      const errorMessage = 'Invalid credentials';
      api.post.mockRejectedValueOnce(new Error(errorMessage));

      await expect(AuthService.login('test@example.com', 'wrong-password'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      const mockResponse = {
        data: {
          userId: 'user123',
          username: 'testuser',
          email: 'test@example.com'
        }
      };
      api.post.mockResolvedValueOnce(mockResponse);

      const result = await AuthService.register('testuser', 'test@example.com', 'Password123');

      expect(api.post).toHaveBeenCalledWith('/auth/register', {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123'
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle registration failure', async () => {
      const errorMessage = 'Username already exists';
      api.post.mockRejectedValueOnce(new Error(errorMessage));

      await expect(AuthService.register('existinguser', 'test@example.com', 'Password123'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('logout', () => {
    it('should clear user data from localStorage', () => {
      // Set some initial data
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('userId', 'user123');
      localStorage.setItem('username', 'testuser');

      AuthService.logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('userId');
      expect(localStorage.removeItem).toHaveBeenCalledWith('username');
    });
  });

  describe('getCurrentUser', () => {
    it('should return authenticated user data', () => {
      // Set up test data
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('userId', 'user123');
      localStorage.setItem('username', 'testuser');

      const user = AuthService.getCurrentUser();

      expect(user).toEqual({
        userId: 'user123',
        username: 'testuser',
        isAuthenticated: true
      });
    });

    it('should return unauthenticated user data when no token exists', () => {
      const user = AuthService.getCurrentUser();

      expect(user).toEqual({
        userId: null,
        username: null,
        isAuthenticated: false
      });
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('token', 'mock-token');
      expect(AuthService.isAuthenticated()).toBe(true);
    });

    it('should return false when token does not exist', () => {
      expect(AuthService.isAuthenticated()).toBe(false);
    });
  });
}); 