const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // ahonnan a frontend kérések jönnek (ahol a web-app fut)
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // engedélyezett HTTP metódusok
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // engedélyezett fejlécek
  res.header('Access-Control-Allow-Credentials', 'true'); // engedélyezi a hitelesített kéréseket
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200); // ha a kérés egy preflight kérés, akkor visszaadjuk a 200-as státuszt
  }
  next();
});

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/auth', authRoutes); // minden authRoutes-ban definiált végpont elé odakerül az /api/auth prefix

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
