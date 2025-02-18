const mongoose = require('../../../Backend/node_modules/mongoose');
const ProductCatalog = require('../../../Backend/models/ProductCatalog');
const User = require('../../../Backend/models/User');

async function seedProductCatalogs() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017');

    // Admin felhasználó keresése
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      throw new Error('Admin felhasználó nem található! Először futtasd a users/seedUsers.js scriptet!');
    }

    const productCatalogs = [
      {
        name: 'Félbarna kenyér',
        categoryHierarchy: ['Élelmiszerek', 'Pékáruk'],
        defaultUnit: 'kg',
        createdBy: admin._id
      },
      {
        name: 'Zsemle',
        categoryHierarchy: ['Élelmiszerek', 'Pékáruk'],
        defaultUnit: 'db',
        createdBy: admin._id
      },
      {
        name: 'Tej 2,8%',
        categoryHierarchy: ['Élelmiszerek', 'Tejtermékek'],
        defaultUnit: 'l',
        createdBy: admin._id
      },
      {
        name: 'Trappista sajt',
        categoryHierarchy: ['Élelmiszerek', 'Tejtermékek'],
        defaultUnit: 'kg',
        createdBy: admin._id
      },
      {
        name: 'Mosogatószer',
        categoryHierarchy: ['Háztartási cikkek', 'Tisztítószerek'],
        defaultUnit: 'db',
        createdBy: admin._id
      },
      {
        name: 'Mosópor',
        categoryHierarchy: ['Háztartási cikkek', 'Tisztítószerek'],
        defaultUnit: 'kg',
        createdBy: admin._id
      },
      {
        name: 'Tányérkészlet',
        categoryHierarchy: ['Háztartási cikkek', 'Konyhai eszközök'],
        defaultUnit: 'készlet',
        createdBy: admin._id
      },
      {
        name: 'USB kábel',
        categoryHierarchy: ['Elektronika', 'Számítástechnika'],
        defaultUnit: 'db',
        createdBy: admin._id
      },
      {
        name: 'Egér',
        categoryHierarchy: ['Elektronika', 'Számítástechnika'],
        defaultUnit: 'db',
        createdBy: admin._id
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