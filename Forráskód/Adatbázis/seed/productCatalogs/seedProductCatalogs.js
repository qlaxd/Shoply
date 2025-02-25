const mongoose = require('../../../Backend/node_modules/mongoose');
const ProductCatalog = require('../../../Backend/models/ProductCatalog');
const Category = require('../../../Backend/models/Category');
const User = require('../../../Backend/models/User');

async function seedProductCatalogs() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017');

    // Admin felhasználó keresése
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      throw new Error('Admin felhasználó nem található! Először futtasd a users/seedUsers.js scriptet!');
    }

    // Kategóriák lekérése
    const categories = await Category.find();
    if (categories.length === 0) {
      throw new Error('Nincsenek kategóriák! Először futtasd a categories/seedCategories.js scriptet!');
    }

    // Kategóriák keresése névvel
    const findCategoryByName = (name) => {
      return categories.find(cat => cat.name === name);
    };

    const productCatalogs = [
      {
        name: 'Félbarna kenyér',
        category: findCategoryByName('Pékáruk')._id,
        defaultUnit: 'kg',
        createdBy: admin._id,
        usageCount: Math.floor(Math.random() * 100)
      },
      {
        name: 'Zsemle',
        category: findCategoryByName('Pékáruk')._id,
        defaultUnit: 'db',
        createdBy: admin._id,
        usageCount: Math.floor(Math.random() * 100)
      },
      {
        name: 'Tej 2,8%',
        category: findCategoryByName('Tejtermékek')._id,
        defaultUnit: 'l',
        createdBy: admin._id,
        usageCount: Math.floor(Math.random() * 100)
      },
      {
        name: 'Trappista sajt',
        category: findCategoryByName('Tejtermékek')._id,
        defaultUnit: 'kg',
        createdBy: admin._id,
        usageCount: Math.floor(Math.random() * 100)
      },
      {
        name: 'Mosogatószer',
        category: findCategoryByName('Tisztítószerek')._id,
        defaultUnit: 'db',
        createdBy: admin._id,
        barcode: '5900000000001',
        usageCount: Math.floor(Math.random() * 100)
      },
      {
        name: 'Mosópor',
        category: findCategoryByName('Tisztítószerek')._id,
        defaultUnit: 'kg',
        createdBy: admin._id,
        barcode: '5900000000002',
        usageCount: Math.floor(Math.random() * 100)
      },
      {
        name: 'Tányérkészlet',
        category: findCategoryByName('Konyhai eszközök')._id,
        defaultUnit: 'készlet',
        createdBy: admin._id,
        usageCount: Math.floor(Math.random() * 100)
      },
      {
        name: 'USB kábel',
        category: findCategoryByName('Számítástechnika')._id,
        defaultUnit: 'db',
        createdBy: admin._id,
        barcode: '5900000000003',
        usageCount: Math.floor(Math.random() * 100)
      },
      {
        name: 'Egér',
        category: findCategoryByName('Számítástechnika')._id,
        defaultUnit: 'db',
        createdBy: admin._id,
        barcode: '5900000000004',
        usageCount: Math.floor(Math.random() * 100)
      },
      {
        name: 'Csirkemell',
        category: findCategoryByName('Húsáruk')._id,
        defaultUnit: 'kg',
        createdBy: admin._id,
        usageCount: Math.floor(Math.random() * 100)
      },
      {
        name: 'Alma',
        category: findCategoryByName('Zöldségek és gyümölcsök')._id,
        defaultUnit: 'kg',
        createdBy: admin._id,
        usageCount: Math.floor(Math.random() * 100)
      },
      {
        name: 'WC papír',
        category: findCategoryByName('Fürdőszobai kellékek')._id,
        defaultUnit: 'csomag',
        createdBy: admin._id,
        usageCount: Math.floor(Math.random() * 100)
      }
    ];

    for (const product of productCatalogs) {
      const existingProduct = await ProductCatalog.findOne({ name: product.name });
      if (!existingProduct) {
        await ProductCatalog.create(product);
        console.log(`Termék katalógus elem létrehozva: ${product.name}`);
      } else {
        console.log(`Termék katalógus elem már létezik: ${product.name}`);
      }
    }

    await mongoose.disconnect();
    console.log('Termék katalógus seedelése sikeresen befejeződött!');
  } catch (error) {
    console.error('Hiba a termék katalógus seedelése során:', error);
    process.exit(1);
  }
}

seedProductCatalogs(); 