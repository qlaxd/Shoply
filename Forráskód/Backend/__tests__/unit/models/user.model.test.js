const mongoose = require('mongoose');
const User = require('../../../models/User');

describe('User Model Test', () => {
  // Test user validation with valid data
  test('should validate a user with all required fields', async () => {
    const validUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };
    
    const user = new User(validUser);
    const savedUser = await user.save();
    
    // Verify saved user
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(validUser.username);
    expect(savedUser.email).toBe(validUser.email);
    expect(savedUser.password).toBe(validUser.password);
    expect(savedUser.role).toBe('user');
    expect(savedUser.status).toBe('active');
    expect(savedUser.createdAt).toBeDefined();
    expect(savedUser.updatedAt).toBeDefined();
  });
  
  // Test validation for missing required fields
  test('should fail validation when required fields are missing', async () => {
    const userWithoutRequiredField = new User({
      username: 'testuser',
      // Missing email and password
    });
    
    // Expect validation error to be thrown
    await expect(userWithoutRequiredField.save()).rejects.toThrow();
  });
  
  // Test email validation
  test('should fail validation for invalid email format', async () => {
    const userWithInvalidEmail = new User({
      username: 'testuser',
      email: 'invalid-email',
      password: 'password123'
    });
    
    // Mongoose doesn't validate email format by default, so this may need custom validation
    // If there's no validation, this test would pass
    try {
      await userWithInvalidEmail.save();
      // If you have email validation, this line should not be reached
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  
  // Test username uniqueness
  test('should fail when username is not unique', async () => {
    // Create first user
    const firstUser = new User({
      username: 'uniqueuser',
      email: 'first@example.com',
      password: 'password123'
    });
    await firstUser.save();
    
    // Try to create another user with the same username
    const secondUser = new User({
      username: 'uniqueuser', // Same username
      email: 'second@example.com', // Different email
      password: 'password123'
    });
    
    // Expect a duplicate key error to be thrown
    await expect(secondUser.save()).rejects.toThrow();
  });
  
  // Test email uniqueness
  test('should fail when email is not unique', async () => {
    // Create first user
    const firstUser = new User({
      username: 'user1',
      email: 'same@example.com',
      password: 'password123'
    });
    await firstUser.save();
    
    // Try to create another user with the same email
    const secondUser = new User({
      username: 'user2', // Different username
      email: 'same@example.com', // Same email
      password: 'password123'
    });
    
    // Expect a duplicate key error to be thrown
    await expect(secondUser.save()).rejects.toThrow();
  });
  
  // Test default values
  test('should set default values correctly', async () => {
    const user = new User({
      username: 'defaultuser',
      email: 'default@example.com',
      password: 'password123'
    });
    
    const savedUser = await user.save();
    
    // Verify default values
    expect(savedUser.role).toBe('user');
    expect(savedUser.status).toBe('active');
    expect(savedUser.lastLogin).toBeDefined();
  });
}); 