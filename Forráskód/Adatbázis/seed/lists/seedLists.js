const mongoose = require('../../../Backend/node_modules/mongoose');
const List = require('../../../Backend/models/List');
const User = require('../../../Backend/models/User');
const Product = require('../../../Backend/models/Product');
const ProductCatalog = require('../../../Backend/models/ProductCatalog');

async function seedLists() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017');

    // Felhasználók keresése
    const users = await User.find({ role: 'user' });
    if (users.length === 0) {
      throw new Error('Nincsenek felhasználók! Először futtasd a users/seedUsers.js scriptet!');
    }

    // Termék katalógus elemek keresése
    const catalogItems = await ProductCatalog.find();
    if (catalogItems.length === 0) {
      throw new Error('Nincsenek termék katalógus elemek! Először futtasd a productCatalogs/seedProductCatalogs.js scriptet!');
    }

    // Minden felhasználóhoz létrehozunk egy listát
    for (const user of users) {
      // Véletlenszerűen kiválasztunk 2-5 terméket a katalógusból
      const selectedProducts = [];
      const numProducts = Math.floor(Math.random() * 4) + 2; // 2-5 közötti szám
      
      for (let i = 0; i < numProducts; i++) {
        const randomCatalogItem = catalogItems[Math.floor(Math.random() * catalogItems.length)];
        
        // Termék létrehozása
        const product = new Product({
          catalogItem: randomCatalogItem._id,
          quantity: Math.floor(Math.random() * 5) + 1, // 1-5 közötti mennyiség
          isPurchased: Math.random() < 0.3 // 30% esély a megvásárlásra
        });
        
        await product.save();
        selectedProducts.push(product._id);
      }

      // Lista létrehozása
      const listName = `${user.username} bevásárlólistája`;
      const existingList = await List.findOne({ name: listName, owner: user._id });
      
      if (!existingList) {
        const newList = new List({
          name: listName,
          owner: user._id,
          products: selectedProducts
        });
        
        await newList.save();
        console.log(`Lista létrehozva: ${listName}`);
      } else {
        console.log(`Lista már létezik: ${listName}`);
      }
    }

    await mongoose.disconnect();
    console.log('Listák seedelése sikeresen befejeződött!');
  } catch (error) {
    console.error('Hiba a listák seedelése során:', error);
    process.exit(1);
  }
}

seedLists(); 