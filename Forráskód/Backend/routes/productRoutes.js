const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all products
router.get('/', authMiddleware, getAllProducts);

// Get a single product by ID
router.get('/:id', authMiddleware, getProductById);

// Create a new product
router.post('/', authMiddleware, createProduct);

// Update a product by ID
router.put('/:id', authMiddleware, updateProduct);

// Delete a product by ID
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;