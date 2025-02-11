const mongoose = require('../../Backend/node_modules/mongoose');
const User = require('../../Backend/models/User');

async function deSeedUsers() {
  try {
    // Csatlakozás az adatbázishoz
    await mongoose.connect('mongodb://127.0.0.1:27017');
    
    // Összes felhasználó törlése
    await User.deleteMany({});
    console.log('Az összes felhasználó sikeresen törölve.');

    // Kapcsolat bontása
    await mongoose.disconnect();
    console.log('Adatbázis kapcsolat bontva.');
    
  } catch (error) {
    console.error('Hiba a felhasználók törlésekor:', error);
    process.exit(1);
  }
}

deSeedUsers();