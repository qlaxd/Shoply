const mongoose = require('mongoose');
const { checkListPermission } = require('../../../middleware/listPermissionMiddleware');
const List = require('../../../models/List');

// Mock the List model
jest.mock('../../../models/List');

describe('List Permission Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup request, response, and next function
    req = {
      user: { id: 'user123' },
      params: { id: 'list123' },
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    
    next = jest.fn();
  });

  test('should return 400 if list ID is missing', async () => {
    // Arrange
    req.params = {};
    const middleware = checkListPermission(['owner']);
    
    // Act
    await middleware(req, res, next);
    
    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Lista azonosító hiányzik'
    }));
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 404 if list is not found', async () => {
    // Arrange
    List.findById.mockResolvedValue(null);
    const middleware = checkListPermission(['owner']);
    
    // Act
    await middleware(req, res, next);
    
    // Assert
    expect(List.findById).toHaveBeenCalledWith('list123');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Lista nem található'
    }));
    expect(next).not.toHaveBeenCalled();
  });

  test('should allow access if user is owner and owner permission is required', async () => {
    // Arrange
    const mockList = {
      _id: 'list123',
      owner: 'user123',
      sharedUsers: []
    };
    List.findById.mockResolvedValue(mockList);
    const middleware = checkListPermission(['owner']);
    
    // Act
    await middleware(req, res, next);
    
    // Assert
    expect(List.findById).toHaveBeenCalledWith('list123');
    expect(next).toHaveBeenCalled();
    expect(req.list).toBe(mockList);
  });

  test('should allow access if user has required shared permission', async () => {
    // Arrange
    const mockList = {
      _id: 'list123',
      owner: 'otherUser',
      sharedUsers: [
        { user: 'user123', permissionLevel: 'edit' }
      ]
    };
    List.findById.mockResolvedValue(mockList);
    const middleware = checkListPermission(['owner', 'admin', 'edit']);
    
    // Act
    await middleware(req, res, next);
    
    // Assert
    expect(List.findById).toHaveBeenCalledWith('list123');
    expect(next).toHaveBeenCalled();
    expect(req.list).toBe(mockList);
    expect(req.userPermission).toBe('edit');
  });

  test('should deny access if user does not have required permission', async () => {
    // Arrange
    const mockList = {
      _id: 'list123',
      owner: 'otherUser',
      sharedUsers: [
        { user: 'user123', permissionLevel: 'view' }
      ]
    };
    List.findById.mockResolvedValue(mockList);
    const middleware = checkListPermission(['owner', 'admin', 'edit']);
    
    // Act
    await middleware(req, res, next);
    
    // Assert
    expect(List.findById).toHaveBeenCalledWith('list123');
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Nincs jogosultságod ehhez a művelethez'
    }));
    expect(next).not.toHaveBeenCalled();
  });

  test('should handle errors properly', async () => {
    // Arrange
    const error = new Error('Database error');
    List.findById.mockRejectedValue(error);
    const middleware = checkListPermission(['owner']);
    
    // Act
    await middleware(req, res, next);
    
    // Assert
    expect(List.findById).toHaveBeenCalledWith('list123');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Szerver hiba a jogosultságok ellenőrzése során'
    }));
    expect(next).not.toHaveBeenCalled();
  });
}); 