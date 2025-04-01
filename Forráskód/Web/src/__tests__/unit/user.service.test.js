import UserService from '../../services/user.service';
import api from '../../services/api';

// Mock the api module
jest.mock('../../services/api', () => ({
  get: jest.fn(),
  put: jest.fn()
}));

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrentUser', () => {
    test('should fetch and return current user data', async () => {
      const mockUserData = { id: '123', username: 'testUser', email: 'test@example.com' };
      api.get.mockResolvedValue({ data: mockUserData });

      const result = await UserService.getCurrentUser();

      expect(api.get).toHaveBeenCalledWith('/users/me');
      expect(result).toEqual(mockUserData);
    });

    test('should throw error when fetching current user fails', async () => {
      const error = new Error('Network error');
      error.response = { data: { message: 'User not found' } };
      api.get.mockRejectedValue(error);

      await expect(UserService.getCurrentUser()).rejects.toThrow('User not found');
    });

    test('should throw generic error when no specific error message is available', async () => {
      const error = new Error('Network error');
      api.get.mockRejectedValue(error);

      await expect(UserService.getCurrentUser()).rejects.toThrow('Hiba a felhasználói profil betöltésekor');
    });
  });

  describe('updateProfile', () => {
    test('should update and return user profile data', async () => {
      const userData = { username: 'updatedUser', email: 'updated@example.com' };
      const mockResponse = { data: { ...userData, id: '123' } };
      api.put.mockResolvedValue(mockResponse);

      const result = await UserService.updateProfile(userData);

      expect(api.put).toHaveBeenCalledWith('/users/profile', userData);
      expect(result).toEqual(mockResponse.data);
    });

    test('should throw error when updating profile fails', async () => {
      const userData = { username: 'updatedUser', email: 'updated@example.com' };
      const error = new Error('Network error');
      error.response = { data: { message: 'Invalid data' } };
      api.put.mockRejectedValue(error);

      await expect(UserService.updateProfile(userData)).rejects.toThrow('Invalid data');
    });
  });

  describe('changePassword', () => {
    test('should change password successfully', async () => {
      const passwordData = { currentPassword: 'oldPass123', newPassword: 'newPass123' };
      const mockResponse = { data: { success: true, message: 'Password updated' } };
      api.put.mockResolvedValue(mockResponse);

      const result = await UserService.changePassword(passwordData);

      expect(api.put).toHaveBeenCalledWith('/users/password', passwordData);
      expect(result).toEqual(mockResponse.data);
    });

    test('should throw error when changing password fails', async () => {
      const passwordData = { currentPassword: 'oldPass123', newPassword: 'newPass123' };
      const error = new Error('Network error');
      error.response = { data: { message: 'Current password is incorrect' } };
      api.put.mockRejectedValue(error);

      await expect(UserService.changePassword(passwordData)).rejects.toThrow('Current password is incorrect');
    });
  });

  describe('getUserById', () => {
    test('should fetch and return user by ID', async () => {
      const userId = '123';
      const mockUserData = { id: userId, username: 'testUser', email: 'test@example.com' };
      api.get.mockResolvedValue({ data: mockUserData });

      const result = await UserService.getUserById(userId);

      expect(api.get).toHaveBeenCalledWith(`/users/${userId}`);
      expect(result).toEqual(mockUserData);
    });

    test('should throw error when fetching user by ID fails', async () => {
      const userId = '999';
      const error = new Error('Network error');
      error.response = { data: { message: 'User not found' } };
      api.get.mockRejectedValue(error);

      await expect(UserService.getUserById(userId)).rejects.toThrow('User not found');
    });
  });

  describe('searchUsers', () => {
    test('should search and return users matching the search term', async () => {
      const searchTerm = 'test';
      const mockUsers = [
        { id: '123', username: 'testUser1' },
        { id: '456', username: 'testUser2' }
      ];
      api.get.mockResolvedValue({ data: mockUsers });

      const result = await UserService.searchUsers(searchTerm);

      expect(api.get).toHaveBeenCalledWith(`/users/search?query=${encodeURIComponent(searchTerm)}`);
      expect(result).toEqual(mockUsers);
    });

    test('should throw error when searching users fails', async () => {
      const searchTerm = 'test';
      const error = new Error('Network error');
      error.response = { data: { message: 'Search failed' } };
      api.get.mockRejectedValue(error);

      await expect(UserService.searchUsers(searchTerm)).rejects.toThrow('Search failed');
    });
  });
}); 