const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cors = require('cors');
const connectDB = require('./config/db'); // Importáljuk a connectDB függvényt

dotenv.config(); // .env fájl betöltése, hogy elérhető legyen a process.env objektumon keresztül

const app = express();

const isDev = process.env.NODE_ENV === 'development';

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

const corsConfig = require('./config/corsConfig');
app.use(cors(corsConfig)); // CORS beállítások alkalmazása
app.use(express.json()); // JSON formátumú kérések feldolgozása

connectDB(); // MongoDB kapcsolat létrehozása

app.use('/api/auth', authRoutes); // minden authRoutes-ban definiált végpont elé odakerül az /api/auth prefix
app.use('/api/admin', adminRoutes); // minden adminRoutes-ban definiált végpont elé odakerül az /api/admin prefix

const PORT = process.env.PORT;
const HOST = process.env.HOST;

app.listen(PORT, HOST, () => console.log(`Server running on http://${HOST}:${PORT}`)); 
console.log(process.env.HOST, process.env.PORT);
