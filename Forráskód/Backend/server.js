const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

dotenv.config(); // .env fájl betöltése, hogy elérhető legyen a process.env objektumon keresztül

const app = express();

app.use(cors({
  origin: [
    'http://192.168.64.5:3000',
    'http://localhost:3000' // ahonnan a frontend kérések jönnek (ahol a web-app fut)
  ],
  credentials: true, // engedélyezi a hitelesített kéréseket
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // engedélyezett HTTP metódusok
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'] // engedélyezett fejlécek
}));

app.use(express.json()); // JSON formátumú kérések feldolgozása

mongoose.connect(process.env.MONGO_URI) // MongoDB kapcsolat létrehozása
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/auth', authRoutes); // minden authRoutes-ban definiált végpont elé odakerül az /api/auth prefix

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`)); // szerver futtatása, a 0.0.0.0 azt jelenti, hogy a szerver minden hálózati interfészen fogadja a kapcsolatokat, nem csak a localhost-on

