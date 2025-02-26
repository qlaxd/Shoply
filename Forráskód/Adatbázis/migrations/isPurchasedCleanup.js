// isPurchasedCleanup.js
const mongoose = require('../../Backend/node_modules/mongoose');
const Product = require('../../Backend/models/Product');

async function cleanupIsPurchased() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017');
    
    const result = await mongoose.connection.db.collection('products').updateMany(
      {}, 
      { $unset: { isPurchased: "" } }
    );
    
    console.log(`${result.modifiedCount} termékből sikeresen eltávolítva az isPurchased mező`);
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Hiba a tisztítás során:', error);
  }
}

cleanupIsPurchased();