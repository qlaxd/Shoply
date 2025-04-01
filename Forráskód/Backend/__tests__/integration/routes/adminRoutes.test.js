const mongoose = require('mongoose');
const testRequest = require('../../helpers/testRequest');
const User = require('../../../models/User');
const TestDataFactory = require('../../helpers/testDataFactory');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Mock JWT for consistent tokens in tests
jest.mock('jsonwebtoken');

describe('Admin Routes', () => {
  let adminUser;
  let regularUser;
  let adminToken;
  let userToken;

  beforeEach(async () => {
    // Clear users collection before each test
    await User.deleteMany({});
    
    // Create admin user
    adminUser = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('adminpassword', 10),
      role: 'admin'
    });
    await adminUser.save();
    
    // Create regular user
    regularUser = new User({
      username: 'user',
      email: 'user@example.com',
      password: await bcrypt.hash('userpassword', 10),
      role: 'user'
    });
    await regularUser.save();
    
    // Setup mock for JWT to act like real JWT
    jwt.verify.mockImplementation((token, secret) => {
      // Extract the payload part (based on how our mock token is generated)
      const parts = token.split('-');
      const id = parts[2]; // 'test-token-id-role'
      const role = parts[3];
      
      return { id, role };
    });
    
    // Generate tokens (they should be valid JWT format)
    adminToken = `test-token-${adminUser._id}-admin`;
    userToken = `test-token-${regularUser._id}-user`;
  });

  describe('GET /api/admin/users', () => {
    it('should return all users when admin is authenticated', async () => {
      // Execute with Authorization header
      const response = await testRequest.get('/api/admin/users', {
        'Authorization': `Bearer ${adminToken}`
      });
      
      // Assert
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body.some(user => user.email === 'admin@example.com')).toBe(true);
      expect(response.body.some(user => user.email === 'user@example.com')).toBe(true);
    });

    it('should return 401 when not authenticated', async () => {
      // Execute without token
      const response = await testRequest.get('/api/admin/users');
      
      // Assert
      expect(response.statusCode).toBe(401);
    });

    it('should return 403 when authenticated as regular user', async () => {
      // Execute with user token instead of admin token
      const response = await testRequest.get('/api/admin/users', {
        'Authorization': `Bearer ${userToken}`
      });
      
      // Assert
      expect(response.statusCode).toBe(403);
    });
  });

  describe('POST /api/admin/promote/:userId', () => {
    it('should promote user to admin role', async () => {
      // Execute
      const response = await testRequest.post(`/api/admin/promote/${regularUser._id}`, {}, {
        'Authorization': `Bearer ${adminToken}`
      });
      
      // Assert
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'Felhasználó adminná téve');
      
      // Verify user was updated in database
      const updatedUser = await User.findById(regularUser._id);
      expect(updatedUser.role).toBe('admin');
    });

    it('should return 404 if user not found', async () => {
      // Execute with non-existent user ID
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await testRequest.post(`/api/admin/promote/${nonExistentId}`, {}, {
        'Authorization': `Bearer ${adminToken}`
      });
      
      // Assert
      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('message', 'Felhasználó nem található');
    });

    it('should return 401 when not authenticated', async () => {
      // Execute without token
      const response = await testRequest.post(`/api/admin/promote/${regularUser._id}`);
      
      // Assert
      expect(response.statusCode).toBe(401);
    });

    it('should return 403 when authenticated as regular user', async () => {
      // Execute with user token
      const response = await testRequest.post(`/api/admin/promote/${regularUser._id}`, {}, {
        'Authorization': `Bearer ${userToken}`
      });
      
      // Assert
      expect(response.statusCode).toBe(403);
    });
  });

  describe('POST /api/admin/demote/:userId', () => {
    it('should demote admin to user role', async () => {
      // Create another admin to demote
      const anotherAdmin = new User({
        username: 'admin2',
        email: 'admin2@example.com',
        password: await bcrypt.hash('adminpassword', 10),
        role: 'admin'
      });
      await anotherAdmin.save();
      
      // Execute
      const response = await testRequest.post(`/api/admin/demote/${anotherAdmin._id}`, {}, {
        'Authorization': `Bearer ${adminToken}`
      });
      
      // Assert
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'Felhasználó jogosultsága visszavonva');
      
      // Verify user was updated in database
      const updatedUser = await User.findById(anotherAdmin._id);
      expect(updatedUser.role).toBe('user');
    });

    it('should return 404 if user not found', async () => {
      // Execute with non-existent user ID
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await testRequest.post(`/api/admin/demote/${nonExistentId}`, {}, {
        'Authorization': `Bearer ${adminToken}`
      });
      
      // Assert
      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('message', 'Felhasználó nem található');
    });

    it('should return 401 when not authenticated', async () => {
      // Execute without token
      const response = await testRequest.post(`/api/admin/demote/${adminUser._id}`);
      
      // Assert
      expect(response.statusCode).toBe(401);
    });

    it('should return 403 when authenticated as regular user', async () => {
      // Execute with user token
      const response = await testRequest.post(`/api/admin/demote/${adminUser._id}`, {}, {
        'Authorization': `Bearer ${userToken}`
      });
      
      // Assert
      expect(response.statusCode).toBe(403);
    });
  });

  describe('DELETE /api/admin/users/:userId', () => {
    it('should delete a user', async () => {
      // Execute
      const response = await testRequest.delete(`/api/admin/users/${regularUser._id}`, {
        'Authorization': `Bearer ${adminToken}`
      });
      
      // Assert
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'Felhasználó sikeresen törölve');
      
      // Verify user was deleted from database
      const deletedUser = await User.findById(regularUser._id);
      expect(deletedUser).toBeNull();
    });

    it('should return 404 if user not found', async () => {
      // Execute with non-existent user ID
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await testRequest.delete(`/api/admin/users/${nonExistentId}`, {
        'Authorization': `Bearer ${adminToken}`
      });
      
      // Assert
      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('message', 'Felhasználó nem található');
    });

    it('should return 401 when not authenticated', async () => {
      // Execute without token
      const response = await testRequest.delete(`/api/admin/users/${regularUser._id}`);
      
      // Assert
      expect(response.statusCode).toBe(401);
    });

    it('should return 403 when authenticated as regular user', async () => {
      // Execute with user token
      const response = await testRequest.delete(`/api/admin/users/${regularUser._id}`, {
        'Authorization': `Bearer ${userToken}`
      });
      
      // Assert
      expect(response.statusCode).toBe(403);
    });
  });
}); 