const mongoose = require('../../../Backend/node_modules/mongoose');
const AuditLog = require('../../../Backend/models/AuditLog');
const User = require('../../../Backend/models/User');
const List = require('../../../Backend/models/List');
const ProductCatalog = require('../../../Backend/models/ProductCatalog');

async function seedAuditLogs() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017');

    // Felhasználók keresése
    const users = await User.find();
    if (users.length === 0) {
      throw new Error('Nincsenek felhasználók! Először futtasd a users/seedUsers.js scriptet!');
    }

    // Listák keresése
    const lists = await List.find();
    if (lists.length === 0) {
      throw new Error('Nincsenek listák! Először futtasd a lists/seedLists.js scriptet!');
    }

    // Termék katalógus elemek keresése
    const products = await ProductCatalog.find();
    if (products.length === 0) {
      throw new Error('Nincsenek termék katalógus elemek! Először futtasd a productCatalogs/seedProductCatalogs.js scriptet!');
    }

    // Audit log bejegyzések létrehozása
    const auditLogs = [];

    // Felhasználói műveletek
    for (const user of users) {
      // Bejelentkezés
      auditLogs.push({
        user: user._id,
        actionType: 'LOGIN',
        targetType: 'user',
        targetId: user._id,
        details: { success: true },
        ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      });

      // Kijelentkezés
      auditLogs.push({
        user: user._id,
        actionType: 'LOGOUT',
        targetType: 'user',
        targetId: user._id,
        details: { success: true },
        ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      });
    }

    // Lista műveletek
    for (const list of lists) {
      // Lista létrehozása
      auditLogs.push({
        user: list.owner,
        actionType: 'CREATE',
        targetType: 'list',
        targetId: list._id,
        details: { listTitle: list.title },
        ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      });

      // Lista frissítése (ha nem aktív)
      if (list.status !== 'active') {
        auditLogs.push({
          user: list.owner,
          actionType: 'UPDATE',
          targetType: 'list',
          targetId: list._id,
          details: { 
            listTitle: list.title,
            changes: { status: list.status }
          },
          ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
        });
      }

      // Lista megosztása (ha van megosztott felhasználó)
      if (list.sharedUsers && list.sharedUsers.length > 0) {
        for (const sharedUser of list.sharedUsers) {
          auditLogs.push({
            user: list.owner,
            actionType: 'SHARE',
            targetType: 'list',
            targetId: list._id,
            details: { 
              listTitle: list.title,
              sharedWith: sharedUser.user,
              permissionLevel: sharedUser.permissionLevel
            },
            ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            timestamp: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
          });
        }
      }
    }

    // Termék műveletek
    for (let i = 0; i < 20; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      
      auditLogs.push({
        user: randomUser._id,
        actionType: 'CREATE',
        targetType: 'product',
        targetId: randomProduct._id,
        details: { 
          productName: randomProduct.name,
          category: randomProduct.category
        },
        ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      });
    }

    // Audit log bejegyzések mentése
    for (const log of auditLogs) {
      await AuditLog.create(log);
      console.log(`Audit log bejegyzés létrehozva: ${log.actionType} - ${log.targetType}`);
    }

    await mongoose.disconnect();
    console.log('Audit log bejegyzések seedelése sikeresen befejeződött!');
  } catch (error) {
    console.error('Hiba az audit log bejegyzések seedelése során:', error);
    process.exit(1);
  }
}

seedAuditLogs(); 