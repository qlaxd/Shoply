const request = require('supertest');
const app = require('../app');
const List = require('../models/List');

describe('List API', () => {
  let testListId;
  let authToken;

  beforeAll(async () => {
    // Bejelentkezés és token lekérés
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'teszt@example.com', password: 'TesztJelszo123' });
    authToken = res.body.token;
  });

  test('Új lista létrehozása', async () => {
    const res = await request(app)
      .post('/api/lists')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Teszt lista',
        products: [{ name: 'Teszt termék', category: '60d5ecb58d1a8f3a249b25f1', quantity: 2 }]
      });
    
    expect(res.statusCode).toEqual(201);
    testListId = res.body._id;
  });

  test('Lista lekérése ID alapján', async () => {
    const res = await request(app)
      .get(`/api/lists/${testListId}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Teszt lista');
  });
});