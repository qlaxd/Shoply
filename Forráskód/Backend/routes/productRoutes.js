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
const adminPrivilegeMiddleware = require('../middleware/adminPrivilegeMiddleware');

// Termékek végpontjai
router.get('/', authMiddleware, getAllProducts);
router.get('/search', authMiddleware, searchProducts);
router.get('/:id', authMiddleware, getProductById);

// Admin jogosultsággal elérhető végpontok
router.post('/', authMiddleware, adminPrivilegeMiddleware, createProduct);
router.put('/:id', authMiddleware, adminPrivilegeMiddleware, updateProduct);
router.delete('/:id', authMiddleware, adminPrivilegeMiddleware, deleteProduct);

module.exports = router;