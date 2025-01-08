const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

dotenv.config(); // .env fájl betöltése, hogy elérhető legyen a process.env objektumon keresztül

const app = express();

// Debug middleware hozzáadása a CORS előtt
app.use((req, res, next) => {
  console.log('Bejövő kérés:', {
    method: req.method,
    url: req.url,
    origin: req.headers.origin,
    headers: req.headers
  });
  next();
});

/*
 *
 * CORS beállítások:
 * 
 * Csak a frontend alkalmazás domain-jéről fogad el kéréseket
 * Meghatározza az engedélyezett HTTP metódusokat
 * Kezeli a preflight kéréseket
 * 
 */

app.use(cors({
  origin: [ // ahonnan a frontend kérések jönnek (ahol a web-app fut)
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  credentials: true, // engedélyezi a hitelesített kéréseket
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // engedélyezett HTTP metódusok
  allowedHeaders: ['Content-Type', 'Authorization'] // engedélyezett fejlécek
}));

app.use(express.json()); // JSON formátumú kérések feldolgozása

mongoose.connect(process.env.MONGO_URI) // MongoDB kapcsolat létrehozása
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/auth', authRoutes); // minden authRoutes-ban definiált végpont elé odakerül az /api/auth prefix

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';
app.listen(PORT, HOST, () => console.log(`Server running on http://${HOST}:${PORT}`)); 
console.log(process.env.HOST, process.env.PORT);
