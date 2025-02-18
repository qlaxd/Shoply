const mongoose = require('../../../Backend/node_modules/mongoose');
const Product = require('../../../Backend/models/Product');
const ProductCatalog = require('../../../Backend/models/ProductCatalog');

async function seedProducts() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017');

    // Termék katalógus elemek keresése
    const catalogItems = await ProductCatalog.find();
    if (catalogItems.length === 0) {
      throw new Error('Nincsenek termék katalógus elemek! Először futtasd a productCatalogs/seedProductCatalogs.js scriptet!');
    }

    // Minden katalógus elemhez létrehozunk néhány terméket különböző mennyiségekkel
    for (const catalogItem of catalogItems) {
      // Minden katalógus elemhez 3 különböző terméket hozunk létre
      const quantities = [1, 2, 5]; // Különböző mennyiségek
      
      for (const quantity of quantities) {
        const product = new Product({
          catalogItem: catalogItem._id,
          quantity: quantity,
          isPurchased: Math.random() < 0.5 // 50% esély a megvásárlásra
        });

        await product.save();
        console.log(`Termék létrehozva: ${catalogItem.name} - ${quantity} ${catalogItem.defaultUnit}`);
      }
    }

    await mongoose.disconnect();
    console.log('Termékek seedelése sikeresen befejeződött!');
  } catch (error) {
    console.error('Hiba a termékek seedelése során:', error);
    process.exit(1);
  }
}

seedProducts(); 