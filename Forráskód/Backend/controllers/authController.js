const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// regisztráció
exports.register = async (req, res) => { 
  const { username, email, password } = req.body; // request body-ból kiolvassuk a felhasználónevet, az emailt és a jelszót
  try {
    const existingUser = await User.findOne({ email }); // email alapján keresünk egy user-t
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Ez az email cím már regisztrálva van!' 
      });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ 
        message: 'Ez a felhasználónév már foglalt!' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // jelszó hashelése
    const newUser = new User({ username, email, password: hashedPassword }); 
    await newUser.save(); // user mentése a MongoDB-be
    console.log(newUser);
    res.status(201).json({ message: 'Sikeres regisztráció!' }); 
  } catch (error) {
    res.status(500).json({ 
      message: 'Hiba történt a regisztráció során. Kérlek próbáld újra!' 
    });
  }
};

// bejelentkezés
exports.login = async (req, res) => { 
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        message: 'Hibás email cím vagy jelszó!' 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password); // jelszó összehasonlítás
    if (!isMatch) {
      return res.status(400).json({  
        message: 'Hibás email cím vagy jelszó!' 
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {  // 1 órás token generálás
      expiresIn: '1h' 
    });
    res.json({ token, message: 'Sikeres bejelentkezés!' }); // token küldése a kliensnek
  } catch (error) {
    res.status(500).json({ 
      message: 'Hiba történt a bejelentkezés során. Kérlek próbáld újra!' 
    });
  }
};