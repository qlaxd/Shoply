const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminPrivilegeMiddleware = require('../middleware/adminPrivilegeMiddleware');
const { getAllUsers, promoteToAdmin, demoteToUser, deleteUser } = require('../controllers/adminController');
const User = require('../models/User');

// GET /api/admin/users
router.get('/users', authMiddleware, adminPrivilegeMiddleware, getAllUsers);

// POST /api/admin/promote/:userId
router.post('/promote/:userId', authMiddleware, adminPrivilegeMiddleware, promoteToAdmin);

// POST /api/admin/demote/:userId
router.post('/demote/:userId', authMiddleware, adminPrivilegeMiddleware, demoteToUser);

// DELETE /api/admin/users/:userId
router.delete('/users/:userId', authMiddleware, adminPrivilegeMiddleware, deleteUser);

module.exports = router; 