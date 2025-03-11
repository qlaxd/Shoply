const mongoose = require('../../../Backend/node_modules/mongoose');
const List = require('../../../Backend/models/List');
const User = require('../../../Backend/models/User');
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

    // Minden felhasználóhoz létrehozunk egy aktív és egy befejezett listát
    for (const user of users) {
      // Aktív lista
      await createListForUser(user, catalogItems, 'active');
      
      // Befejezett lista
      if (Math.random() > 0.5) { // 50% eséllyel
        await createListForUser(user, catalogItems, 'completed');
      }
      
      // Archivált lista
      if (Math.random() > 0.7) { // 30% eséllyel
        await createListForUser(user, catalogItems, 'archived');
      }
    }

    // Megosztott listák létrehozása
    await createSharedLists(users);

    await mongoose.disconnect();
    console.log('Listák seedelése sikeresen befejeződött!');
  } catch (error) {
    console.error('Hiba a listák seedelése során:', error);
    process.exit(1);
  }
}

async function createListForUser(user, catalogItems, status) {
  // Véletlenszerűen kiválasztunk 2-5 terméket a katalógusból
  const products = [];
  const numProducts = Math.floor(Math.random() * 4) + 2; // 2-5 közötti szám
  
  for (let i = 0; i < numProducts; i++) {
    const randomCatalogItem = catalogItems[Math.floor(Math.random() * catalogItems.length)];
    
    // Termék hozzáadása a listához
    products.push({
      catalogItem: randomCatalogItem._id,
      name: randomCatalogItem.name, // Név hozzáadása (az új modell alapján)
      quantity: Math.floor(Math.random() * 5) + 1, // 1-5 közötti mennyiség
      unit: randomCatalogItem.defaultUnit,
      isPurchased: status !== 'active' ? true : Math.random() < 0.3, // aktív listán 30% esély, befejezett/archivált listán 100%
      addedBy: user._id,
      notes: Math.random() > 0.7 ? 'Megjegyzés a termékhez' : '' // 30% eséllyel megjegyzés
    });
  }

  // Lista státusz alapján név generálása
  let listTitle;
  if (status === 'active') {
    listTitle = `${user.username} aktuális bevásárlólistája`;
  } else if (status === 'completed') {
    listTitle = `${user.username} befejezett bevásárlólistája`;
  } else {
    listTitle = `${user.username} archivált bevásárlólistája`;
  }

  const existingList = await List.findOne({ title: listTitle, owner: user._id });
  
  if (!existingList) {
    const newList = new List({
      title: listTitle,
      owner: user._id,
      products: products,
      status: status,
      priority: Math.floor(Math.random() * 3), // 0-2 prioritás
      version: 1,
      lastModified: new Date(),
      deleted: false
    });
    
    await newList.save();
    console.log(`Lista létrehozva: ${listTitle}`);
  } else {
    console.log(`Lista már létezik: ${listTitle}`);
  }
}

async function createSharedLists(users) {
  // Csak ha van legalább 3 felhasználó
  if (users.length >= 3) {
    // Készítünk egy megosztott listát az 1. és 2. felhasználó között
    const user1 = users[0];
    const user2 = users[1];
    const user3 = users[2];
    
    const catalogItems = await ProductCatalog.find().limit(10);
    const products = [];
    
    // 3-6 termék hozzáadása
    const numProducts = Math.floor(Math.random() * 4) + 3;
    for (let i = 0; i < numProducts; i++) {
      const randomCatalogItem = catalogItems[Math.floor(Math.random() * catalogItems.length)];
      
      products.push({
        catalogItem: randomCatalogItem._id,
        name: randomCatalogItem.name, // Név hozzáadása (az új modell alapján)
        quantity: Math.floor(Math.random() * 5) + 1,
        unit: randomCatalogItem.defaultUnit,
        isPurchased: Math.random() < 0.3,
        addedBy: Math.random() > 0.5 ? user1._id : user2._id, // Véletlenszerűen az 1. vagy 2. felhasználó adta hozzá
        notes: ''
      });
    }
    
    const sharedList = new List({
      title: 'Közös bevásárlólista',
      owner: user1._id, // Az 1. felhasználó a tulajdonos
      sharedUsers: [
        { user: user2._id, permissionLevel: 'edit' }, // A 2. felhasználó szerkesztheti
        { user: user3._id, permissionLevel: 'view' }  // A 3. felhasználó csak láthatja
      ],
      products: products,
      status: 'active',
      priority: 1,
      version: 1,
      lastModified: new Date(),
      deleted: false
    });
    
    const existingList = await List.findOne({ 
      title: 'Közös bevásárlólista', 
      owner: user1._id,
      'sharedUsers.user': user2._id
    });
    
    if (!existingList) {
      await sharedList.save();
      console.log('Megosztott lista létrehozva');
    } else {
      console.log('Megosztott lista már létezik');
    }
  }
}

seedLists(); 