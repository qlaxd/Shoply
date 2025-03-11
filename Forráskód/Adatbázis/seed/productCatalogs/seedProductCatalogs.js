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
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Zsemle',
        category: findCategoryByName('Pékáruk')._id,
        defaultUnit: 'db',
        createdBy: admin._id,
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Tej 2,8%',
        category: findCategoryByName('Tejtermékek')._id,
        defaultUnit: 'l',
        createdBy: admin._id,
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Trappista sajt',
        category: findCategoryByName('Tejtermékek')._id,
        defaultUnit: 'kg',
        createdBy: admin._id,
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Mosogatószer',
        category: findCategoryByName('Tisztítószerek')._id,
        defaultUnit: 'db',
        createdBy: admin._id,
        barcode: '5900000000001',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Mosópor',
        category: findCategoryByName('Tisztítószerek')._id,
        defaultUnit: 'kg',
        createdBy: admin._id,
        barcode: '5900000000002',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Tányérkészlet',
        category: findCategoryByName('Konyhai eszközök')._id,
        defaultUnit: 'készlet',
        createdBy: admin._id,
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'USB kábel',
        category: findCategoryByName('Számítástechnika')._id,
        defaultUnit: 'db',
        createdBy: admin._id,
        barcode: '5900000000003',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Egér',
        category: findCategoryByName('Számítástechnika')._id,
        defaultUnit: 'db',
        createdBy: admin._id,
        barcode: '5900000000004',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Csirkemell',
        category: findCategoryByName('Húsáruk')._id,
        defaultUnit: 'kg',
        createdBy: admin._id,
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Alma',
        category: findCategoryByName('Zöldségek és gyümölcsök')._id,
        defaultUnit: 'kg',
        createdBy: admin._id,
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'WC papír',
        category: findCategoryByName('Fürdőszobai kellékek')._id,
        defaultUnit: 'csomag',
        createdBy: admin._id,
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Kávé',
        category: findCategoryByName('Kávé')._id,
        defaultUnit: 'kg',
        createdBy: admin._id,
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Tej',
        category: findCategoryByName('Tejtermékek')._id,
        defaultUnit: 'liter',
        createdBy: admin._id,
        barcode: '5900000000005',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Sajt',
        category: findCategoryByName('Tejtermékek')._id,
        defaultUnit: 'kg',
        createdBy: admin._id,
        barcode: '5900000000006',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Kenyér',
        category: findCategoryByName('Pékáruk')._id,
        defaultUnit: 'db',
        createdBy: admin._id,
        barcode: '5900000000007',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Zsemle',
        category: findCategoryByName('Pékáruk')._id,
        defaultUnit: 'db',
        createdBy: admin._id,
        barcode: '5900000000008',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Banán',
        category: findCategoryByName('Zöldségek és gyümölcsök')._id,
        defaultUnit: 'kg',
        createdBy: admin._id,
        barcode: '5900000000009',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Narancs',
        category: findCategoryByName('Zöldségek és gyümölcsök')._id,
        defaultUnit: 'kg',
        createdBy: admin._id,
        barcode: '5900000000010',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Paradicsom',
        category: findCategoryByName('Zöldségek és gyümölcsök')._id,
        defaultUnit: 'kg',
        createdBy: admin._id,
        barcode: '5900000000011',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Uborka',
        category: findCategoryByName('Zöldségek és gyümölcsök')._id,
        defaultUnit: 'kg',
        createdBy: admin._id,
        barcode: '5900000000012',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Paprika',
        category: findCategoryByName('Zöldségek és gyümölcsök')._id,
        defaultUnit: 'kg',
        createdBy: admin._id,
        barcode: '5900000000013',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Hagyma',
        category: findCategoryByName('Zöldségek és gyümölcsök')._id,
        defaultUnit: 'kg',
        createdBy: admin._id,
        barcode: '5900000000014',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Fokhagyma',
        category: findCategoryByName('Zöldségek és gyümölcsök')._id,
        defaultUnit: 'db',
        createdBy: admin._id,
        barcode: '5900000000015',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Krumpli',
        category: findCategoryByName('Zöldségek és gyümölcsök')._id,
        defaultUnit: 'kg',
        createdBy: admin._id,
        barcode: '5900000000016',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Rizs',
        category: findCategoryByName('Élelmiszerek')._id,
        defaultUnit: 'kg',
        createdBy: admin._id,
        barcode: '5900000000017',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Tészta',
        category: findCategoryByName('Élelmiszerek')._id,
        defaultUnit: 'kg',
        createdBy: admin._id,
        barcode: '5900000000018',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Olaj',
        category: findCategoryByName('Élelmiszerek')._id,
        defaultUnit: 'liter',
        createdBy: admin._id,
        barcode: '5900000000019',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Só',
        category: findCategoryByName('Élelmiszerek')._id,
        defaultUnit: 'kg',
        createdBy: admin._id,
        barcode: '5900000000020',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Cukor',
        category: findCategoryByName('Élelmiszerek')._id,
        defaultUnit: 'kg',
        createdBy: admin._id,
        barcode: '5900000000021',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Liszt',
        category: findCategoryByName('Élelmiszerek')._id,
        defaultUnit: 'kg',
        createdBy: admin._id,
        barcode: '5900000000022',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Keksz',
        category: findCategoryByName('Élelmiszerek')._id,
        defaultUnit: 'csomag',
        createdBy: admin._id,
        barcode: '5900000000023',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Csokoládé',
        category: findCategoryByName('Élelmiszerek')._id,
        defaultUnit: 'db',
        createdBy: admin._id,
        barcode: '5900000000024',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Csokiskeksz',
        category: findCategoryByName('Élelmiszerek')._id,
        defaultUnit: 'csomag',
        createdBy: admin._id,
        barcode: '5900000000025',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Kávé',
        category: findCategoryByName('Élelmiszerek')._id,
        defaultUnit: 'kg',
        createdBy: admin._id,
        barcode: '5900000000026',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Tea',
        category: findCategoryByName('Élelmiszerek')._id,
        defaultUnit: 'csomag',
        createdBy: admin._id,
        barcode: '5900000000027',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Gyümölcslé',
        category: findCategoryByName('Élelmiszerek')._id,
        defaultUnit: 'liter',
        createdBy: admin._id,
        barcode: '5900000000028',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Ásványvíz',
        category: findCategoryByName('Élelmiszerek')._id,
        defaultUnit: 'liter',
        createdBy: admin._id,
        barcode: '5900000000029',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Sör',
        category: findCategoryByName('Élelmiszerek')._id,
        defaultUnit: 'liter',
        createdBy: admin._id,
        barcode: '5900000000030',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Bor',
        category: findCategoryByName('Élelmiszerek')._id,
        defaultUnit: 'liter',
        createdBy: admin._id,
        barcode: '5900000000031',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Pezsgő',
        category: findCategoryByName('Élelmiszerek')._id,
        defaultUnit: 'liter',
        createdBy: admin._id,
        barcode: '5900000000032',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Vodka',
        category: findCategoryByName('Élelmiszerek')._id,
        defaultUnit: 'liter',
        createdBy: admin._id,
        barcode: '5900000000033',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Whisky',
        category: findCategoryByName('Élelmiszerek')._id,
        defaultUnit: 'liter',
        createdBy: admin._id,
        barcode: '5900000000034',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Rum',
        category: findCategoryByName('Élelmiszerek')._id,
        defaultUnit: 'liter',
        createdBy: admin._id,
        barcode: '5900000000035',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Gin',
        category: findCategoryByName('Élelmiszerek')._id,
        defaultUnit: 'liter',
        createdBy: admin._id,
        barcode: '5900000000036',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Törlőkendő',
        category: findCategoryByName('Háztartási cikkek')._id,
        defaultUnit: 'csomag',
        createdBy: admin._id,
        barcode: '5900000000037',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Mosogatószer',
        category: findCategoryByName('Háztartási cikkek')._id,
        defaultUnit: 'liter',
        createdBy: admin._id,
        barcode: '5900000000038',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Mosópor',
        category: findCategoryByName('Háztartási cikkek')._id,
        defaultUnit: 'kg',
        createdBy: admin._id,
        barcode: '5900000000039',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Öblítő',
        category: findCategoryByName('Háztartási cikkek')._id,
        defaultUnit: 'liter',
        createdBy: admin._id,
        barcode: '5900000000040',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Szappan',
        category: findCategoryByName('Háztartási cikkek')._id,
        defaultUnit: 'db',
        createdBy: admin._id,
        barcode: '5900000000041',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Sampon',
        category: findCategoryByName('Háztartási cikkek')._id,
        defaultUnit: 'liter',
        createdBy: admin._id,
        barcode: '5900000000042',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Tusfürdő',
        category: findCategoryByName('Háztartási cikkek')._id,
        defaultUnit: 'liter',
        createdBy: admin._id,
        barcode: '5900000000043',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      },
      {
        name: 'Fogkrém',
        category: findCategoryByName('Háztartási cikkek')._id,
        defaultUnit: 'db',
        createdBy: admin._id,
        barcode: '5900000000044',
        usageCount: Math.floor(Math.random() * 100),
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
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