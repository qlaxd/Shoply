# Frontend tesztesetek dokumentációja

## Tesztelési áttekintés

A Bevásárlólista webalkalmazás frontend része strukturált és átfogó tesztelési megközelítést alkalmaz. A tesztelés a következő típusokat foglalja magába:

- **Unit tesztek**: Komponensek és szolgáltatások izolált tesztelése
- **API tesztek**: API integrációs tesztek a backend kommunikációhoz
- **Integrációs tesztek**: Több komponens és szolgáltatás együttes működésének tesztelése
- **E2E tesztek**: Teljes felhasználói folyamatok end-to-end tesztelése

## Unit tesztek

A unit tesztek a `src/__tests__/unit/` könyvtárban találhatók, és a kód legkisebb, izolált egységeinek tesztelésére szolgálnak, beleértve a szolgáltatásokat és UI komponenseket.

### Szolgáltatás (Service) tesztek

#### auth.service.test.js

A felhasználói hitelesítéssel kapcsolatos funkcionalitás tesztelése:

- **validatePassword**: Jelszó validáció (hossz, nagybetű, kisbetű, szám)
- **validateEmail**: Email formátum validáció
- **validateUsername**: Felhasználónév validáció (hossz, érvényes karakterek)
- **login**: Bejelentkezési folyamat, token tárolás
- **register**: Regisztrációs folyamat
- **logout**: Kijelentkezés, felhasználói adatok törlése
- **getCurrentUser**: Aktuális felhasználó adatainak lekérdezése

#### list.service.test.js

A bevásárlólistákkal kapcsolatos műveletek tesztelése:

- **getUserLists**: Felhasználó listáinak lekérdezése
- **getListById**: Adott lista lekérdezése azonosító alapján
- **createList**: Új lista létrehozása
- **updateList**: Lista frissítése
- **deleteList**: Lista törlése
- **shareList**: Lista megosztása más felhasználókkal
- **unshareList**: Lista megosztásának visszavonása
- **Termékműveletek**:
  - **addProductToList**: Termék hozzáadása listához
  - **updateProductInList**: Termék frissítése listában
  - **deleteProductFromList**: Termék törlése listából
  - **purchaseProduct**: Termék megvásárlásának jelölése

#### category.service.test.js

A kategóriákkal kapcsolatos műveletek tesztelése:

- **getCategories**: Kategóriák lekérdezése
- **createCategory**: Új kategória létrehozása
- **updateCategory**: Kategória frissítése
- **deleteCategory**: Kategória törlése

#### productCatalog.service.test.js

A termék-katalógussal kapcsolatos műveletek tesztelése:

- **searchProducts**: Termékek keresése
- **getRecentProducts**: Legutóbb használt termékek lekérdezése
- **getSuggestedProducts**: Javasolt termékek lekérdezése

#### statistics.service.test.js

A statisztikákkal kapcsolatos műveletek tesztelése:

- **getUserStatistics**: Felhasználói statisztikák lekérdezése
- **getListStatistics**: Lista statisztikák lekérdezése

#### user.service.test.js

A felhasználói profillal kapcsolatos műveletek tesztelése:

- **getUserProfile**: Felhasználói profil lekérdezése
- **updateUserProfile**: Felhasználói profil frissítése
- **changePassword**: Jelszó módosítása
- **deleteAccount**: Felhasználói fiók törlése

### UI Komponens tesztek

#### Modal.test.jsx

A modális ablak komponens tesztelése:

- Megfelelő megjelenítés nyitott/zárt állapotban
- Cím és leírás megjelenítése
- Gyermek komponensek megjelenítése
- Bezárás gomb működése
- Háttérre kattintás kezelése
- Egyéni akciógombok megjelenítése

#### Button.test.jsx

A gomb komponens tesztelése:

- Különböző típusú gombok megjelenítése (elsődleges, másodlagos)
- Állapotok tesztelése (betöltés, letiltva)
- Click esemény megfelelő kezelése
- Ikon megjelenítése

#### Card.test.jsx

A kártya komponens tesztelése:

- Tartalom megfelelő megjelenítése
- Különböző variánsok tesztelése
- Interaktív elemek működése

#### Input.test.jsx

A beviteli mező komponens tesztelése:

- Érték módosítás követése
- Validációs üzenetek megjelenítése
- Különböző típusok tesztelése (szöveg, szám, jelszó)
- Hiba állapotok kezelése

#### Loader.test.jsx

A betöltő komponens tesztelése:

- Megfelelő megjelenítés
- Méretezés tesztelése
- Szöveges állapot megjelenítése

#### PageHeader.test.jsx

Az oldal fejléc komponens tesztelése:

- Cím és alcím megjelenítése
- Vissza gomb működése
- Kiegészítő elemek megjelenítése

## API tesztek

Az API tesztek az `src/__tests__/api/` könyvtárban találhatók, és a backend API-kkal való kommunikáció tesztelésére szolgálnak. Ezek a tesztek a következőket ellenőrzik:

- Megfelelő API végpontok meghívása
- Kérések formázása és paraméterek küldése
- Válaszok feldolgozása
- Hibaállapotok kezelése

Jelenleg nincsenek API tesztek implementálva.

## Integrációs tesztek

Az integrációs tesztek az `src/__tests__/integration/` könyvtárban találhatók, és több komponens és szolgáltatás együttes működésének tesztelésére szolgálnak. Ezek a tesztek biztosítják, hogy:

- A komponensek megfelelően kommunikálnak egymással
- A szolgáltatások együttműködnek a felhasználói felülettel
- Az alkalmazás állapotkezelése helyesen működik

Jelenleg nincsenek integrációs tesztek implementálva.

## End-to-End (E2E) tesztek

Az E2E tesztek az `src/__tests__/e2e/` könyvtárban találhatók, és a teljes felhasználói folyamatok tesztelésére szolgálnak valós környezetben. Ezek a tesztek biztosítják, hogy:

- Teljes felhasználói folyamatok (regisztráció, bejelentkezés, lista létrehozása, stb.) helyesen működnek
- Az alkalmazás egészében megfelelően reagál a felhasználói interakciókra
- A backend és frontend integrációja megfelelően működik

Jelenleg nincsenek E2E tesztek implementálva.

## Tesztelési környezet

A teszteket a Jest tesztelési keretrendszer segítségével futtatjuk, amelynek konfigurációja az alkalmazás gyökérkönyvtárában található setup fájlokban van definiálva. A React komponensek teszteléséhez a React Testing Library-t használjuk.

A tesztek futtatásához a következő parancsot kell kiadni a Web könyvtárban:

```
npm test
```
