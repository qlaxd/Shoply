# Bevásárlólista Alkalmazás - Részletes Tervezési Dokumentáció

## Projekt témája

A projekt célja egy többplatformos, valós idejű szinkronizációval működő közös bevásárlólista alkalmazás létrehozása. Az alkalmazás lehetővé teszi a felhasználók számára listák létrehozását, megosztását és közös kezelését különböző eszközökön keresztül.

## Esettanulmány

A modern háztartásokban gyakori probléma, hogy a családtagok nem tudják hatékonyan koordinálni a bevásárlásokat. Többször előfordul, hogy ugyanazt a terméket többen is megveszik, vagy éppen senki sem veszi meg, mert mindenki azt hiszi, hogy a másik már beszerezte. A kommunikáció hiánya jelentős idő- és pénzveszteséget okoz a háztartásoknak.

Az alkalmazásunk célja ennek a problémának a megoldása egy olyan platformmal, ami lehetővé teszi a valós idejű lista-szinkronizációt és együttműködést a háztartás tagjai között.

## Projektben kifejlesztett szoftverrendszer elnevezése

ShoppingSync - Közös Bevásárlólista Alkalmazás

## 1. Összefüggések és a szoftver képességei

### Web Alkalmazás

- Felhasználói regisztráció és bejelentkezés
- Listák létrehozása és kezelése
- Valós idejű szinkronizáció
- Termékek kategorizálása
- Lista megosztása más felhasználókkal
- Keresés és szűrés funkciók
- Statisztikák megtekintése

### Mobil Alkalmazás

- Offline működés szinkronizációval
- Push értesítések új elemekről
- Vonalkód szkenner a termékek hozzáadásához
- Lista kezelés és megosztás (QR kód, link, friend invite appon belül)
- Valós idejű frissítések

### Desktop Alkalmazás

- Teljes funkcionalitás a web verzióval megegyezően
- Gyorsbillentyűk támogatása
- Offline működés
- Automatikus szinkronizáció

## 2. A rendszer használói és feladataik

### Felhasználói szerepkörök:

1. Alap felhasználó
   - Saját listák létrehozása
   - Termékek hozzáadása/törlése
   - Megosztott listák megtekintése
   - Alapvető lista műveletek

2. Lista tulajdonos
   - Lista létrehozása és törlése
   - Jogosultságok kezelése
   - Lista megosztása
   - Teljes lista kezelés

3. Rendszer adminisztrátor
   - Felhasználók kezelése
   - Rendszerbeállítások módosítása
   - Hibaelhárítás
   - Rendszerstatisztikák megtekintése

## 3. Interjú a felhasználókkal

### 3.a Szcenáriók

| Felhasználó | Tevékenység | Jelenlegi megoldás |
|-------------|-------------|-------------------|
| Családanya | Bevásárlólista készítése | 1. Papírra írja a listát<br>2. Lefényképezi és elküldi a családtagoknak<br>3. Telefonon egyeztet a változásokról |
| Családapa | Lista követése | 1. Megnézi a kapott képet<br>2. Telefonál ha kérdése van<br>3. Nem tudja jelezni mit vett meg |
| Tinédzser | Kívánságlista | 1. SMS-ben kér dolgokat<br>2. Nem látja mi került már fel a listára |

### 3.b Pain Points és Megoldások

| Probléma | Megoldási javaslat |
|----------|-------------------|
| Nincs valós idejű követés | Az alkalmazás azonnali szinkronizációt biztosít minden eszközön |
| Dupla vásárlások | A megvett termékek azonnal láthatóak minden felhasználónál |
| Nehézkes kommunikáció | Beépített chat és megjegyzés funkció |
| Papír alapú lista elvesztése | Minden adat felhőben tárolva, bármikor elérhető |

### 3.c Felhasználói tulajdonságok

| Szereplő | Tulajdonságok | Céljai | Fenntartásai | Tipikus idézetek |
|----------|---------------|--------|--------------|------------------|
| Családanya | Szervezett, precíz | Hatékony bevásárlás, pénzmegtakarítás | Bonyolult alkalmazásoktól tart | "Szeretnék mindent egy helyen látni" |
| Családapa | Praktikus szemléletű | Gyors bevásárlás | Nem szereti a sok értesítést | "Csak azt mutassa, amit meg kell vennem" |
| Tinédzser | Tech-savvy | Könnyű kérések küldése | - | "Legyen olyan mint az Instagram" |

## 4. Liftbeszéd

A ShoppingSync egy modern, többplatformos bevásárlólista alkalmazás családok, lakóközösségek és baráti társaságok számára. Szemben a hagyományos papír alapú vagy egyszerű jegyzetelő alkalmazásokkal, a ShoppingSync valós időben szinkronizál minden eszközön, lehetővé téve a közös lista kezelést és a hatékony kommunikációt. Az alkalmazás egyedülálló tulajdonsága, hogy ötvözi a modern technológiát az egyszerű használhatósággal, így minden korosztály számára ideális megoldást nyújt a mindennapi bevásárlások koordinálására.

## 4.1. Projekt mottója

ShoppingSync - Legyen egyszerű a bevásárlás!

## 5. Műszaki Specifikáció

### Backend

- Node.js alapú szerver
- WebSocket/Socket.io valós idejű kommunikáció
- MongoDB adatbázis
- REST API
- JWT alapú autentikáció

### Frontend

- React.js webalkalmazás
- React Native mobil alkalmazás
- Electron desktop alkalmazás
- Material-UI komponensek
- Redux állapotkezelés

### Biztonság

- HTTPS protokoll
- Titkosított jelszótárolás (bcrypt)
- CSRF védelem
- Rate limiting
- Input validáció

### Deployment

- Docker konténerizáció
- CI/CD pipeline
- Automatikus backup
- Monitoring rendszer
