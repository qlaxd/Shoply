# Fejlesztési Lépések a Shopping Lists Web App-hoz

Ez a dokumentum lépésről lépésre útmutatót nyújt a Shopping Lists Web App fejlesztéséhez a [CONTEXT.md](#) alapján.

---

## 1. Projektkörnyezet előkészítése
1. **Lokális fejlesztői környezet kialakítása**
   - Telepítsd a szükséges szoftvereket: Node.js, MongoDB.
   - Hozz létre egy új mappát a projektnek.
   - Ellenőrizd, hogy a MongoDB elindul-e helyben vagy használj online MongoDB szolgáltatást (pl. Atlas).

2. **Könyvtárstruktúra**
   - Hozz létre egy **Forráskód/Backend** mappát a szerveroldali fájloknak és egy **Forráskód/Web** mappát a kliensoldali alkalmazásnak (React).
   - A dokumentációknak már létezik a **Dokumentáció/Fejlesztői napló** mappa, így oda kerülhetnek az átfogó vagy további tervezési leírások.

---

## 2. Backend alapok (Node.js + Express)
1. **Express alkalmazás inicializálása**
   - Hozz létre egy csupasz Node.js projektet az Express keretrendszerrel.
   - Állítsd be például a `server.js` vagy `index.js` fájlt belépési pontként a szerverhez.

2. **Kapcsolat a MongoDB-vel**
   - Állítsd be a kapcsolatot a MongoDB-hez (helyi vagy távoli).
   - Hozz létre egy fájlt, pl. `config/db.js`, amelyben inicializálod a mongoose kapcsolatot.

3. **Alap routing**
   - Ellenőrizd, hogy az alapútvonal (`/`) működik, például visszaküld egy "hello world" üzenetet – így tesztelheted, hogy sikeresen fut-e a szerver.

---

## 3. Adatmodellek és vázlatos API-műveletek
A [CONTEXT.md](#) részletes sémákat ad a **User**, **List**, **Product Catalog** és **AuditLog** modellekhez.

1. **User modell**
   - Hozd létre a `User.js` fájlt a **Forráskód/Backend/models** mappában.
   - Alakítsd ki a sémát (MongoDB-s mongoose sémaként), használd a `username`, `email`, `password` stb. mezőket.
   - Implementáld a jelszó titkosítását (pl. bcrypt).

2. **List modell**
   - Hozd létre a `List.js` fájlt a **Forráskód/Backend/models** mappában.
   - Térj ki azokra a mezőkre, amelyek a bevásárlólista működéséhez szükségesek (pl. title, owner, sharedUsers, priority, products tömb).

3. **API végpontok**
   - Készíts rövid, vázlatos route-okat a listák kezeléséhez:
     - `GET /api/lists`
     - `POST /api/lists`
     - `PUT /api/lists/:id`
     - `DELETE /api/lists/:id`

4. **Termékfunkciók**
   - Kezdetben elegendő lehet a listán belüli termékek kezelését integrálni, pl. `POST /api/lists/:listId/products`.

---

## 4. User autentikáció és jogosultság
A [CONTEXT.md](#) megemlíti, hogy az email alapú autentikációt már megoldottátok, de ha finomhangolni kell, akkor:

1. **Regisztráció, bejelentkezés**
   - Használd a `User` modellt, és hozz létre végpontokat:
     - `POST /api/auth/signup`
     - `POST /api/auth/login`
   - Validáld az emailt és használd a jelszóhash-elést.

2. **Érvényesítés és Slice**
   - Token alapú hitelesítést (JWT) érdemes lehet bevetni a későbbiekben, hogy a kliensek hitelesítve tudjanak kéréseket küldeni.

---

## 5. React alkalmazás alapjai
1. **Initializáld a React projektet**
   - A **Forráskód/Web** mappában hozz létre egy új React alkalmazást (pl. `create-react-app`).
   - Töröld ki a felesleges alapfájlokat vagy módosítsd őket a saját ízlésed szerint.

2. **Alap komponensek**
   - `App.js` (vagy TypeScript esetén `App.tsx`), ami az alkalmazás gyökérkomponense.
   - `index.js` (vagy `index.tsx`), ami rendereli az `App`-et.

3. **Routing**
   - Telepítsd és állítsd be a `react-router-dom` csomagot (ha szükséges a többoldalas navigációhoz).
   - Készíts egy minimalista útvonalat a `WelcomeScreen` és a `Dashboard` komponensekhez.

---

## 6. Alap front-end funkciók: Welcome + Dashboard
1. **WelcomeScreen komponens**
   - Hozz létre egy letisztult kezdőképernyőt, ahonnan a felhasználó bejelentkezik vagy regisztrál.
   - Integráld az autentikációs űrlapot (ha a backenden keresztül próbálnád, állíts be proxy-t vagy CORS-t).

2. **Dashboard komponens**
   - Listázd ki a felhasználóhoz tartozó "aktív" listákat (vagy a demó kedvéért statikus adatokat).
   - Implementálj egy "quick-add" mezőt és "+" gombot az új lista létrehozásához.

---

## 7. Lista létrehozása és szerkesztése (ListEditor komponens)
1. **Új lista létrehozás**
   - A felhasználó a Dashboardon rákattint a "+" gombra vagy a "quick-add" mezőre.
   - Vidd át egy "ListEditor" nézetbe.

2. **Termékek hozzáadása**
   - A "ListEditor" komponensben legyen egy több mezőből álló űrlap, ahol a felhasználó megadja a termék nevét, mennyiségét stb.
   - A termékek bekerülnek a state-be, majd a küldéskor a backendre.

3. **Lista mentése**
   - A felhasználó befejezi a szerkesztést és ad egy címet a listának (pl. "Weekend Grill Party").
   - Mentés után visszairányítod a Dashoardra, ahol megjelenik az új lista.

---

## 8. Megosztás és kollaboráció
1. **Listák megosztása**
   - Az "owner" információ alapján a bejelentkezett felhasználó megoszthatja a listát más felhasználókkal (pl. "sharedUsers" mezőben).
   - Egyelőre elegendő a backendoldalon leképezni a "sharedUsers" Array-t.

2. **Valós idejű frissítés (opcionális)**
   - Később implementálhatsz WebSocket (pl. Socket.io) megoldást, ha a valós idejű kollaboráció fontos.

---

## 9. Hibakezelés és felhasználói élmény
1. **Hibaüzenetek**
   - Frontenden javasolt "toast"/modális ablakok megjelenítése, ha valamilyen hiba lép fel.
   - Backend oldalon priorizáld a megfelelő HTTP státuszkódokat (400, 401, 403, 404, 500 stb.).

2. **Validáció**
   - Mind a backend, mind a frontend oldalon végezz ellenőrzéseket (például: üres mezők, e-mail formátum stb.).

---

## 10. Finomhangolás és további tervek
- **Felhasználói jogosultságok kiterjesztése** (pl. admin funkciók).
- **Termék katalógus** integrálása, hogy javaslatokat adjon a felhasználóknak.
- **Kategóriák, mennyiségi egységek** kezelése, ha a felhasználói igények megkívánják.
- **Statisztikák** (később), pl. melyik terméket hányszor vették meg, bevásárló szokások elemzése stb.

---

### Összegzés
A fenti lépések következetes végrehajtásával jól tagoltan építheted fel a bevásárlólista-alkalmazást. Először a környezetet készítsd elő, majd az alapoktól elindulva (backend → adatmodellek → egyszerű végpontok → frontenden a komponensek) fokozatosan bővítsd a funkciókat. Így mindig tisztán látod, hogy melyik rész épp milyen funkciót lát el, és könnyebben tudsz hibát keresni vagy új megoldásokat integrálni.

> **Tipp:** Dolgozz rövid, iteratív lépésekben, és minden nagyobb funkció befejezésekor végezz átfogó tesztelést, mielőtt továbblépnél.

---
