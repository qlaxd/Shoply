### Adatbázis Seedelés

Alap felhasználók létrehozása a fejlesztési környezetben:

1. Seed Script Futtatási Sorrend:
```bash
node seed/users/seedUsers.js
node seed/categories/seedCategories.js
node seed/productCatalogs/seedProductCatalogs.js
node seed/lists/seedLists.js
node seed/products/seedProducts.js
```

2. Ellenőrizd a MongoDB-ben, hogy a felhasználók létre lettek-e hozva.

- Létrehozza az alap admin és teszt user fiókokat
- Alap jelszavak: AdminJelszo123, UserJelszo123, UserJelszo456
- Figyelmeztetés: Ez csak development környezetben használjuk