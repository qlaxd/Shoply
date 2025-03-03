const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminPrivilegeMiddleware = require('../middleware/adminPrivilegeMiddleware');
const { getAllUsers, promoteToAdmin } = require('../controllers/adminController');
const User = require('../models/User');

// GET /api/admin/users
router.get('/users', authMiddleware, adminPrivilegeMiddleware, getAllUsers);

// POST /api/admin/promote/:userId
router.post('/promote/:userId', authMiddleware, adminPrivilegeMiddleware, promoteToAdmin);

module.exports = router; 