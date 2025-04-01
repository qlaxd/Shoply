const adminController = require('../../../controllers/adminController');
const User = require('../../../models/User');
const TestDataFactory = require('../../helpers/testDataFactory');
const mongoose = require('mongoose');

// Mock dependencies
jest.mock('../../../models/User');

describe('Admin Controller', () => {
  let req;
  let res;
  
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Mock request and response
    req = {
      params: {
        userId: 'user123'
      }
    };
    
    res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res)
    };
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      // Setup
      const mockUsers = [
        { _id: 'user1', username: 'user1', email: 'user1@example.com' },
        { _id: 'user2', username: 'user2', email: 'user2@example.com' }
      ];
      User.find.mockResolvedValue(mockUsers);
      
      // Execute
      await adminController.getAllUsers(req, res);
      
      // Assert
      expect(User.find).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should return 500 if an error occurs', async () => {
      // Setup
      User.find.mockRejectedValue(new Error('Database error'));
      
      // Execute
      await adminController.getAllUsers(req, res);
      
      // Assert
      expect(User.find).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Szerverhiba történt.' });
    });
  });

  describe('promoteToAdmin', () => {
    it('should promote user to admin role', async () => {
      // Setup
      const mockUser = {
        _id: 'user123',
        username: 'testuser',
        role: 'user',
        save: jest.fn().mockResolvedValue(true)
      };
      User.findById.mockResolvedValue(mockUser);
      
      // Execute
      await adminController.promoteToAdmin(req, res);
      
      // Assert
      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(mockUser.role).toBe('admin');
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Felhasználó adminná téve' });
    });

    it('should return 404 if user not found', async () => {
      // Setup
      User.findById.mockResolvedValue(null);
      
      // Execute
      await adminController.promoteToAdmin(req, res);
      
      // Assert
      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Felhasználó nem található' });
    });

    it('should return 500 if an error occurs', async () => {
      // Setup
      User.findById.mockRejectedValue(new Error('Database error'));
      
      // Execute
      await adminController.promoteToAdmin(req, res);
      
      // Assert
      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Hiba adminná tételkor',
        error: expect.any(Error)
      });
    });
  });

  describe('demoteToUser', () => {
    it('should demote admin to user role', async () => {
      // Setup
      const mockUser = {
        _id: 'user123',
        username: 'testuser',
        role: 'admin',
        save: jest.fn().mockResolvedValue(true)
      };
      User.findById.mockResolvedValue(mockUser);
      
      // Execute
      await adminController.demoteToUser(req, res);
      
      // Assert
      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(mockUser.role).toBe('user');
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Felhasználó jogosultsága visszavonva' });
    });

    it('should return 404 if user not found', async () => {
      // Setup
      User.findById.mockResolvedValue(null);
      
      // Execute
      await adminController.demoteToUser(req, res);
      
      // Assert
      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Felhasználó nem található' });
    });

    it('should return 500 if an error occurs', async () => {
      // Setup
      User.findById.mockRejectedValue(new Error('Database error'));
      
      // Execute
      await adminController.demoteToUser(req, res);
      
      // Assert
      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Hiba a jogosultság visszavonásakor',
        error: expect.any(Error)
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      // Setup
      const mockUser = {
        _id: 'user123',
        username: 'testuser'
      };
      User.findById.mockResolvedValue(mockUser);
      User.findByIdAndDelete.mockResolvedValue(true);
      
      // Execute
      await adminController.deleteUser(req, res);
      
      // Assert
      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(User.findByIdAndDelete).toHaveBeenCalledWith('user123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Felhasználó sikeresen törölve' });
    });

    it('should return 404 if user not found', async () => {
      // Setup
      User.findById.mockResolvedValue(null);
      
      // Execute
      await adminController.deleteUser(req, res);
      
      // Assert
      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(User.findByIdAndDelete).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Felhasználó nem található' });
    });

    it('should return 500 if an error occurs', async () => {
      // Setup
      User.findById.mockRejectedValue(new Error('Database error'));
      
      // Execute
      await adminController.deleteUser(req, res);
      
      // Assert
      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Hiba a felhasználó törlésekor',
        error: expect.any(Error)
      });
    });
  });
}); 