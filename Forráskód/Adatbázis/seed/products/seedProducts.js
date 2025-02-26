const mongoose = require('../../../Backend/node_modules/mongoose');
const Product = require('../../../Backend/models/Product');
const ProductCatalog = require('../../../Backend/models/ProductCatalog');
const User = require('../../../Backend/models/User');

async function seedProducts() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017');

    // Termék katalógus elemek keresése
    const catalogItems = await ProductCatalog.find();
    if (catalogItems.length === 0) {
      throw new Error('Nincsenek termék katalógus elemek! Először futtasd a productCatalogs/seedProductCatalogs.js scriptet!');
    }

    // Admin felhasználó keresése (opcionális, ha szükséges)
    const admin = await User.findOne({ role: 'admin' });
    
    // Legalább 20 termék létrehozása, hogy a rendszer rendelkezzen termék példányokkal
    const productsToCreate = [
      // Katalógus alapú termékek
      ...catalogItems.slice(0, 5).map(item => ({
        catalogItem: item._id,
      })),
      
      // Katalógus nélküli termékek
      {
        name: "Házi készítésű lekvár",
        unit: "üveg",
      },
      {
        name: "Speciális gyógytea",
        unit: "csomag"  
      },
      {
        name: "Házi sütemény",
        unit: "db"
      }
    ];
    
    for (const productData of productsToCreate) {
      // Ha katalógus alapú termék, ellenőrizzük, létezik-e már
      let checkCondition = productData.catalogItem 
        ? { catalogItem: productData.catalogItem, quantity: productData.quantity }
        : { name: productData.name, quantity: productData.quantity };
        
      const existingProduct = await Product.findOne(checkCondition);
      
      if (!existingProduct) {
        const product = new Product(productData);
        await product.save();
        
        let productName = productData.catalogItem 
          ? (await ProductCatalog.findById(productData.catalogItem)).name
          : productData.name;
          
        console.log(`Termék létrehozva: ${productName} - ${productData.quantity} ${productData.unit || 'db'}`);
      } else {
        let productName = productData.catalogItem 
          ? (await ProductCatalog.findById(productData.catalogItem)).name
          : productData.name;
          
        console.log(`Termék már létezik: ${productName}`);
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