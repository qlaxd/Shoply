const express = require('express');
const router = express.Router();
const { getAllLists, getListById, createList, updateList, deleteList, shareList, unshareList, addProductToList, removeProductFromList, updateProductInList } = require('../controllers/listController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all lists
router.get('/', authMiddleware, getAllLists);

// Get a single list by ID
router.get('/:id', authMiddleware, getListById);

// Create a new list
router.post('/', authMiddleware, createList);

// Update a list by ID
router.put('/:id', authMiddleware, updateList);

// Delete a list by ID
router.delete('/:id', authMiddleware, deleteList);

// Lista megosztása POST http://localhost:5000/api/lists/{userId}/share 
router.post('/:id/share', authMiddleware, shareList);

// Megosztás visszavonása DELETE http://localhost:5000/api/lists/{userId}/unshare
router.delete('/:id/unshare', authMiddleware, unshareList);

// Termékekkel kapcsolatos műveletek a listákon
router.post('/:id/products', authMiddleware, addProductToList);
router.delete('/:listId/products/:productId', authMiddleware, removeProductFromList);
router.put('/:listId/products/:productId', authMiddleware, updateProductInList);

module.exports = router;