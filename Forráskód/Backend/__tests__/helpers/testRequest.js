const supertest = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.test' });

// Create Express app
const app = express();

// Import routes
const authRoutes = require('../../routes/authRoutes');
const adminRoutes = require('../../routes/adminRoutes');
const listRoutes = require('../../routes/listRoutes');
const productCatalogRoutes = require('../../routes/productCatalogRoutes');
const statisticsRoutes = require('../../routes/statisticsRoutes');
const categoryRoutes = require('../../routes/categoryRoutes');
const userRoutes = require('../../routes/userRoutes');

// Import middleware if needed for testing
const authMiddleware = require('../../middleware/authMiddleware');
const adminPrivilegeMiddleware = require('../../middleware/adminPrivilegeMiddleware');
const listPermissionMiddleware = require('../../middleware/listPermissionMiddleware');

// Configure app middleware
app.use(express.json());

// Add request logging for debugging
app.use((req, res, next) => {
  console.log(`[TEST] ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Set up routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/productCatalogs', productCatalogRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/statistics', statisticsRoutes);

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Express error handler:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Create supertest instance
const request = supertest(app);

module.exports = {
  /**
   * Make a GET request
   * @param {string} url - The URL to request
   * @param {Object} headers - Headers to include
   * @returns {Promise} Supertest request
   */
  get: (url, headers = {}) => {
    return request.get(url).set(headers);
  },
  
  /**
   * Make a POST request
   * @param {string} url - The URL to request
   * @param {Object} body - Request body
   * @param {Object} headers - Headers to include
   * @returns {Promise} Supertest request
   */
  post: (url, body = {}, headers = {}) => {
    return request.post(url).send(body).set(headers);
  },
  
  /**
   * Make a PUT request
   * @param {string} url - The URL to request
   * @param {Object} body - Request body
   * @param {Object} headers - Headers to include
   * @returns {Promise} Supertest request
   */
  put: (url, body = {}, headers = {}) => {
    return request.put(url).send(body).set(headers);
  },
  
  /**
   * Make a DELETE request
   * @param {string} url - The URL to request
   * @param {Object} headers - Headers to include
   * @returns {Promise} Supertest request
   */
  delete: (url, headers = {}) => {
    return request.delete(url).set(headers);
  },
  
  /**
   * Make an authenticated request
   * @param {string} method - HTTP method
   * @param {string} url - The URL to request
   * @param {Object} body - Request body
   * @param {string} token - JWT token
   * @returns {Promise} Supertest request
   */
  withAuth: (method, url, body = {}, token) => {
    const headers = { 'Authorization': `Bearer ${token}` };
    console.log(`Making authenticated request: ${method.toUpperCase()} ${url}`);
    console.log('Token:', token);
    
    switch (method.toLowerCase()) {
      case 'get':
        return request.get(url).set(headers);
      case 'post':
        return request.post(url).send(body).set(headers);
      case 'put':
        return request.put(url).send(body).set(headers);
      case 'delete':
        return request.delete(url).set(headers);
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }
}; 