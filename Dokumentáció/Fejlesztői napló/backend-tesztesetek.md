# Vásárlólista Alkalmazás - Tesztesetek Dokumentációja

Ez a dokumentum részletesen ismerteti a Vásárlólista alkalmazás backend tesztelési rendszerét és az egyes teszteseteket.

## Tesztrendszer Áttekintése

A backend tesztrendszer három fő szinten működik:

1. **Unit tesztek (60%)**: Izolált komponensek, funkciók tesztelése
2. **Integrációs tesztek (30%)**: Komponensek közötti interakciók tesztelése
3. **End-to-End tesztek (10%)**: Teljes folyamatok tesztelése

A tesztek használt technológiák:
- Jest (teszt keretrendszer)
- MongoDB Memory Server (adatbázis tesztelés)
- Supertest (HTTP kérések tesztelése)
- Faker.js (teszt adatok generálása)

## Könyvtárstruktúra

```
__tests__/
  ├── unit/                   # Unit tesztek
  │   ├── controllers/        # Controller réteg tesztek
  │   ├── middleware/         # Middleware funkciók tesztek
  │   ├── models/             # Adatbázis modellek tesztek
  │   ├── services/           # Szolgáltatások tesztek
  │   └── utils/              # Segédfunkciók tesztek
  ├── integration/            # Integrációs tesztek
  │   ├── routes/             # API útvonalak tesztek
  │   ├── middleware/         # Middleware láncok tesztek
  │   └── database/           # Adatbázis interakciók tesztek
  ├── e2e/                    # End-to-End tesztek
  │   └── flows/              # Felhasználói folyamatok tesztek
  ├── helpers/                # Teszt segédfunkciók
  ├── fixtures/               # Teszt adatok
  └── setup/                  # Teszt környezet beállítása
```

## Unit Tesztek

### Model Tesztek

#### User Model (`unit/models/user.model.test.js`)

Tesztesetek:
- Érvényes felhasználó validálása minden kötelező mezővel
- Validálás hibája hiányzó kötelező mezők esetén
- Email formátum validálása
- Felhasználónév egyediségének ellenőrzése
- Email cím egyediségének ellenőrzése
- Alapértelmezett értékek helyes beállításának ellenőrzése

#### List Model (`unit/models/list.model.test.js`)

Tesztesetek:
- Lista létrehozásának validálása kötelező mezőkkel
- Validálás hibája hiányzó kötelező mezők esetén
- Lista elemek helyes kezelésének ellenőrzése
- Címkék (tags) helyes kezelésének ellenőrzése
- Lista státusz értékek validálása
- Megosztási beállítások ellenőrzése

#### Product Catalog Model (`unit/models/productCatalog.model.test.js`)

Tesztesetek:
- Termék katalógus elem létrehozásának validálása
- Ár és mennyiség adatok validálása
- Kategória hivatkozások ellenőrzése
- Termék keresési tulajdonságok tesztelése
- Időbélyegek helyes kezelése

#### Category Model (`unit/models/category.model.test.js`)

Tesztesetek:
- Kategória létrehozásának validálása
- Kategória név egyediségének ellenőrzése
- Alkategóriák helyes kezelésének ellenőrzése
- Szülő-gyermek kategória kapcsolatok validálása

#### Statistics Model (`unit/models/statistics.model.test.js`)

Tesztesetek:
- Statisztikai adatok helyes tárolásának ellenőrzése
- Felhasználói statisztikák összesítésének validálása
- Időalapú statisztikai lekérdezések tesztelése
- Adatok aggregálásának ellenőrzése

### Controller Tesztek

#### Auth Controller (`unit/controllers/authController.test.js`)

Tesztesetek:
- Felhasználó regisztráció sikeres végrehajtása
- Bejelentkezés helyes kezelése
- Hibás belépési adatok kezelése
- JWT token generálás és validálás
- Jelszó helyreállítási folyamat tesztelése

#### User Controller (`unit/controllers/userController.test.js`)

Tesztesetek:
- Felhasználói profil adatok lekérése
- Profil adatok módosításának tesztelése
- Jelszó módosítás folyamatának ellenőrzése
- Felhasználói adatok törlésének tesztelése
- Felhasználók keresése és listázása

