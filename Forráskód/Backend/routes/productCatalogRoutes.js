const express = require('express');
const router = express.Router();
const { 
  getAllCatalogItems, 
  getCatalogItemById, 
  createCatalogItem, 
  updateCatalogItem, 
  deleteCatalogItem,
  searchCatalogItems
} = require('../controllers/productCatalogController');
const authMiddleware = require('../middleware/authMiddleware');
const adminPrivilegeMiddleware = require('../middleware/adminPrivilegeMiddleware');

// Katalógus elemek végpontjai
router.get('/', authMiddleware, getAllCatalogItems);
router.get('/search', authMiddleware, searchCatalogItems);
router.get('/:id', authMiddleware, getCatalogItemById);

// Admin jogosultságot igénylő műveletek
router.post('/', authMiddleware, adminPrivilegeMiddleware, createCatalogItem);
router.put('/:id', authMiddleware, adminPrivilegeMiddleware, updateCatalogItem);
router.delete('/:id', authMiddleware, adminPrivilegeMiddleware, deleteCatalogItem);

module.exports = router; 