# Admin Felület Tervezése

## Fő Funkciók

1. **Felhasználókezelés**
    - Felhasználók listázása
    - Új felhasználó hozzáadása
    - Felhasználó adatainak szerkesztése
    - Felhasználó törlése
    - Felhasználói jogosultságok kezelése (admin, megtekintő, szerkesztő)

2. **Lista Kezelés**
    - Listák megtekintése
    - Új lista létrehozása
    - Lista adatainak szerkesztése
    - Lista törlése
    - Lista megosztása felhasználókkal

3. **Termék Kezelés**
    - Termékek listázása
    - Új termék hozzáadása
    - Termék adatainak szerkesztése
    - Termék törlése
    - Lista megosztása másokkal

4. **Statisztikák és Jelentések**
    - Felhasználói aktivitás jelentések
    - Lista használati statisztikák
    - Termékek vásárlási statisztikái

5. **Beállítások**
    - Rendszerbeállítások módosítása
    - Biztonsági beállítások (pl. jelszó komplexitás, session timeout)
    - Értesítési beállítások

### MVVM Architektúra

Az MVVM (Model-View-ViewModel) architektúra segít elválasztani a felhasználói felület logikáját az üzleti logikától, így könnyebben karbantartható és tesztelhető a kód.

#### Model

A Model réteg tartalmazza az adatokat és az üzleti logikát. Ez magában foglalja az adatbázis műveleteket és az adatmodelleket.

#### View

A View réteg a felhasználói felületet reprezentálja. WPF-ben ez XAML fájlok formájában jelenik meg.

#### ViewModel

A ViewModel réteg köti össze a View-t és a Model-t. Ez tartalmazza a felhasználói felület logikáját és a parancsokat.

### Tervezési Szempontok

1. **Felhasználói Felület**
    - **Navigációs Menü**: Oldalsó navigációs sáv a fő funkciók eléréséhez.
    - **Felhasználói Lista**: Táblázat a felhasználók listázásához, keresési és szűrési lehetőségekkel.
    - **Felhasználói Adatlap**: Űrlap a felhasználói adatok megtekintéséhez és szerkesztéséhez.
    - **Lista Kezelő**: Táblázat a listák megtekintéséhez és szerkesztéséhez.
    - **Termék Kezelő**: Táblázat a termékek megtekintéséhez és szerkesztéséhez.
    - **Statisztikák**: Grafikonok és jelentések a felhasználói aktivitásról és a listák használatáról.

2. **Adatkezelés**
    - **Adatbázis Kapcsolat**: A Model rétegben biztosítani kell az adatbázis kapcsolatot és az adatkezelési műveleteket.
    - **Adat Validáció**: Biztosítani kell az adatok helyességét és integritását a ViewModel rétegben.

3. **Biztonság**
    - **Autentikáció és Autorizáció**: Biztosítani kell, hogy csak az adminisztrátorok férjenek hozzá az admin felülethez.
    - **Adatvédelem**: Titkosítani kell az érzékeny adatokat és biztosítani kell a biztonságos adatkezelést.

### Backend Integráció

A Node.js backend módosításai:

1. **Admin Végpontok Létrehozása**
    - Új végpontok az admin funkciókhoz (felhasználókezelés, lista kezelés, termék kezelés, statisztikák).
    - Autentikáció és autorizáció biztosítása az admin végpontokhoz.

2. **Adatkezelés**
    - Adatmodellek kiterjesztése az admin funkciókhoz szükséges mezőkkel.
    - Adatbázis műveletek implementálása az admin funkciókhoz.

3. **Biztonság**
    - Biztonsági intézkedések bevezetése az admin végpontokhoz (pl. rate limiting, input validáció).

### Admin Desktop Integráció

A C# admin desktop alkalmazás módosításai:

1. **HTTP Service**
    - HTTP kliens implementálása a Node.js backend végpontok eléréséhez.
    - Autentikáció és autorizáció kezelése a HTTP kérések során.

2. **ViewModel**
    - ViewModel réteg kiterjesztése az admin funkciókhoz szükséges logikával.
    - Parancsok és adatbinding implementálása a ViewModel rétegben.

3. **Felhasználói Felület**
    - XAML nézetek létrehozása az admin funkciókhoz (felhasználókezelés, lista kezelés, termék kezelés, statisztikák).
    - Navigációs menü és egyéb UI elemek implementálása a felhasználói élmény javítása érdekében.

### NodeJS Backend API Végpontok Létrehozása

A Node.js backendben létre kell hozni az admin funkciókhoz szükséges API végpontokat. Ezek a végpontok biztosítják a CRUD műveletek elvégzését az adatbázisban.

#### Példa API Végpontok

- **Felhasználókezelés**
  - `GET /api/admin/users`: Felhasználók listázása
  - `POST /api/admin/users`: Új felhasználó hozzáadása
  - `PUT /api/admin/users/:id`: Felhasználó adatainak szerkesztése
  - `DELETE /api/admin/users/:id`: Felhasználó törlése

- **Lista Kezelés**
  - `GET /api/admin/lists`: Listák megtekintése
  - `POST /api/admin/lists`: Új lista létrehozása
  - `PUT /api/admin/lists/:id`: Lista adatainak szerkesztése
  - `DELETE /api/admin/lists/:id`: Lista törlése

- **Termék Kezelés**
  - `GET /api/admin/products`: Termékek listázása
  - `POST /api/admin/products`: Új termék hozzáadása
  - `PUT /api/admin/products/:id`: Termék adatainak szerkesztése
  - `DELETE /api/admin/products/:id`: Termék törlése

### 2. HTTP Kliens Implementálása WPF-ben

A WPF alkalmazásban egy HTTP klienst kell implementálni, amely képes kommunikálni a Node.js backend API végpontjaival. Ehhez a `HttpClient` osztályt fogjuk használni.

### 3. ViewModel Réteg Kiterjesztése

A ViewModel rétegben implementálni kell a szükséges logikát a HTTP kliens használatához és az adatok kezeléséhez.

### 4. Felhasználói Felület (View) Létrehozása

A WPF alkalmazásban XAML fájlok segítségével létre kell hozni a felhasználói felületet, amely lehetővé teszi az admin funkciók használatát.

### Összefoglalás

A WPF MVVM C# admin desktop felület és a MERN stack webapp közötti kommunikáció HTTP kéréseken keresztül történik. A Node.js backend biztosítja az API végpontokat a CRUD műveletekhez, míg a WPF alkalmazásban egy HTTP kliens segítségével érhetők el ezek a végpontok. A ViewModel rétegben implementálni kell a szükséges logikát, és a felhasználói felületet XAML fájlok segítségével kell létrehozni.
