const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const listRoutes = require('./routes/listRoutes');
const productCatalogRoutes = require('./routes/productCatalogRoutes'); // Import the product catalog routes
const statisticsRoutes = require('./routes/statisticsRoutes'); // Import the statistics routes
const statisticsController = require('./controllers/statisticsController');
const categoryRoutes = require('./routes/categoryRoutes'); // Import the category routes
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); // Import the user routes
const connectDB = require('./config/db'); // Importáljuk a connectDB függvényt
const cron = require('node-cron');

dotenv.config(); // .env fájl betöltése, hogy elérhető legyen a process.env objektumon keresztül

const app = express();

const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  app.use((req, res, next) => {
    console.log('Bejövő kérés:', {
      method: req.method,
      url: req.url,
      origin: req.headers.origin,
      headers: req.headers,
      body: req.body,
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
app.use('/api/productCatalogs', productCatalogRoutes); // Prefix all endpoints defined in productCatalogRoutes with /api/productCatalogs
app.use('/api/categories', categoryRoutes); // Prefix all endpoints defined in categoryRoutes with /api/categories
app.use('/api/users', userRoutes); // Prefix all endpoints defined in userRoutes with /api/users
app.use('/api/statistics', statisticsRoutes); // Prefix all endpoints defined in statisticsRoutes with /api/statistics

// Naponta egyszer frissítse a statisztikákat, pl. éjfélkor
cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Statisztikák frissítése...');
    await statisticsController.updateStatistics();
    console.log('Statisztikák sikeresen frissítve');
  } catch (err) {
    console.error('Hiba a statisztikák frissítésekor:', err);
  }
});

const HOST = process.env.HOST;
const PORT = process.env.PORT;

app.listen(PORT, HOST, () => console.log(`Server running on http://${HOST}:${PORT}`)); 
console.log(process.env.HOST, process.env.PORT);
