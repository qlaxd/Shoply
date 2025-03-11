const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');
const adminPrivilegeMiddleware = require('../middleware/adminPrivilegeMiddleware');

// GET - Az összes kategória lekérése
router.get('/', categoryController.getAllCategories);

// GET - Kategóriák keresése név alapján
router.get('/search', categoryController.searchCategory);

// GET - Egy kategória lekérése ID alapján
router.get('/:id', categoryController.getCategoryById);

// POST - Új kategória létrehozása
router.post('/', authMiddleware, adminPrivilegeMiddleware, categoryController.createCategory);

// PUT - Kategória frissítése
router.put('/:id', authMiddleware, adminPrivilegeMiddleware, categoryController.updateCategory);

// DELETE - Kategória törlése
router.delete('/:id', authMiddleware, adminPrivilegeMiddleware, categoryController.deleteCategory);

module.exports = router;
