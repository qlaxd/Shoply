const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminPrivilegeMiddleware = require('../middleware/adminPrivilegeMiddleware');
const {
  getAllUsers, promoteToAdmin, demoteToUser, deleteUser, adminUpdateUserStatus, adminUpdateUserProfile, // Added profile update
  adminGetAllLists, adminGetListById, adminUpdateList, adminDeleteList,
  adminAddProductToList, adminUpdateProductInList, adminRemoveProductFromList
} = require('../controllers/adminController');
const User = require('../models/User');

// GET /api/admin/users
router.get('/users', authMiddleware, adminPrivilegeMiddleware, getAllUsers);

// POST /api/admin/promote/:userId
router.post('/promote/:userId', authMiddleware, adminPrivilegeMiddleware, promoteToAdmin);

// POST /api/admin/demote/:userId
router.post('/demote/:userId', authMiddleware, adminPrivilegeMiddleware, demoteToUser);

// DELETE /api/admin/users/:userId
router.delete('/users/:userId', authMiddleware, adminPrivilegeMiddleware, deleteUser);

// PUT /api/admin/users/:userId/status - Update user status (ban/unban)
router.put('/users/:userId/status', authMiddleware, adminPrivilegeMiddleware, adminUpdateUserStatus);
// PUT /api/admin/users/:userId - Update user profile details (admin only)
router.put('/users/:userId', authMiddleware, adminPrivilegeMiddleware, adminUpdateUserProfile);

// Admin routes for Lists
// Admin routes for Lists
// GET /api/admin/lists - Get all lists (admin only)
router.get('/lists', authMiddleware, adminPrivilegeMiddleware, adminGetAllLists);

// GET /api/admin/lists/:id - Get a specific list by ID (admin only)
router.get('/lists/:id', authMiddleware, adminPrivilegeMiddleware, adminGetListById);
// PUT /api/admin/lists/:id - Update a specific list by ID (admin only)
router.put('/lists/:id', authMiddleware, adminPrivilegeMiddleware, adminUpdateList);

// DELETE /api/admin/lists/:id - Delete a specific list by ID (admin only)
router.delete('/lists/:id', authMiddleware, adminPrivilegeMiddleware, adminDeleteList);
// Admin routes for managing Products within Lists
// POST /api/admin/lists/:listId/products - Add product to a list (admin only)
router.post('/lists/:listId/products', authMiddleware, adminPrivilegeMiddleware, adminAddProductToList);

// PUT /api/admin/lists/:listId/products/:productId - Update product in a list (admin only)
router.put('/lists/:listId/products/:productId', authMiddleware, adminPrivilegeMiddleware, adminUpdateProductInList);

// DELETE /api/admin/lists/:listId/products/:productId - Remove product from a list (admin only)
router.delete('/lists/:listId/products/:productId', authMiddleware, adminPrivilegeMiddleware, adminRemoveProductFromList);

module.exports = router;