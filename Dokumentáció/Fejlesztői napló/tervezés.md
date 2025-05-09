# 1. Főbb funkciók

- Bevásárlólista létrehozása és kezelése
- Valós idejű frissítés
- Listák megosztása másokkal (email, link vagy felhasználónév)
- Szinkronizálás több eszköz között (web, mobil, desktop)
- Felhasználói fiók (bejelentkezés és regisztráció)

## Főbb/alap funkciók

- Regisztráció / Bejelentkezés (felhasználónév, email + jelszó)
- Közös lista létrehozása
- Elemek hozzáadása / törlése a listán
- Listák megosztása
- Valós idejű frissítés (amikor egy user módosítja a listát, a többi user is azonnal látja)
- Szinkronizálás több eszköz között: Mobil (iOS, Android), web, desktop (Windows, Mac, Linux)

# 2. Műszaki Tervezés

## Backend (Szerver oldali fejlesztés)
A backend az alkalmazás logikáját és adatkezelését kezeli. A közös vásárlólisták szinkronizálásához és frissítéséhez valós időben több megoldás is létezik. A legjobb megoldás valószínűleg valamilyen real-time adatbázis vagy websocket kommunikáció lesz.

### Eszközök
- Backend nyelv: Node.js
- Valós idejű frissítés: WebSockets vagy Socket.io
- Adatbázis: MongoDB (+/vagy PostgreSQL)

### Funkciók
- API (REST vagy GraphQL) a listák kezeléséhez
- Valós idejű szinkronizálás WebSocket/socket.io segítségével
- Felhasználói fiókok kezelése (authentikáció + jogosultságok)
- Listák megosztása, meghívások küldése

## Frontend

### Webalkalmazás
- Frontend eszközök: HTML, CSS, JavaScript (React.js!!! vagy Vue.js a modern webalkalmazásokhoz)
- Valós idejű kommunikáció: WebSocket
- UI/UX: Bootstrap vagy Material-UI gyorsak és szépek

### Mobilalkalmazás
React Native (vagy Flutter): Ezek lehetővé teszik, hogy ugyanazt a kódot mind iOS-en, mind Androidon futtassuk.
A React Native-ot csak azért preferálnám, mert könnyen integrálható a webes résszel.

### Desktop alkalmazás
A desktop verziók esetén a webes alkalmazást is portolhatjuk a desktopra, ha a frontendhez React.js-t használunk. Akkor ehhez csak Electron keretrendszert kell használni, hogy átültessük, a backend rész pedig lehet ugyanaz a Node.js kód.

### Eszközök
- Electron.js: A webalkalmazásokat desktop alkalmazásokká alakítja (Windows, macOS, Linux)
- React.js (vagy Vue.js): Ugyanazt a frontend technológiát használhatjuk a web és a desktop alkalmazásokhoz is

# 3. Részletes Funkciók és Képernyők

## A. Web / Mobil UI Tervezés
A felhasználói felület legyen letisztult, egyszerű és intuitív. Az alábbi képernyők lehetnek a legfontosabbak:

### Bejelentkezés / Regisztráció
- Felhasználónév + jelszó
- Közvetlenül a főoldalra vagy a lista kezelőfelületére irányít

### Főoldal / Lista kezelése
- Az összes bevásárlólista megjelenítése
- Lista létrehozás gomb
- Lehetőség a lista törlésére, módosítására

### Listakezelő felület
- A bevásárlólista elemeinek hozzáadása
- Az elemek mennyiségének és állapotának kezelése (pl. "megvettem" checkbox)
- A listát megoszthatjuk másokkal
- Valós idejű frissítés
- A lista frissítése valós időben, ha valaki módosítja (WebSocket)
- Közvetlenül meghívhatjuk a felhasználókat egy listára (email vagy link küldésével)

# 4. Biztonság és Adatkezelés
- Jelszó titkosítás: bcrypt vagy Argon2
- HTTPS: SSL cert az adatforgalom titkosítására
- Felhasználói jogosultságok: (admin, megtekintő, szerkesztő)
- Adatvédelmi szabályzat: (GDPR-t nem kéne megszegni xd)

# 5. Fejlesztési lépések és ütemezés

## Backend fejlesztés
- Szerver API: REST (vagy GraphQL)
- WebSocket (vagy Firebase) integráció
- Felhasználói autentikáció és jogosultságok kezelése

## Frontend
- Webalkalmazás UI tervezése React.js használatával
- Valós idejű szinkronizálás
- Felhasználói interakciók (lista kezelés, elem hozzáadás)

## Mobil alkalmazás
- React Native (vagy Flutter) alapú mobil alkalmazás tervezés
- Webes backend integrálása

## Desktop alkalmazás
- Electron.js segítségével desktop verzió létrehozása