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