#### Admin Controller (`unit/controllers/adminController.test.js`)

Tesztesetek:
- Adminisztrátori jogosultságok ellenőrzése
- Felhasználók kezelése adminisztrátori jogosultsággal
- Rendszerszintű beállítások kezelése
- Biztonsági műveletek tesztelése

#### List Controller (`unit/controllers/listController.test.js`)

Tesztesetek:
- Bevásárlólista létrehozás sikeres tesztelése
- Listák lekérdezésének ellenőrzése
- Lista módosítási műveletek validálása
- Lista megosztási funkciók tesztelése
- Listák rendezésének és szűrésének ellenőrzése
- Lista elemek kezelésének tesztelése
- Lista archiválás és törlés műveletek

#### Product Catalog Controller (`unit/controllers/productCatalogController.test.js`)

Tesztesetek:
- Termékek hozzáadása a katalógushoz
- Termékek lekérdezése és keresése
- Termék adatok módosítása
- Termékek kategorizálásának ellenőrzése
- Árazási adatok kezelése

#### Category Controller (`unit/controllers/categoryController.test.js`)

Tesztesetek:
- Kategóriák létrehozásának tesztelése
- Kategória hierarchia kezelésének ellenőrzése
- Kategóriák módosításának tesztelése
- Kategóriákhoz tartozó termékek lekérdezése
- Kategória törlési műveletek validálása

#### Statistics Controller (`unit/controllers/statisticsController.test.js`)

Tesztesetek:
- Felhasználói statisztikák lekérdezése
- Trendek elemzési funkcióinak tesztelése
- Időintervallum alapú statisztikai lekérdezések
- Statisztikai adatok exportálása
- Összehasonlító elemzések tesztelése

## Integrációs Tesztek

### Route Tesztek

#### Auth Routes (`integration/routes/authRoutes.test.js`)

Tesztesetek:
- Regisztráció sikeres tesztelése (POST /api/auth/register)
- Már létező email cím kezelése regisztrációnál
- Már létező felhasználónév kezelése
- Hiányzó mezők kezelése regisztrációnál
- Bejelentkezés helyes azonosítókkal (POST /api/auth/login)
- Bejelentkezés helytelen email címmel
- Bejelentkezés helytelen jelszóval
- Hiányzó mezők kezelése bejelentkezésnél

#### Admin Routes (`integration/routes/adminRoutes.test.js`)

Tesztesetek:
- Admin vezérlőpult hozzáférés ellenőrzése
- Nem admin felhasználó hozzáférés korlátozása
- Felhasználók listázása admin jogosultsággal
- Felhasználói jogosultságok módosítása
- Rendszeradatok lekérdezése
- Tömeges műveletek végrehajtása

## End-to-End Tesztek

A rendszer tartalmaz E2E tesztek végrehajtására előkészített struktúrát, amely a felhasználói folyamatok teljes tesztelését teszi lehetővé.

## Tesztelési Állapot

A tesztelési stratégia implementációs ellenőrző listája alapján:

- ✅ Jest teszt futtatási környezet konfigurálva
- ✅ Teszt környezeti konfiguráció elkészült
- ✅ MongoDB Memory Server implementálva tesztekhez
- ✅ Adatbázis kapcsolat factory létrehozva
- ✅ Teszt segédfunkciók implementálva
- ✅ Könyvtárstruktúra kialakítva
- ✅ Tesztadatok generálására szolgáló segédfunkciók elkészültek
- ✅ Adatbázis inicializáló és tisztító funkciók implementálva
- ✅ Unit tesztek implementálva a fő komponensekhez
- ✅ API végpontok integrációs tesztjei elkészültek
- ✅ E2E tesztek struktúrája előkészítve
- ✅ Biztonsági tesztek részben implementálva
- ⬜ Teljesítmény tesztek előkészítése folyamatban

## Tesztek Futtatása

A tesztek futtatásához a következő parancsok használhatók:

```bash
# Összes teszt futtatása
npm test

# Csak unit tesztek futtatása
npm run test:unit

# Csak integrációs tesztek futtatása
npm run test:integration

# Csak E2E tesztek futtatása
npm run test:e2e

# Tesztek futtatása lefedettség jelentéssel
npm run test:coverage
```
