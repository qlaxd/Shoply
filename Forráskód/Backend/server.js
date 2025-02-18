const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const listRoutes = require('./routes/listRoutes');
const productRoutes = require('./routes/productRoutes'); // Import the product routes
const cors = require('cors');
const connectDB = require('./config/db'); // Importáljuk a connectDB függvényt
const mongoose = require('mongoose');

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

app.use('/api/auth', authRoutes); // Prefix all endpoints defined in authRoutes with /api/auth
app.use('/api/admin', adminRoutes); // Prefix all endpoints defined in adminRoutes with /api/admin
app.use('/api/lists', listRoutes); // Prefix all endpoints defined in listRoutes with /api/lists
app.use('/api/products', productRoutes); // Prefix all endpoints defined in productRoutes with /api/products


const PORT = process.env.PORT;
const HOST = process.env.HOST;

app.listen(PORT, HOST, () => console.log(`Server running on http://${HOST}:${PORT}`)); 
console.log(process.env.HOST, process.env.PORT);
