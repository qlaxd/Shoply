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
        level: 0
      },
      {
        name: 'Háztartási cikkek',
        description: 'Tisztítószerek, eszközök, stb.',
        level: 0
      },
      {
        name: 'Elektronika',
        description: 'Elektronikai eszközök és tartozékok',
        level: 0
      },
      {
        name: 'Egyéb',
        description: 'Egyéb kategória',
        level: 0
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
      {
        name: 'Pékáruk',
        description: 'Kenyerek, péksütemények',
        parentCategory: createdMainCategories['Élelmiszerek'],
        level: 1
      },
      {
        name: 'Tejtermékek',
        description: 'Tej, sajt, joghurt, stb.',
        parentCategory: createdMainCategories['Élelmiszerek'],
        level: 1
      },
      {
        name: 'Tisztítószerek',
        description: 'Mosószerek, tisztítószerek',
        parentCategory: createdMainCategories['Háztartási cikkek'],
        level: 1
      },
      {
        name: 'Konyhai eszközök',
        description: 'Edények, evőeszközök',
        parentCategory: createdMainCategories['Háztartási cikkek'],
        level: 1
      },
      {
        name: 'Számítástechnika',
        description: 'Számítógépek és tartozékok',
        parentCategory: createdMainCategories['Elektronika'],
        level: 1
      }
    ];

    // Alkategóriák létrehozása
    for (const category of subCategories) {
      const existingCategory = await Category.findOne({ name: category.name });
      if (!existingCategory) {
        await Category.create(category);
        console.log(`Alkategória létrehozva: ${category.name}`);
      } else {
        console.log(`Alkategória már létezik: ${category.name}`);
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