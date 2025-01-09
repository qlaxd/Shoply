const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

dotenv.config(); // .env fájl betöltése, hogy elérhető legyen a process.env objektumon keresztül

const app = express();

const isDev = process.env.NODE_ENV === 'development';
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  `http://${process.env.FRONTEND_IP}:3000`
];

if (isDev) {
  app.use((req, res, next) => {
    console.log('Bejövő kérés:', {
      method: req.method,
      url: req.url,
      origin: req.headers.origin,
      headers: req.headers
    });
    next();
  });
}

/* CORS beállítások:
 * 
 * Csak a frontend alkalmazás domain-jéről fogad el kéréseket
 * Meghatározza az engedélyezett HTTP metódusokat
 * Kezeli a preflight kéréseket
 */

app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true, // engedélyezi a hitelesített kéréseket
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // engedélyezett HTTP metódusok
  allowedHeaders: ['Content-Type', 'Authorization'] // engedélyezett fejlécek
}));

app.use(express.json()); // JSON formátumú kérések feldolgozása

mongoose.connect(process.env.MONGO_URI) // MongoDB kapcsolat létrehozása
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Kilépés hiba esetén
  });

app.use('/api/auth', authRoutes); // minden authRoutes-ban definiált végpont elé odakerül az /api/auth prefix

const PORT = process.env.PORT;
const HOST = process.env.HOST;

app.listen(PORT, HOST, () => console.log(`Server running on http://${HOST}:${PORT}`)); 
console.log(process.env.HOST, process.env.PORT);
