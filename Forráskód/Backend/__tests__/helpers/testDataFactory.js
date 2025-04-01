const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

/**
 * Factory for generating test data
 */
class TestDataFactory {
  /**
   * Generate a test user
   * @param {Object} overrides - Fields to override default values
   * @returns {Object} User object
   */
  static generateUser(overrides = {}) {
    return {
      _id: new mongoose.Types.ObjectId(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      isAdmin: false,
      ...overrides
    };
  }

  /**
   * Generate a test category
   * @param {Object} overrides - Fields to override default values
   * @returns {Object} Category object
   */
  static generateCategory(overrides = {}) {
    return {
      _id: new mongoose.Types.ObjectId(),
      name: faker.commerce.department(),
      description: faker.commerce.productDescription(),
      ...overrides
    };
  }

  /**
   * Generate a test product catalog item
   * @param {Object} overrides - Fields to override default values
   * @returns {Object} Product catalog object
   */
  static generateProductCatalog(overrides = {}) {
    const categoryId = overrides.categoryId || new mongoose.Types.ObjectId();
    
    return {
      _id: new mongoose.Types.ObjectId(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      category: categoryId,
      ...overrides
    };
  }

  /**
   * Generate a test shopping list
   * @param {Object} overrides - Fields to override default values
   * @returns {Object} List object
   */
  static generateList(overrides = {}) {
    const userId = overrides.userId || new mongoose.Types.ObjectId();
    
    return {
      _id: new mongoose.Types.ObjectId(),
      name: faker.lorem.words(3),
      owner: userId,
      items: [],
      sharedWith: [],
      ...overrides
    };
  }

  /**
   * Generate a list item
   * @param {Object} overrides - Fields to override default values
   * @returns {Object} List item object
   */
  static generateListItem(overrides = {}) {
    const productId = overrides.productId || new mongoose.Types.ObjectId();
    
    return {
      _id: new mongoose.Types.ObjectId(),
      product: productId,
      quantity: faker.number.int({ min: 1, max: 10 }),
      checked: false,
      ...overrides
    };
  }

  /**
   * Generate a test JWT token
   * @param {Object} payload - Token payload
   * @returns {String} JWT token
   */
  static generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET || 'test_jwt_secret', { expiresIn: '1h' });
  }

  /**
   * Hash a password
   * @param {String} password - Plain text password
   * @returns {Promise<String>} Hashed password
   */
  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }
}

module.exports = TestDataFactory;

// Add a dummy test to satisfy Jest's requirement
test('TestDataFactory exists', () => {
  expect(TestDataFactory).toBeDefined();
}); 