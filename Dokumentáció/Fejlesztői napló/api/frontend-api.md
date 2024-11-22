# Frontend API Dokumentáció - Autentikáció
Ez a dokumentáció tartalmazza a frontend autentikációs API használatának minden fontos részletét, beleértve a példakódokat és biztonsági megfontolásokat is.

## Áttekintés
A frontend alkalmazás az AuthService osztályon keresztül kommunikál a backend szerverrel. Az autentikációs kérések az `api.js` által létrehozott Axios példányon keresztül történnek.

## Alap URL

`const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';`

A backend szerver URL-je: `http://localhost:5000/api/auth`

## AuthService Metódusok

### Bejelentkezés
```javascript
async login(email: string, password: string)
```

**Kérés:**
- Metódus: `POST`
- Végpont: `/auth/login`
- Content-Type: `application/json`

**Request body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Sikeres válasz (200):**
```json
{
  "token": "string",
  "message": "Sikeres bejelentkezés!"
}
```

**Használat példa:**
```javascript
try {
  const response = await AuthService.login('user@example.com', 'password123');
  localStorage.setItem('token', response.token);
} catch (error) {
  console.error('Bejelentkezési hiba:', error);
}
```

### Regisztráció
```javascript
async register(username: string, email: string, password: string)
```

**Kérés:**
- Metódus: `POST`
- Végpont: `/auth/register`
- Content-Type: `application/json`

**Request body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Sikeres válasz (201):**
```json
{
  "message": "Sikeres regisztráció!"
}
```

**Használat példa:**
```javascript
try {
  await AuthService.register('username', 'user@example.com', 'password123');
  // Sikeres regisztráció után átirányítás a bejelentkezéshez
} catch (error) {
  console.error('Regisztrációs hiba:', error);
}
```

### Kijelentkezés
```javascript
logout()
```

**Művelet:**
- Törli a JWT tokent a localStorage-ból
- Átirányít a bejelentkezési oldalra

**Használat példa:**
```javascript
AuthService.logout();
navigate('/login');
```

## Automatikus Token Kezelés

Az `api.js` interceptor automatikusan hozzáadja a JWT tokent minden kérés fejlécéhez:

```javascript
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);
```

## Hibakezelés

Az AuthService a következő hibákat kezeli:

- Hibás bejelentkezési adatok (400)
- Már létező email/felhasználónév (400)
- Szerver hiba (500)

**Hibaüzenet formátum:**
```json
{
  "message": "string"
}
```

## Kapcsolódó Komponensek

### LoginSignup Komponens
A komponens kezeli a bejelentkezési és regisztrációs űrlapot:

```javascript:Forráskód/Web/web-app/src/components/LoginSignup/LoginSignup.js
startLine: 26
endLine: 65
```

### PrivateRoute Komponens
Védett útvonalak kezelése:

```javascript:Forráskód/Web/web-app/src/App.js
startLine: 6
endLine: 9
```

## Biztonsági Megfontolások

1. A token localStorage-ban való tárolása biztonsági kockázatot jelenthet (XSS támadások)
2. Érdemes megfontolni a HttpOnly cookie használatát
3. A jelszavak soha nem kerülnek naplózásra
4. Minden API kérés HTTPS-en keresztül történik
```
