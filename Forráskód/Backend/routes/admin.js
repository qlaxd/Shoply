const express = require('express');
const router = express.Router();
const adminJogosultságMiddleware = require('../middleware/adminJogosultsag');
const { getAllUsers } = require('../controllers/adminController');

// GET /api/admin/users
router.get('/users', adminJogosultságMiddleware, getAllUsers);

module.exports = router; 