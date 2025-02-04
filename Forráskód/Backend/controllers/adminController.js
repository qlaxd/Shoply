const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (error) {
    console.error('Hiba a felhasználók lekérdezésekor:', error);
    return res.status(500).json({ message: 'Szerverhiba történt.' });
  }
}; 