// Mock axios first
import axios from 'axios';

// Mock axios
jest.mock('axios', () => {
  const mockRequestInterceptor = jest.fn();
  const mockResponseInterceptor = jest.fn();
  const mockRequestErrorHandler = jest.fn();
  const mockResponseErrorHandler = jest.fn();

  const mockInterceptors = {
    request: {
      use: jest.fn((interceptor, errorHandler) => {
        mockRequestInterceptor.mockImplementation(interceptor);
        mockRequestErrorHandler.mockImplementation(errorHandler);
        return 0;
      })
    },
    response: {
      use: jest.fn((interceptor, errorHandler) => {
        mockResponseInterceptor.mockImplementation(interceptor);
        mockResponseErrorHandler.mockImplementation(errorHandler);
        return 0;
      })
    }
  };

  const mockAxiosInstance = {
    interceptors: mockInterceptors
  };

  return {
    create: jest.fn(() => mockAxiosInstance)
  };
});

// Import api AFTER the mock
import api from '../../services/api';

describe('API Service', () => {
  let originalLocalStorage;
  let originalWindow;
  let mockLocalStorage;
  let mockAxiosInstance;

  beforeEach(() => {
    // Mock localStorage
    mockLocalStorage = {
      getItem: jest.fn(),
      removeItem: jest.fn(),
      setItem: jest.fn()
    };
    originalLocalStorage = global.localStorage;
    Object.defineProperty(global, 'localStorage', { value: mockLocalStorage });

    // Mock window.location
    originalWindow = global.window;
    delete global.window.location;
    global.window = Object.create(window);
    global.window.location = {
      hostname: 'localhost',
      href: ''
    };

    // Get the mock axios instance
    mockAxiosInstance = axios.create();
  });

  afterEach(() => {
    // Restore original localStorage and window
    Object.defineProperty(global, 'localStorage', { value: originalLocalStorage });
    global.window = originalWindow;
    jest.clearAllMocks();
  });

  describe('Request Interceptor', () => {
    it('should add authorization header when token exists', () => {
      const token = 'test-token';
      mockLocalStorage.getItem.mockReturnValue(token);

      const requestInterceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
      const config = { headers: {} };
      const result = requestInterceptor(config);

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('token');
      expect(result.headers.Authorization).toBe(`Bearer ${token}`);
    });

    it('should not add authorization header when token does not exist', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const requestInterceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
      const config = { headers: {} };
      const result = requestInterceptor(config);

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('token');
      expect(result.headers.Authorization).toBeUndefined();
    });

    it('should handle request error', async () => {
      const errorHandler = mockAxiosInstance.interceptors.request.use.mock.calls[0][1];
      const error = new Error('Request failed');
      await expect(errorHandler(error)).rejects.toEqual(error);
    });
  });

  describe('Response Interceptor', () => {
    it('should return response directly when successful', () => {
      const responseInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][0];
      const response = { data: 'test' };
      const result = responseInterceptor(response);
      expect(result).toBe(response);
    });

    it('should handle 401 unauthorized error', async () => {
      const error = {
        response: {
          status: 401
        }
      };
      const errorHandler = mockAxiosInstance.interceptors.response.use.mock.calls[0][1];
      await expect(errorHandler(error)).rejects.toEqual(error);

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
      expect(window.location.href).toBe('/login');
    });

    it('should handle 400 invalid token error', async () => {
      const error = {
        response: {
          status: 400,
          data: {
            message: 'Invalid token.'
          }
        }
      };
      const errorHandler = mockAxiosInstance.interceptors.response.use.mock.calls[0][1];
      await expect(errorHandler(error)).rejects.toEqual(error);

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
      expect(window.location.href).toBe('/login');
    });

    it('should reject other errors without redirection', async () => {
      const error = {
        response: {
          status: 500,
          data: {
            message: 'Server error'
          }
        }
      };
      const errorHandler = mockAxiosInstance.interceptors.response.use.mock.calls[0][1];
      await expect(errorHandler(error)).rejects.toEqual(error);
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalled();
      expect(window.location.href).not.toBe('/login');
    });
  });
}); 