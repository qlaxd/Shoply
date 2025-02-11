const mongoose = require('../../Backend/node_modules/mongoose');
const bcrypt = require('../../Backend/node_modules/bcryptjs');
const User = require('../../Backend/models/User');

async function seedUsers() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017'); // ide a mongdb connection string-kell

    const users = [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: await bcrypt.hash('AdminJelszo123', 10),
        role: 'admin'
      },
      {
        username: 'user1',
        email: 'user1@example.com',
        password: await bcrypt.hash('UserJelszo123', 10),
        role: 'user'
      },
      {
        username: 'user2',
        email: 'user2@example.com',
        password: await bcrypt.hash('UserJelszo456', 10),
        role: 'user'
      },
      {
        username: 'user3',
        email: 'user3@example.com',
        password: await bcrypt.hash('UserJelszo789', 10),
        role: 'user'
      },
      {
        username: 'user4',
        email: 'user4@example.com',
        password: await bcrypt.hash('UserJelszo1011', 10),
        role: 'user'
      },
      {
        username: 'user5',
        email: 'user5@example.com',
        password: await bcrypt.hash('UserJelszo1213', 10),
        role: 'user'
      },
      {
        username: 'user6',
        email: 'user6@example.com',
        password: await bcrypt.hash('UserJelszo1415', 10),
        role: 'user'
      },
      {
        username: 'user7',
        email: 'user7@example.com',
        password: await bcrypt.hash('UserJelszo1617', 10),
        role: 'user'
      },
      {
        username: 'user8',
        email: 'user8@example.com',
        password: await bcrypt.hash('UserJelszo1819', 10),
        role: 'user'
      },
      {
        username: 'user9',
        email: 'user9@example.com',
        password: await bcrypt.hash('UserJelszo2021', 10),
        role: 'user'
      },
      {
        username: 'user10',
        email: 'user10@example.com',
        password: await bcrypt.hash('UserJelszo2223', 10),
        role: 'user'
      },
      {
        username: 'teszt_admin',
        email: 'teszt_admin@example.com',
        password: await bcrypt.hash('AdminJelszo456', 10),
        role: 'admin'
      }
      
    ];

    for (const user of users) {
      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        await User.create(user);
        console.log(`Felhasználó létrehozva: ${user.email}`);
      } else {
        console.log(`Felhasználó már létezik: ${user.email}`);
      }
    }

    await mongoose.disconnect();
    console.log('Seedelés sikeresen befejeződött!');
  } catch (error) {
    console.error('Hiba a seedelés során:', error);
    process.exit(1);
  }
}

seedUsers();