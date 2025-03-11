const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get the current logged in user (me)
exports.getCurrentUser = async (req, res) => {
    try {
        // req.user comes from the authMiddleware after verifying the token
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Felhasználó nem található' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ message: 'Hiba a felhasználói profil betöltésekor', error: error.message });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        
        // Check if username or email already exists for another user
        const existingUser = await User.findOne({
            $or: [
                { username, _id: { $ne: req.user.id } },
                { email, _id: { $ne: req.user.id } }
            ]
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                message: existingUser.username === username 
                    ? 'Ez a felhasználónév már foglalt' 
                    : 'Ez az email cím már regisztrálva van' 
            });
        }
        
        // Update the user profile
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: req.body },
            { new: true, runValidators: true }
        ).select('-password');
        
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Hiba a felhasználói profil frissítésekor', error: error.message });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        // Find user with password
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Felhasználó nem található' });
        }
        
        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'A jelenlegi jelszó helytelen' });
        }
        
        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        // Save user with new password
        await user.save();
        
        res.status(200).json({ message: 'Jelszó sikeresen módosítva' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Hiba a jelszó módosításakor', error: error.message });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Felhasználó nem található' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({ message: 'Hiba a felhasználó betöltésekor', error: error.message });
    }
};

// Search users by username or email
exports.searchUsers = async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) {
            return res.status(400).json({ message: 'Keresési kifejezés szükséges' });
        }
        
        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        }).select('-password');
        
        res.status(200).json(users);
    } catch (error) {
        console.error('Search users error:', error);
        res.status(500).json({ message: 'Hiba a felhasználók keresésekor', error: error.message });
    }
}; 