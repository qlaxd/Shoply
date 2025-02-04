# Backend Admin API Dokumentáció

Ez a dokumentáció részletesen ismerteti a backend admin API végpontjait, amelyek segítségével az admin jogosultsággal rendelkező felhasználók kezelhetik a rendszer felhasználóit. A bemutatott végpontok kizárólag hitelesített és adminisztrátori jogosultságokkal rendelkező felhasználók számára érhetők el.

## Alap URL

`http://localhost:5000/api/admin`

## Végpontok

### Felhasználók Listázása

**Leírás:** Az összes regisztrált felhasználó lekérése.

- **HTTP Metódus:** `GET`
- **Végpont:** `/users`

**Sikeres válasz (200):**

```json
[
  {
    "id": "user_id",
    "username": "felhasználónév",
    "email": "user@example.com",
    "role": "user"
  },
  ...
]
```

**Használat példa:**

```javascript
try {
  const response = await axios.get('/users');
  console.log('Felhasználók:', response.data);
} catch (error) {
  console.error('Hiba a felhasználók lekérésekor:', error);
}
```

### Felhasználó Adminná Tétele

**Leírás:** Egy adott felhasználó jogosultságának módosítása admin jogokra.

- **HTTP Metódus:** `POST`
- **Végpont:** `/promote/:userId`
- **Útvonal paraméter:** `userId` – a módosítandó felhasználó egyedi azonosítója

**Sikeres válasz (200):**

```json
{
  "message": "Felhasználó adminná téve."
}
```

**Használat példa:**

```javascript
try {
  const response = await axios.post('/promote/12345');
  console.log(response.data.message);
} catch (error) {
  console.error('Hiba a felhasználó adminná tételénél:', error);
}
```
