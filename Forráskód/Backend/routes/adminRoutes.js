const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminPrivilegeMiddleware = require('../middleware/adminPrivilegeMiddleware');
const { getAllUsers } = require('../controllers/adminController');
const User = require('../models/User');

// GET /api/admin/users
router.get('/users', authMiddleware, adminPrivilegeMiddleware, getAllUsers);

// POST /api/admin/promote/:userId
router.post('/promote/:userId', authMiddleware, adminPrivilegeMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'Felhasználó nem található.' });
    }
    user.role = 'admin';
    await user.save();
    res.status(200).json({ message: 'Felhasználó adminná téve.' });
  } catch (error) {
    res.status(500).json({ message: 'Hiba történt.' });
  }
});

module.exports = router; 