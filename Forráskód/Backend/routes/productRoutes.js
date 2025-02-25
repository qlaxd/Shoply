const express = require('express');
const router = express.Router();
const { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  searchProducts
} = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

// Termékek végpontjai
router.get('/', authMiddleware, getAllProducts);
router.get('/search', authMiddleware, searchProducts);
router.get('/:id', authMiddleware, getProductById);
router.post('/', authMiddleware, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;