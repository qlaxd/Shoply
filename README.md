# Shoply

## A Projektről

A Vásárló Lista egy modern, többplatformos alkalmazás, amely lehetővé teszi a felhasználók számára bevásárlólisták létrehozását, kezelését és megosztását. Az alkalmazás MERN stack-et használ (MongoDB, Express.js, React.js, Node.js).

## Funkciók

- 🔐 Biztonságos felhasználói autentikáció (JWT)
- 📱 Reszponzív felhasználói felület
- 📋 Listák létrehozása és kezelése
- 👥 Listák megosztása más felhasználókkal
- 🔄 Valós idejű szinkronizáció
- 📊 Kategorizálás és rendszerezés
- 🔍 Keresés és szűrés funkciók

## Technológiai Stack (MERN stack)

### Backend

- Node.js és Express.js
- MongoDB adatbázis
- JWT autentikáció
- WebSocket valós idejű kommunikációhoz (majd)

### Frontend

- React.js
- React Router a navigációhoz
- Axios API a HTTP kérésekhez
- Modern CSS megoldások

### Mobil

- React Native (fejlesztés alatt)

### Asztali

- WPF - MVVM Architektúra

## Telepítés és Futtatás

### Előfeltételek

- Node.js v20.18.1
- MongoDB v8.0.4
- npm v10.9.2
- Mongosh 2.3.3 (mongodb shell)

### Környezeti változók konfigurálása

#### Backend (.env)

1. Lépj be a Backend mappába:
2. Másold ki a .env fájlt a gyökérkönyvtárba és nevezd át `.env` -re --->```cp .env.example .env```
3. Állítsd be a környezeti változókat
`MONGO_URI=mongodb://127.0.0.1:27017 (mongodb connectionString)
JWT_SECRET=your_jwt_secret_key
PORT=5000
HOST=localhost`

#### Frontend (.env)

1. Lépj be a Web mappába:
2. Másold le a .env.example fájlt .env néven:
3. Állítsd be a következő változót a .env fájlban: `REACT_APP_API_URL=http://localhost:5000/api` vagy ahol a a backend fut (Backend/server.js)

### MongoDB indítása

``` bash
mongod
```

- a `mongod.cfg`-ben van a `connectionString` a következő formában:

```
# network interfaces
net:
  port: 27017
  bindIp: 127.0.0.1
```

ezt ne felejtsd a `.env` fájlba betenni a megfelelő formátumban: `mongodb://127.0.0.1:27017`

### Backend Indítása

- ```cd Forráskód/Backend```
- ```npm install```
- ```npm start```

### Frontend Indítása

- ```cd Forráskód/Web```
- ```npm install```
- ```npm start```

## Dokumentáció

Részletes dokumentáció az alábbi helyeken található:

- [Fájlstruktúra Magyarázat](Dokumentáció/Fejlesztői%20napló/fileStructure.md)
- [Fejlesztői Dokumentáció](Dokumentáció/Fejlesztői%20napló/tervezés.md)
- [Frontend Dokumentáció](Forráskód/Web/web-app/README.md)
- [Backend Dokumentáció és Fejlesztési Feladatok](Dokumentáció/Fejlesztői%20napló/development.md)
- [Frontend API Dokumentáció](Dokumentáció/Fejlesztői%20napló/api/frontend-api.md)
- [Felhasználó központú Tervezési Dokumentáció](Dokumentáció/Fejlesztői%20napló/felhasznalo-kozpontu-tervezes.md)
- [Admin desktop felület dokumentációja](Dokumentáció/Fejlesztői%20napló/admin-desktop-mvvm-wpf-csharp.md)
- [Backend API Dokumentáció](Dokumentáció/Fejlesztői%20napló/api/Backend-API.md)
## Fejlesztés Alatt

- 📱 Mobil alkalmazás React Native-ben
- 🖥️ Asztali alkalmazás WPF-ben MVVM architechtúrával
- 🛜 Web alkalmazás további része
- 🔄 Offline mód támogatás
- 📊 Statisztikák és elemzések

## Közreműködés

A projekthez való hozzájárulást szívesen fogadjuk. Kérjük, kövesse a következő lépéseket:

1. Forkold a repository-t
2. Hozz létre egy új branch-et
3. Commitold a változtatásokat
4. Nyiss egy Pull Request-et

## Licensz

MIT License - lásd a LICENSE fájlt a részletekért.

## Kapcsolat

További információkért vagy kérdésekkel kapcsolatban keressen minket.
