const jwt = require('jsonwebtoken');
const authMiddleware = require('../../../middleware/authMiddleware');
const User = require('../../../models/User');

// Mock the User model
jest.mock('../../../models/User');

// Mock environment variables
process.env.JWT_SECRET = 'test_jwt_secret';

describe('Auth Middleware', () => {
  let req, res, next;
  
  // Set up mocks before each test
  beforeEach(() => {
    req = {
      header: jest.fn()
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    next = jest.fn();
  });
  
  test('should call next() if token is valid', async () => {
    // Create a valid token
    const user = { id: '123', role: 'user', status: 'active' };
    const token = jwt.sign(user, process.env.JWT_SECRET);
    
    // Mock request with valid token
    req.header.mockReturnValue(`Bearer ${token}`);
    
    // Mock User.findById to return a valid user
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: '123',
        role: 'user',
        status: 'active'
      })
    });
    
    // Call middleware
    await authMiddleware(req, res, next);
    
    // Assert next was called
    expect(next).toHaveBeenCalled();
    
    // Assert user info was attached to request
    expect(req.user).toBeDefined();
    expect(req.user._id).toBe('123');
    expect(req.user.role).toBe('user');
  });
  
  test('should return 401 if no token is provided', async () => {
    // Mock request with no token
    req.header.mockReturnValue(undefined);
    
    // Call middleware
    await authMiddleware(req, res, next);
    
    // Assert response
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Access denied. No token provided.' });
    expect(next).not.toHaveBeenCalled();
  });
  
  test('should return 401 if token is invalid', async () => {
    // Mock request with invalid token
    req.header.mockReturnValue('Bearer invalid.token.here');
    
    // Call middleware
    await authMiddleware(req, res, next);
    
    // Assert response
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token.' });
    expect(next).not.toHaveBeenCalled();
  });
  
  test('should handle malformed Authorization header', async () => {
    // Mock request with malformed Authorization header (no Bearer prefix)
    req.header.mockReturnValue('malformed-header');
    
    // Call middleware
    await authMiddleware(req, res, next);
    
    // Assert response
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
  
  test('should return 401 if user is not found', async () => {
    // Create a valid token
    const user = { id: '123', role: 'user' };
    const token = jwt.sign(user, process.env.JWT_SECRET);
    
    // Mock request with valid token
    req.header.mockReturnValue(`Bearer ${token}`);
    
    // Mock User.findById to return null
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });
    
    // Call middleware
    await authMiddleware(req, res, next);
    
    // Assert response
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Authentication failed: User not found.' });
    expect(next).not.toHaveBeenCalled();
  });
  
  test('should return 403 if user account is not active', async () => {
    // Create a valid token
    const user = { id: '123', role: 'user' };
    const token = jwt.sign(user, process.env.JWT_SECRET);
    
    // Mock request with valid token
    req.header.mockReturnValue(`Bearer ${token}`);
    
    // Mock User.findById to return an inactive user
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: '123',
        role: 'user',
        status: 'inactive'
      })
    });
    
    // Call middleware
    await authMiddleware(req, res, next);
    
    // Assert response
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Access denied: User account is not active.' });
    expect(next).not.toHaveBeenCalled();
  });
}); 