const authController = require('../../../controllers/authController');
const User = require('../../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const TestDataFactory = require('../../helpers/testDataFactory');

// Mock dependencies
jest.mock('../../../models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  let req;
  let res;
  
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Mock request and response
    req = {
      body: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      }
    };
    
    res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res)
    };
  });

  describe('register', () => {
    it('should register a new user when valid data is provided', async () => {
      // Setup
      User.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null); // No existing email or username
      bcrypt.hash.mockResolvedValue('hashedPassword');
      const mockUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user',
        save: jest.fn().mockResolvedValue(true)
      };
      User.mockImplementation(() => mockUser);
      
      // Execute
      await authController.register(req, res);
      
      // Assert
      expect(User.findOne).toHaveBeenCalledTimes(2);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(User).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user'
      });
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Sikeres regisztráció!' });
    });

    it('should return 400 if email already exists', async () => {
      // Setup
      User.findOne.mockResolvedValueOnce({ email: 'test@example.com' }); // Email exists
      
      // Execute
      await authController.register(req, res);
      
      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Ez az email cím már regisztrálva van!' });
    });

    it('should return 400 if username already exists', async () => {
      // Setup
      User.findOne.mockResolvedValueOnce(null); // Email doesn't exist
      User.findOne.mockResolvedValueOnce({ username: 'testuser' }); // Username exists
      
      // Execute
      await authController.register(req, res);
      
      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Ez a felhasználónév már foglalt!' });
    });

    it('should return 500 if an error occurs during registration', async () => {
      // Setup
      User.findOne.mockRejectedValue(new Error('Database error'));
      
      // Execute
      await authController.register(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Hiba történt a regisztráció során. Kérlek próbáld újra!' 
      });
    });
  });

  describe('login', () => {
    beforeEach(() => {
      // Update request body for login tests
      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };
    });

    it('should login user and return token when credentials are valid', async () => {
      // Setup
      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        password: 'hashedPassword',
        username: 'testuser',
        role: 'user'
      };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('test-token');
      
      // Execute
      await authController.login(req, res);
      
      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 'user123', role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '10000000000' }
      );
      expect(res.json).toHaveBeenCalledWith({
        token: 'test-token',
        userId: 'user123',
        username: 'testuser',
        message: 'Sikeres bejelentkezés!'
      });
    });

    it('should return 400 if user not found', async () => {
      // Setup
      User.findOne.mockResolvedValue(null);
      
      // Execute
      await authController.login(req, res);
      
      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Hibás email cím vagy jelszó!' });
    });

    it('should return 400 if password is incorrect', async () => {
      // Setup
      const mockUser = {
        email: 'test@example.com',
        password: 'hashedPassword'
      };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);
      
      // Execute
      await authController.login(req, res);
      
      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Hibás email cím vagy jelszó!' });
    });

    it('should return 500 if an error occurs during login', async () => {
      // Setup
      User.findOne.mockRejectedValue(new Error('Database error'));
      
      // Execute
      await authController.login(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Hiba történt a bejelentkezés során. Kérlek próbáld újra!' 
      });
    });
  });
}); 