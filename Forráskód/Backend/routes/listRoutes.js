const express = require('express');
const router = express.Router();
const { getAllLists, getListById, createList, updateList, deleteList, shareList, unshareList, addProductToList, removeProductFromList, updateProductInList } = require('../controllers/listController');
const authMiddleware = require('../middleware/authMiddleware');
const { viewPermission, editPermission, adminPermission, ownerPermission } = require('../middleware/listPermissionMiddleware');

// Get all lists
router.get('/', authMiddleware, getAllLists);

// Get a single list by ID
router.get('/:id', authMiddleware, viewPermission, getListById);

// Create a new list
router.post('/', authMiddleware, createList);

// Update a list by ID
router.put('/:id', authMiddleware, editPermission, updateList);

// Delete a list by ID
router.delete('/:id', authMiddleware, ownerPermission, deleteList);

// Lista megosztása POST http://localhost:5000/api/lists/{userId}/share
router.post('/:id/share', authMiddleware, ownerPermission, shareList);

// Megosztás visszavonása DELETE http://localhost:5000/api/lists/{userId}/unshare
router.delete('/:id/unshare', authMiddleware, ownerPermission, unshareList);

// Termékekkel kapcsolatos műveletek a listákon
router.post('/:id/products', authMiddleware, editPermission, addProductToList);
router.delete('/:listId/products/:productId', authMiddleware, editPermission, removeProductFromList);
router.put('/:listId/products/:productId', authMiddleware, editPermission, updateProductInList);

module.exports = router;