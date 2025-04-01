const mongoose = require('mongoose');
const User = require('../../../models/User');
const { request } = require('../../helpers/testRequest');
const TestDataFactory = require('../../helpers/testDataFactory');

describe('Auth Routes', () => {
  const baseUrl = '/api/auth';
  
  // Clear users before each test
  beforeEach(async () => {
    await User.deleteMany({});
  });
  
  describe('POST /register', () => {
    test('should register a new user with valid credentials', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123'
      };
      
      const response = await request
        .post(`${baseUrl}/register`)
        .send(userData);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Sikeres regisztráció!');
      
      // Verify user was created in database
      const createdUser = await User.findOne({ email: userData.email });
      expect(createdUser).toBeTruthy();
      expect(createdUser.username).toBe(userData.username);
      expect(createdUser.email).toBe(userData.email);
    });
    
    test('should return 400 if email is already registered', async () => {
      // Create a user first
      const existingUser = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: await TestDataFactory.hashPassword('Password123')
      };
      
      await User.create(existingUser);
      
      // Try to register with the same email
      const response = await request
        .post(`${baseUrl}/register`)
        .send({
          username: 'newuser',
          email: existingUser.email, // Same email
          password: 'Password123'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Ez az email cím már regisztrálva van!');
    });
    
    test('should return 400 if username is already taken', async () => {
      // Create a user first
      const existingUser = {
        username: 'uniqueusername',
        email: 'user1@example.com',
        password: await TestDataFactory.hashPassword('Password123')
      };
      
      await User.create(existingUser);
      
      // Try to register with the same username
      const response = await request
        .post(`${baseUrl}/register`)
        .send({
          username: existingUser.username, // Same username
          email: 'user2@example.com', // Different email
          password: 'Password123'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Ez a felhasználónév már foglalt!');
    });
  });
  
  describe('POST /login', () => {
    test('should login successfully with valid credentials', async () => {
      // Create a user first
      const password = 'Password123';
      const hashedPassword = await TestDataFactory.hashPassword(password);
      
      const user = await User.create({
        username: 'loginuser',
        email: 'login@example.com',
        password: hashedPassword
      });
      
      // Login with created user
      const response = await request
        .post(`${baseUrl}/login`)
        .send({
          email: user.email,
          password: password
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('userId');
      expect(response.body).toHaveProperty('username', user.username);
      expect(response.body).toHaveProperty('message', 'Sikeres bejelentkezés!');
    });
    
    test('should return 400 if email is not found', async () => {
      const response = await request
        .post(`${baseUrl}/login`)
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Hibás email cím vagy jelszó!');
    });
    
    test('should return 400 if password is incorrect', async () => {
      // Create a user first
      const user = await User.create({
        username: 'passworduser',
        email: 'password@example.com',
        password: await TestDataFactory.hashPassword('CorrectPassword123')
      });
      
      // Try to login with wrong password
      const response = await request
        .post(`${baseUrl}/login`)
        .send({
          email: user.email,
          password: 'WrongPassword123'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Hibás email cím vagy jelszó!');
    });
  });
}); 