const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected routes - current user
router.get('/me', authMiddleware, userController.getCurrentUser);
router.put('/profile', authMiddleware, userController.updateProfile);
router.put('/password', authMiddleware, userController.changePassword);

// Search users - accessible to authenticated users
router.get('/search', authMiddleware, userController.searchUsers);

// Get user by ID - accessible to authenticated users
router.get('/:id', authMiddleware, userController.getUserById);

module.exports = router; 