const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// regisztráció
exports.register = async (req, res) => {
  const { username, email, password } = req.body; // request body-ból kiolvassuk a felhasználónevet, az emailt és a jelszót
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // jelszó hashelése (10-karakteres hash)
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save(); // user mentése a MongoDB-be
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

// bejelentkezés
exports.login = async (req, res) => {
  console.log('Login request received', req.body);
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }); // email alapján keresünk egy user-t
    console.log('User found: ', user ? 'true' : 'false');
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password); // jelszó összehasonlítás
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // token generálás
    res.json({ token });
  } catch (error) {
    console.error('Login failed', error);
    res.status(500).json({ error: 'Login failed' });
  }
};
