const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const authMiddleware = require('../middleware/authMiddleware');
const adminPrivilegeMiddleware = require('../middleware/adminPrivilegeMiddleware');

// All statistics routes should be protected with authMiddleware
// Additionally, statistics routes should be protected with adminPrivilegeMiddleware
// since these are admin-specific endpoints

// Get all statistics
router.get('/', authMiddleware, adminPrivilegeMiddleware, statisticsController.getStatistics);

// Update statistics (this is resource-intensive and should be used carefully)
router.post('/update', authMiddleware, adminPrivilegeMiddleware, statisticsController.updateStatistics);

// Get user growth statistics
router.get('/users', authMiddleware, adminPrivilegeMiddleware, statisticsController.getUserGrowthStats);

// Get list activity statistics
router.get('/lists', authMiddleware, adminPrivilegeMiddleware, statisticsController.getListActivityStats);

// Get product statistics
router.get('/products', authMiddleware, adminPrivilegeMiddleware, statisticsController.getProductStats);

// Felhasználó saját statisztikáinak lekérése
// Csak authentikáció szükséges hozzá, admin jogosultság nem
router.get('/personal', authMiddleware, statisticsController.getUserPersonalStats);

module.exports = router;
