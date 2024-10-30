# Fejlesztési Feladatok

## 1. Biztonsági Fejlesztések

### Token Kezelés
- Refresh token implementálása a hosszabb munkamenetek biztonságos kezeléséhez
- HttpOnly cookie használata a token tárolásához localStorage helyett
  - Érintett fájl: `auth.service.js` (startLine: 7, endLine: 9)

### Autentikáció Fejlesztése
- CSRF védelem implementálása
- Rate limiting bevezetése a login/register endpointokra
- Session invalidation mechanizmusok implementálása
  - Érintett fájl: `authController.js` (startLine: 34, endLine: 61)

### Jelszókezelés
- Password complexity validáció bevezetése
- Jelszó-visszaállítási folyamat implementálása
- Jelszóváltoztatás esetén az összes session invalidálása
  - Érintett fájl: `authController.js` (startLine: 6, endLine: 32)

### Általános Biztonsági Fejlesztések
- HTTPS kikényszerítése
- Security headerek beállítása (HSTS, CSP)
- XSS védelem implementálása
  - Érintett fájl: `server.js` (startLine: 13, endLine: 23)

## 2. Felhasználói Jogosultságok

### Szerepkörök Kezelése
- Admin szerepkör implementálása
- Megtekintő és szerkesztő jogosultságok bevezetése
- Jogosultság-ellenőrzési middleware létrehozása
  - Érintett fájl: `authMiddleware.js` (startLine: 3, endLine: 14)

## 3. Error Handling

### Hibakezelés Fejlesztése
- Egységes hibaüzenet formátum
- Részletes logolás bevezetése
- Frontend hibakezelés fejlesztése
  - Érintett fájl: `LoginSignup.js` (startLine: 62, endLine: 64)

## 4. Teljesítmény Optimalizálás

### Backend Optimalizálás
- MongoDB indexek optimalizálása
- Query optimalizálás
- Caching bevezetése

### Frontend Optimalizálás
- Code splitting implementálása
- Lazy loading bevezetése
- Bundle méret optimalizálása

## 5. Tesztelés

### Unit Tesztek
- Backend unit tesztek írása (Jest)
- Frontend unit tesztek írása (React Testing Library)

### Integrációs Tesztek
- API endpoint tesztek
- Autentikációs flow tesztek
- End-to-end tesztek (Cypress)

## 6. Dokumentáció

### API Dokumentáció
- Swagger/OpenAPI dokumentáció készítése
- API endpoint leírások
- Autentikációs flow dokumentálása

### Fejlesztői Dokumentáció
- Kód dokumentáció fejlesztése
- Setup guide bővítése
- Deployment guide készítése

## 7. Monitoring és Logging

### Monitoring Rendszer
- Error tracking bevezetése (pl. Sentry)
- Teljesítmény monitoring
- User activity tracking

### Logging Rendszer
- Strukturált logging bevezetése
- Log aggregálás és elemzés
- Audit logging implementálása

## Prioritások
1. Biztonsági fejlesztések
2. Hibakezelés fejlesztése
3. Tesztek írása
4. Dokumentáció
5. Teljesítmény optimalizálás
6. Monitoring és logging bevezetése