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
  const numProducts = Math.floor(Math.random() * 5) + 3; // 3-7 közötti termék
  
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
    
    const catalogItems = await ProductCatalog.find().limit(15); // Több terméket használunk
    const products = [];
    
    // 3-6 termék hozzáadása
    const numProducts = Math.floor(Math.random() * 4) + 5; // 5-8 termék
    for (let i = 0; i < numProducts; i++) {
      const randomCatalogItem = catalogItems[Math.floor(Math.random() * catalogItems.length)];
      
      products.push({
        catalogItem: randomCatalogItem._id,
        name: randomCatalogItem.name, // Név hozzáadása (az új modell alapján)
        quantity: Math.floor(Math.random() * 5) + 1,
        unit: randomCatalogItem.defaultUnit,
        isPurchased: Math.random() < 0.3,
        addedBy: Math.random() > 0.5 ? user1._id : user2._id, // Véletlenszerűen az 1. vagy 2. felhasználó adta hozzá
        notes: Math.random() > 0.7 ? 'Ezt mindenképp vegyünk!' : '' // 30% eséllyel megjegyzés
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
    
    // Új megosztott lista - Heti nagybevásárlás
    if (users.length >= 4) {
      const user4 = users[3];
      const weeklyProducts = [];
      
      // 7-10 termék a heti bevásárláshoz
      const weeklyNumProducts = Math.floor(Math.random() * 4) + 7;
      for (let i = 0; i < weeklyNumProducts; i++) {
        const randomCatalogItem = catalogItems[Math.floor(Math.random() * catalogItems.length)];
        
        weeklyProducts.push({
          catalogItem: randomCatalogItem._id,
          name: randomCatalogItem.name,
          quantity: Math.floor(Math.random() * 3) + 2, // 2-4 közötti mennyiség
          unit: randomCatalogItem.defaultUnit,
          isPurchased: Math.random() < 0.2, // 20% esély, hogy már megvették
          addedBy: [user1._id, user2._id, user3._id, user4._id][Math.floor(Math.random() * 4)], // Véletlenszerű felhasználó adta hozzá
          notes: Math.random() > 0.8 ? 'Akciós, mindenképp vegyünk!' : '' // 20% eséllyel megjegyzés
        });
      }
      
      const weeklySharedList = new List({
        title: 'Heti nagybevásárlás',
        owner: user2._id, // A 2. felhasználó a tulajdonos
        sharedUsers: [
          { user: user1._id, permissionLevel: 'edit' },
          { user: user3._id, permissionLevel: 'edit' },
          { user: user4._id, permissionLevel: 'view' }
        ],
        products: weeklyProducts,
        status: 'active',
        priority: 2, // Magasabb prioritás
        version: 1,
        lastModified: new Date(),
        deleted: false
      });
      
      const existingWeeklyList = await List.findOne({ 
        title: 'Heti nagybevásárlás', 
        owner: user2._id
      });
      
      if (!existingWeeklyList) {
        await weeklySharedList.save();
        console.log('Heti nagybevásárlás lista létrehozva');
      } else {
        console.log('Heti nagybevásárlás lista már létezik');
      }
    }
    
    // Új megosztott lista - Nyaralásra való lista
    if (users.length >= 5) {
      const user5 = users[4];
      const vacationProducts = [];
      
      // 6-9 termék a nyaraláshoz
      const vacationNumProducts = Math.floor(Math.random() * 4) + 6;
      for (let i = 0; i < vacationNumProducts; i++) {
        const randomCatalogItem = catalogItems[Math.floor(Math.random() * catalogItems.length)];
        
        vacationProducts.push({
          catalogItem: randomCatalogItem._id,
          name: randomCatalogItem.name,
          quantity: Math.floor(Math.random() * 2) + 1, // 1-2 közötti mennyiség
          unit: randomCatalogItem.defaultUnit,
          isPurchased: Math.random() < 0.1, // 10% esély, hogy már megvették
          addedBy: [user3._id, user5._id][Math.floor(Math.random() * 2)], // 3. vagy 5. felhasználó adta hozzá
          notes: Math.random() > 0.6 ? 'A nyaraláshoz feltétlenül szükséges!' : '' // 40% eséllyel megjegyzés
        });
      }
      
      const vacationSharedList = new List({
        title: 'Nyaralásra beszerzendő',
        owner: user3._id, // A 3. felhasználó a tulajdonos
        sharedUsers: [
          { user: user5._id, permissionLevel: 'edit' },
          { user: user1._id, permissionLevel: 'view' }
        ],
        products: vacationProducts,
        status: 'active',
        priority: 1,
        version: 1,
        lastModified: new Date(),
        deleted: false
      });
      
      const existingVacationList = await List.findOne({ 
        title: 'Nyaralásra beszerzendő', 
        owner: user3._id
      });
      
      if (!existingVacationList) {
        await vacationSharedList.save();
        console.log('Nyaralásra beszerzendő lista létrehozva');
      } else {
        console.log('Nyaralásra beszerzendő lista már létezik');
      }
    }
  }
}

seedLists(); 