const bcrypt = require('bcryptjs');
const User = require('../../../models/User');
const userController = require('../../../controllers/userController');

// Mock the User model and bcrypt
jest.mock('../../../models/User');
jest.mock('bcryptjs');

describe('User Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup request and response
    req = {
      user: { id: 'user123' },
      params: { id: 'user456' },
      body: {},
      query: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('getCurrentUser', () => {
    test('should return the current user', async () => {
      // Arrange
      const mockUser = { 
        _id: 'user123', 
        username: 'testuser', 
        email: 'test@example.com' 
      };
      const selectMock = jest.fn().mockResolvedValue(mockUser);
      User.findById.mockReturnValue({ select: selectMock });
      
      // Act
      await userController.getCurrentUser(req, res);
      
      // Assert
      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(selectMock).toHaveBeenCalledWith('-password');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    test('should return 404 if user not found', async () => {
      // Arrange
      const selectMock = jest.fn().mockResolvedValue(null);
      User.findById.mockReturnValue({ select: selectMock });
      
      // Act
      await userController.getCurrentUser(req, res);
      
      // Assert
      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Felhasználó nem található'
      }));
    });

    test('should handle errors', async () => {
      // Arrange
      const error = new Error('Database error');
      const selectMock = jest.fn().mockRejectedValue(error);
      User.findById.mockReturnValue({ select: selectMock });
      
      // Act
      await userController.getCurrentUser(req, res);
      
      // Assert
      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Hiba a felhasználói profil betöltésekor'
      }));
    });
  });

  describe('updateProfile', () => {
    test('should update user profile', async () => {
      // Arrange
      const userData = { 
        username: 'newusername', 
        email: 'newemail@example.com' 
      };
      req.body = userData;

      const mockUser = { ...userData, _id: 'user123' };
      const selectMock = jest.fn().mockResolvedValue(mockUser);
      
      User.findOne.mockResolvedValue(null);
      User.findByIdAndUpdate.mockReturnValue({ select: selectMock });
      
      // Act
      await userController.updateProfile(req, res);
      
      // Assert
      expect(User.findOne).toHaveBeenCalledWith({
        $or: [
          { username: userData.username, _id: { $ne: 'user123' } },
          { email: userData.email, _id: { $ne: 'user123' } }
        ]
      });
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        'user123',
        { $set: userData },
        { new: true, runValidators: true }
      );
      expect(selectMock).toHaveBeenCalledWith('-password');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    test('should return 400 if username is already taken', async () => {
      // Arrange
      const userData = { username: 'existinguser', email: 'new@example.com' };
      req.body = userData;
      
      User.findOne.mockResolvedValue({ 
        _id: 'otherUser', 
        username: userData.username 
      });
      
      // Act
      await userController.updateProfile(req, res);
      
      // Assert
      expect(User.findOne).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Ez a felhasználónév már foglalt'
      }));
    });

    test('should return 400 if email is already registered', async () => {
      // Arrange
      const userData = { username: 'newuser', email: 'existing@example.com' };
      req.body = userData;
      
      User.findOne.mockResolvedValue({ 
        _id: 'otherUser', 
        email: userData.email 
      });
      
      // Act
      await userController.updateProfile(req, res);
      
      // Assert
      expect(User.findOne).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Ez az email cím már regisztrálva van'
      }));
    });

    test('should handle errors', async () => {
      // Arrange
      req.body = { username: 'newusername' };
      const error = new Error('Database error');
      User.findOne.mockRejectedValue(error);
      
      // Act
      await userController.updateProfile(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Hiba a felhasználói profil frissítésekor'
      }));
    });
  });

  describe('changePassword', () => {
    test('should change password successfully', async () => {
      // Arrange
      const passwordData = { 
        currentPassword: 'oldPassword', 
        newPassword: 'newPassword' 
      };
      req.body = passwordData;
      
      const mockUser = { 
        _id: 'user123', 
        password: 'hashedOldPassword',
        save: jest.fn().mockResolvedValue(true)
      };
      
      User.findById.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedNewPassword');
      
      // Act
      await userController.changePassword(req, res);
      
      // Assert
      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(bcrypt.compare).toHaveBeenCalledWith('oldPassword', 'hashedOldPassword');
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 'salt');
      expect(mockUser.password).toBe('hashedNewPassword');
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Jelszó sikeresen módosítva'
      }));
    });

    test('should return 404 if user not found', async () => {
      // Arrange
      req.body = { 
        currentPassword: 'oldPassword', 
        newPassword: 'newPassword' 
      };
      
      User.findById.mockResolvedValue(null);
      
      // Act
      await userController.changePassword(req, res);
      
      // Assert
      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Felhasználó nem található'
      }));
    });

    test('should return 401 if current password is incorrect', async () => {
      // Arrange
      req.body = { 
        currentPassword: 'wrongPassword', 
        newPassword: 'newPassword' 
      };
      
      const mockUser = { 
        _id: 'user123', 
        password: 'hashedOldPassword' 
      };
      
      User.findById.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);
      
      // Act
      await userController.changePassword(req, res);
      
      // Assert
      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongPassword', 'hashedOldPassword');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'A jelenlegi jelszó helytelen'
      }));
    });

    test('should handle errors', async () => {
      // Arrange
      req.body = { 
        currentPassword: 'oldPassword', 
        newPassword: 'newPassword' 
      };
      
      const error = new Error('Database error');
      User.findById.mockRejectedValue(error);
      
      // Act
      await userController.changePassword(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Hiba a jelszó módosításakor'
      }));
    });
  });

  describe('getUserById', () => {
    test('should return user by ID', async () => {
      // Arrange
      const mockUser = { 
        _id: 'user456', 
        username: 'otheruser',
        email: 'other@example.com'
      };
      
      const selectMock = jest.fn().mockResolvedValue(mockUser);
      User.findById.mockReturnValue({ select: selectMock });
      
      // Act
      await userController.getUserById(req, res);
      
      // Assert
      expect(User.findById).toHaveBeenCalledWith('user456');
      expect(selectMock).toHaveBeenCalledWith('-password');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    test('should return 404 if user not found', async () => {
      // Arrange
      const selectMock = jest.fn().mockResolvedValue(null);
      User.findById.mockReturnValue({ select: selectMock });
      
      // Act
      await userController.getUserById(req, res);
      
      // Assert
      expect(User.findById).toHaveBeenCalledWith('user456');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Felhasználó nem található'
      }));
    });

    test('should handle errors', async () => {
      // Arrange
      const error = new Error('Database error');
      const selectMock = jest.fn().mockRejectedValue(error);
      User.findById.mockReturnValue({ select: selectMock });
      
      // Act
      await userController.getUserById(req, res);
      
      // Assert
      expect(User.findById).toHaveBeenCalledWith('user456');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Hiba a felhasználó betöltésekor'
      }));
    });
  });

  describe('searchUsers', () => {
    test('should search users by username or email', async () => {
      // Arrange
      req.query = { query: 'test' };
      
      const mockUsers = [
        { _id: 'user1', username: 'testuser' },
        { _id: 'user2', email: 'test@example.com' }
      ];
      
      const selectMock = jest.fn().mockResolvedValue(mockUsers);
      User.find.mockReturnValue({ select: selectMock });
      
      // Act
      await userController.searchUsers(req, res);
      
      // Assert
      expect(User.find).toHaveBeenCalledWith({
        $or: [
          { username: { $regex: 'test', $options: 'i' } },
          { email: { $regex: 'test', $options: 'i' } }
        ]
      });
      expect(selectMock).toHaveBeenCalledWith('-password');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    test('should return 400 if query is missing', async () => {
      // Arrange
      req.query = {};
      
      // Act
      await userController.searchUsers(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Keresési kifejezés szükséges'
      }));
    });

    test('should handle errors', async () => {
      // Arrange
      req.query = { query: 'test' };
      
      const error = new Error('Database error');
      const selectMock = jest.fn().mockRejectedValue(error);
      User.find.mockReturnValue({ select: selectMock });
      
      // Act
      await userController.searchUsers(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Hiba a felhasználók keresésekor'
      }));
    });
  });
}); 