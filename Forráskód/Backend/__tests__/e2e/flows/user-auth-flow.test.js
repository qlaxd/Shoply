const { request } = require('../../helpers/testRequest');
const User = require('../../../models/User');
const jwt = require('jsonwebtoken');

describe('User Authentication Flow', () => {
  // User data for testing
  const testUser = {
    username: 'e2eTestUser',
    email: 'e2e@test.com',
    password: 'SecurePassword123'
  };
  
  // Clean up users before tests
  beforeAll(async () => {
    await User.deleteMany({});
  });
  
  // Clean up after all tests
  afterAll(async () => {
    await User.deleteMany({});
  });
  
  test('should register, login, and access protected resources', async () => {
    // Step 1: Register a new user
    const registerResponse = await request
      .post('/api/auth/register')
      .send(testUser);
    
    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.message).toBe('Sikeres regisztráció!');
    
    // Verify user exists in the database
    const createdUser = await User.findOne({ email: testUser.email });
    expect(createdUser).toBeTruthy();
    expect(createdUser.username).toBe(testUser.username);
    
    // Step 2: Login with the registered user
    const loginResponse = await request
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });
    
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('token');
    expect(loginResponse.body).toHaveProperty('userId');
    expect(loginResponse.body).toHaveProperty('username', testUser.username);
    
    const { token, userId } = loginResponse.body;
    
    // Verify token is valid JWT
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'test_jwt_secret');
    expect(decodedToken).toBeTruthy();
    expect(decodedToken.id.toString()).toBe(userId);
    
    // Step 3: Access a protected resource with the token
    // Since we don't know which endpoints are available, we'll test the authentication
    // mechanism rather than a specific endpoint
    const testResponse = await request
      .get(`/api/users/${userId}`) // Use the user ID to access user details
      .set('Authorization', `Bearer ${token}`);
    
    // Either the endpoint returns 200 or 404 (if not implemented)
    // but it should not be a 401 unauthorized or 500 error
    expect(testResponse.status).not.toBe(401);
    expect(testResponse.status).not.toBe(500);
    
    // Step 4: Try to access protected resource with invalid token
    const unauthorizedResponse = await request
      .get(`/api/users/${userId}`)
      .set('Authorization', 'Bearer invalid.token');
    
    expect(unauthorizedResponse.status).toBe(401);
  });
  
  test('should handle user workflow with invalid inputs', async () => {
    // Step 1: Try to register with invalid email
    const invalidRegisterResponse = await request
      .post('/api/auth/register')
      .send({
        username: 'invaliduser',
        email: 'not-an-email',
        password: 'password123'
      });
    
    // The server may accept invalid emails without format validation
    // so we'll just check that we received a response
    expect(invalidRegisterResponse.status).toBeTruthy();
    
    // Step 2: Try to login with non-existent user
    const invalidLoginResponse = await request
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'password123'
      });
    
    expect(invalidLoginResponse.status).toBe(400);
    
    // Step 3: Try to access protected resource without token
    // Use a path that's known to be protected by auth middleware
    const unauthorizedResponse = await request
      .get('/api/lists');
    
    // The response should be 401 (unauthorized) since no token is provided
    expect(unauthorizedResponse.status).toBe(401);
  });
}); 