Collecting workspace information

# Implementációs Terv - Felhasználók Kezelése

## Implementációs sorrend a táblázathoz:
- XAML nézetek létrehozása üres DataGrid-ekkel
- ViewModels létrehozása
- Command-ok bekötése a gombok és nézetek közötti váltáshoz
- UI elemek stílusának beállítása
- Táblázatok reszponzív viselkedésének beállítása

## 1. Szükséges Fájlok Létrehozása/Módosítása:

### Models Mappa:
- `UserModel.cs` - Felhasználó adatmodel
  - Properties: Id, Username, Email, Password, Role

### ViewModels Mappa:
- `UsersViewModel.cs` - Felhasználók listázásának logikája
  - Felhasználók listája
  - Szűrési logika (admin/user)
  - CRUD műveletek
  - RelayCommand az adminok táblázat megjelenítéséhez

- `AdminsViewModel.cs`
- RelayCommand az adminok táblázat megjelenítéséhez

### Views Mappa:

`UsersView.xaml(.cs):`

 - Felhasználók listázása
  - DataGrid táblázat
  - Műveleti gombok
  - Szűrő gombok

- DataGrid táblázat oszlopai:
  - ID
  - Felhasználónév
  - Email
  - Jelszó hash
  - Műveletek (törlés/módosítás gombok)

`AdminsView.xaml(.cs)`
- DataGrid táblázat oszlopai:
  - ID 
  - Felhasználónév
  - Email
  - Jelszó hash
  - Műveletek (törlés/módosítás gombok)

### Services Mappa: (nem kell még)
- `IUserService.cs` - Interface a felhasználókezeléshez
- `UserService.cs` - Service implementáció

### Commands Mappa: (nem kell még)
- `UserCommands.cs` - CRUD műveletek parancsai

## 2. Módosítandó Meglévő Fájlok:

### App.xaml:
- Erőforrások regisztrálása

### MainViewModel.cs:
- UsersViewModel integrálása

## 3. Implementációs Sorrend:

1. Model létrehozása
2. Service réteg implementálása
3. ViewModel létrehozása
4. View létrehozása
5. Commands implementálása
6. Dependency Injection beállítása

## 4. Főbb Funkciók:

- Felhasználók listázása táblázatban
- Szűrés admin/user szerint
- CRUD műveletek implementálása
- Jogosultságkezelés
- Adatkötés a ViewModel és View között

## 5. Stílus és Megjelenés:

- DataGrid testreszabása
- Műveleti gombok stílusának beállítása
- Reszponzív elrendezés
