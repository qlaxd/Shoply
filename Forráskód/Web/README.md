# Vásárló Lista Alkalmazás

### Login frontend elkészítve

## A Projektről

A Vásárló Lista egy React-alapú webalkalmazás, amely lehetővé teszi a felhasználók számára a regisztrációt, bejelentkezést és vásárlólisták kezelését. Az alkalmazás JWT token alapú autentikációt használ a biztonságos bejelentkezéshez.

## Funkciók

- Felhasználói regisztráció és bejelentkezés
- JWT token alapú autentikáció
- Reszponzív felhasználói felület
- Védett útvonalak
- Kijelentkezés funkció
- Refreshtoken használata a tokenek frissítéséhez (fejlesztés alatt)

## Környezeti Változók Beállítása
1. Másold le vagy nevezd át a `.env.example` fájlt `.env` néven:
   ```bash
   cp .env.example .env
   ```
2. Módosítsa a `.env` fájl tartalmát a saját környezetének megfelelően:
   - ```REACT_APP_API_URL=http://localhost:5000/api```

## Technológiák

### Frontend
- React.js 18.3.1
- React Router DOM 6.27.0
- CSS3 egyedi stílusokkal

### Backend (Fejlesztés alatt)
- Node.js
- Express.js
- MongoDB
- JWT autentikáció
- Bcrypt jelszó titkosításhoz
- dotenv tárolni a bizalmas adatokat (eg.: connection string, JWT secret)

## Telepítés és Futtatás

1. Klónozd le a repository-t: ```git clone -b a-branch-amin-dolgozni-akarsz [repo url].git```
2. Lépj bele a könyvtárba ```cd /Vasarlolista/Forráskód/Web/```
3. Telepítsd a fejlesztői környezetet: ```npm i```
4. Indítsd el a fejlesztői környezetet: ```npm start```


Az frontend ezután elérhető a következő címen: `http://localhost:3000`
