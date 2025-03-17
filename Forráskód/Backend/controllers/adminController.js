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

exports.promoteToAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'Felhasználó nem található' });
    }
    user.role = 'admin';
    await user.save();
    res.status(200).json({ message: 'Felhasználó adminná téve' });
  } catch (error) {
    res.status(500).json({ message: 'Hiba adminná tételkor', error });
  }
};

exports.demoteToUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'Felhasználó nem található' });
    }
    user.role = 'user';
    await user.save();
    res.status(200).json({ message: 'Felhasználó jogosultsága visszavonva' });
  } catch (error) {
    res.status(500).json({ message: 'Hiba a jogosultság visszavonásakor', error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'Felhasználó nem található' });
    }
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ message: 'Felhasználó sikeresen törölve' });
  } catch (error) {
    res.status(500).json({ message: 'Hiba a felhasználó törlésekor', error });
  }
};


