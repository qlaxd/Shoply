const mongoose = require('../../../Backend/node_modules/mongoose');
const Category = require('../../../Backend/models/Category');

async function seedCategories() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017');

    // Fő kategóriák
    const mainCategories = [
      {
        name: 'Élelmiszerek',
        description: 'Minden típusú élelmiszer',
        level: 0,
        isActive: true
      },
      {
        name: 'Háztartási cikkek',
        description: 'Tisztítószerek, eszközök, stb.',
        level: 0,
        isActive: true
      },
      {
        name: 'Elektronika',
        description: 'Elektronikai eszközök és tartozékok',
        level: 0,
        isActive: true
      },
      {
        name: 'Ruházat',
        description: 'Ruházati termékek',
        level: 0,
        isActive: true
      },
      {
        name: 'Egészség és szépség',
        description: 'Egészséggel és szépséggel kapcsolatos termékek',
        level: 0,
        isActive: true
      },
      {
        name: 'Egyéb',
        description: 'Egyéb kategória',
        level: 0,
        isActive: true
      }
    ];

    // Fő kategóriák létrehozása
    const createdMainCategories = {};
    for (const category of mainCategories) {
      const existingCategory = await Category.findOne({ name: category.name });
      if (!existingCategory) {
        const newCategory = await Category.create(category);
        createdMainCategories[category.name] = newCategory._id;
        console.log(`Fő kategória létrehozva: ${category.name}`);
      } else {
        createdMainCategories[category.name] = existingCategory._id;
        console.log(`Fő kategória már létezik: ${category.name}`);
      }
    }

    // Alkategóriák
    const subCategories = [
      // Élelmiszer alkategóriák
      {
        name: 'Pékáruk',
        description: 'Kenyerek, péksütemények',
        parentCategory: createdMainCategories['Élelmiszerek'],
        level: 1,
        isActive: true
      },
      {
        name: 'Tejtermékek',
        description: 'Tej, sajt, joghurt, stb.',
        parentCategory: createdMainCategories['Élelmiszerek'],
        level: 1,
        isActive: true
      },
      {
        name: 'Húsáruk',
        description: 'Friss és feldolgozott húsok',
        parentCategory: createdMainCategories['Élelmiszerek'],
        level: 1,
        isActive: true
      },
      {
        name: 'Zöldségek és gyümölcsök',
        description: 'Friss zöldségek és gyümölcsök',
        parentCategory: createdMainCategories['Élelmiszerek'],
        level: 1,
        isActive: true
      },
      // Háztartási cikkek alkategóriák
      {
        name: 'Tisztítószerek',
        description: 'Mosószerek, tisztítószerek',
        parentCategory: createdMainCategories['Háztartási cikkek'],
        level: 1,
        isActive: true
      },
      {
        name: 'Konyhai eszközök',
        description: 'Edények, evőeszközök',
        parentCategory: createdMainCategories['Háztartási cikkek'],
        level: 1,
        isActive: true
      },
      {
        name: 'Fürdőszobai kellékek',
        description: 'Fürdőszobai tartozékok',
        parentCategory: createdMainCategories['Háztartási cikkek'],
        level: 1,
        isActive: true
      },
      // Elektronika alkategóriák
      {
        name: 'Számítástechnika',
        description: 'Számítógépek és tartozékok',
        parentCategory: createdMainCategories['Elektronika'],
        level: 1,
        isActive: true
      },
      {
        name: 'Mobil eszközök',
        description: 'Telefonok, tabletek és tartozékaik',
        parentCategory: createdMainCategories['Elektronika'],
        level: 1,
        isActive: true
      },
      {
        name: 'Háztartási elektronika',
        description: 'Háztartási elektronikai eszközök',
        parentCategory: createdMainCategories['Elektronika'],
        level: 1,
        isActive: true
      }
    ];

    // Alkategóriák létrehozása
    const createdSubCategories = {};
    for (const category of subCategories) {
      const existingCategory = await Category.findOne({ name: category.name });
      if (!existingCategory) {
        const newCategory = await Category.create(category);
        createdSubCategories[category.name] = newCategory._id;
        console.log(`Alkategória létrehozva: ${category.name}`);
      } else {
        createdSubCategories[category.name] = existingCategory._id;
        console.log(`Alkategória már létezik: ${category.name}`);
      }
    }

    // Harmadik szintű kategóriák (példa a Számítástechnikához)
    const thirdLevelCategories = [
      {
        name: 'Laptopok',
        description: 'Hordozható számítógépek',
        parentCategory: createdSubCategories['Számítástechnika'],
        level: 2,
        isActive: true
      },
      {
        name: 'Asztali számítógépek',
        description: 'Asztali PC-k és tartozékok',
        parentCategory: createdSubCategories['Számítástechnika'],
        level: 2,
        isActive: true
      },
      {
        name: 'Perifériák',
        description: 'Billentyűzetek, egerek, monitorok',
        parentCategory: createdSubCategories['Számítástechnika'],
        level: 2,
        isActive: true
      }
    ];

    // Harmadik szintű kategóriák létrehozása
    for (const category of thirdLevelCategories) {
      const existingCategory = await Category.findOne({ name: category.name });
      if (!existingCategory) {
        await Category.create(category);
        console.log(`Harmadik szintű kategória létrehozva: ${category.name}`);
      } else {
        console.log(`Harmadik szintű kategória már létezik: ${category.name}`);
      }
    }

    await mongoose.disconnect();
    console.log('Kategóriák seedelése sikeresen befejeződött!');
  } catch (error) {
    console.error('Hiba a kategóriák seedelése során:', error);
    process.exit(1);
  }
}

seedCategories(); 