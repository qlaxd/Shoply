const jwt = require('jsonwebtoken');
const authMiddleware = require('../../../middleware/authMiddleware');

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
  
  test('should call next() if token is valid', () => {
    // Create a valid token
    const user = { id: '123', role: 'user' };
    const token = jwt.sign(user, process.env.JWT_SECRET);
    
    // Mock request with valid token
    req.header.mockReturnValue(`Bearer ${token}`);
    
    // Call middleware
    authMiddleware(req, res, next);
    
    // Assert next was called
    expect(next).toHaveBeenCalled();
    
    // Assert user info was attached to request
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe(user.id);
    expect(req.user.role).toBe(user.role);
  });
  
  test('should return 401 if no token is provided', () => {
    // Mock request with no token
    req.header.mockReturnValue(undefined);
    
    // Call middleware
    authMiddleware(req, res, next);
    
    // Assert response
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Access denied. No token provided.' });
    expect(next).not.toHaveBeenCalled();
  });
  
  test('should return 401 if token is invalid', () => {
    // Mock request with invalid token
    req.header.mockReturnValue('Bearer invalid.token.here');
    
    // Call middleware
    authMiddleware(req, res, next);
    
    // Assert response
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token.' });
    expect(next).not.toHaveBeenCalled();
  });
  
  test('should handle malformed Authorization header', () => {
    // Mock request with malformed Authorization header (no Bearer prefix)
    req.header.mockReturnValue('malformed-header');
    
    // Call middleware
    authMiddleware(req, res, next);
    
    // Assert response
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
  
  test('should handle expired token', () => {
    // Create an expired token (set to expire immediately)
    const user = { id: '123', role: 'user' };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: 0 });
    
    // Wait briefly to ensure token expiration
    setTimeout(() => {
      // Mock request with expired token
      req.header.mockReturnValue(`Bearer ${token}`);
      
      // Call middleware
      authMiddleware(req, res, next);
      
      // Assert response
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token.' });
      expect(next).not.toHaveBeenCalled();
    }, 100);
  });
}); 