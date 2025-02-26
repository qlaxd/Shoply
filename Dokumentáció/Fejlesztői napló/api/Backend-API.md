# Backend API dokumentáció

## Autentikáció

### Regisztráció
**Végpont:** `POST /api/auth/register`  
**Leírás:** Új felhasználó regisztrálása a rendszerbe.  
**Jogosultság:** Nincs szükség autentikációra

**Kérés:**
```json
{
  "username": "teszt_felhasznalo",
  "email": "teszt@example.com",
  "password": "Teszt123!"
}
```

**Sikeres válasz (200 OK):**
```json
{
  "message": "Sikeres regisztráció",
  "token": "jwt_token",
  "user": {
    "_id": "67be04f22fe174af05ee6d0d",
    "username": "teszt_felhasznalo",
    "email": "teszt@example.com",
    "role": "user"
  }
}
```

**Hibalehetőségek:**
- 400 Bad Request - Hiányzó adatok vagy nem megfelelő formátum
- 409 Conflict - A felhasználónév vagy email cím már használatban van

### Bejelentkezés
**Végpont:** `POST /api/auth/login`  
**Leírás:** Bejelentkezés a rendszerbe  
**Jogosultság:** Nincs szükség autentikációra

**Kérés:**
```json
{
  "email": "teszt@example.com",
  "password": "Teszt123!"
}
```

**Sikeres válasz (200 OK):**
```json
{
  "message": "Sikeres bejelentkezés",
  "token": "jwt_token",
  "user": {
    "_id": "67be04f22fe174af05ee6d0d",
    "username": "teszt_felhasznalo",
    "email": "teszt@example.com",
    "role": "user"
  }
}
```

**Hibalehetőségek:**
- 400 Bad Request - Hiányzó adatok
- 401 Unauthorized - Hibás email vagy jelszó

## Bevásárlólisták

### Összes lista lekérése
**Végpont:** `GET /api/lists`  
**Leírás:** A bejelentkezett felhasználó összes listájának lekérése (saját és megosztott listák)  
**Jogosultság:** Autentikáció szükséges

**Kérés:** Nincs szükség kérés törzsre
```json
{}
```

**Sikeres válasz (200 OK):**
```json
[
  {
    "_id": "67be0526b2336cdada6ed6b7",
    "title": "Teszt bevásárlólista",
    "priority": 1,
    "products": [
      {
        "_id": "67be0526b2336cdada6ed6b8",
        "catalogItem": {
          "_id": "67b4ccc82de718b6120e5245",
          "name": "Tej",
          "categoryHierarchy": ["Élelmiszerek", "Tejtermékek"],
          "defaultUnit": "l"
        },
        "quantity": 3,
        "unit": "l",
        "isPurchased": false,
        "notes": "Megjegyzés a termékhez"
      }
    ],
    "owner": {
      "_id": "67be04f22fe174af05ee6d0d",
      "username": "teszt_felhasznalo"
    },
    "sharedUsers": [
      {
        "user": {
          "_id": "67be04f22fe174af05ee6d10",
          "username": "user3"
        },
        "permissionLevel": "edit"
      }
    ],
    "createdAt": "2024-02-03T12:00:00.000Z",
    "updatedAt": "2024-02-03T12:30:00.000Z"
  }
]
```

**Hibalehetőségek:**
- 401 Unauthorized - Érvénytelen vagy hiányzó token
- 500 Internal Server Error - Szerver oldali hiba

### Egy lista részleteinek lekérése
**Végpont:** `GET /api/lists/{listaId}`  
**Leírás:** Egy konkrét bevásárlólista részleteinek lekérése  
**Jogosultság:** Autentikáció szükséges, a lista tulajdonosának vagy megosztott felhasználónak kell lenni

**Kérés:** Nincs szükség kérés törzsre
```json
{}
```

**Sikeres válasz (200 OK):**
```json
{
  "_id": "67be0526b2336cdada6ed6b7",
  "title": "Teszt bevásárlólista",
  "priority": 1,
  "products": [
    {
      "_id": "67be0526b2336cdada6ed6b8",
      "catalogItem": {
        "_id": "67b4ccc82de718b6120e5245",
        "name": "Tej",
        "categoryHierarchy": ["Élelmiszerek", "Tejtermékek"],
        "defaultUnit": "l"
      },
      "quantity": 3,
      "unit": "l",
      "isPurchased": false,
      "notes": "Megjegyzés a termékhez"
    }
  ],
  "owner": {
    "_id": "67be04f22fe174af05ee6d0d",
    "username": "teszt_felhasznalo"
  },
  "sharedUsers": [
    {
      "user": {
        "_id": "67be04f22fe174af05ee6d10",
        "username": "user3"
      },
      "permissionLevel": "edit"
    }
  ],
  "createdAt": "2024-02-03T12:00:00.000Z",
  "updatedAt": "2024-02-03T12:30:00.000Z"
}
```

**Hibalehetőségek:**
- 401 Unauthorized - Érvénytelen vagy hiányzó token
- 403 Forbidden - Nincs hozzáférés a listához
- 404 Not Found - A lista nem található
- 500 Internal Server Error - Szerver oldali hiba

### Új lista létrehozása
**Végpont:** `POST /api/lists`  
**Leírás:** Új bevásárlólista létrehozása  
**Jogosultság:** Autentikáció szükséges

**Kérés:**
```json
{
  "title": "Teszt bevásárlólista",
  "priority": 1,
  "products": [],
  "sharedUsers": "user3"
}
```

**Sikeres válasz (201 Created):**
```json
{
  "_id": "67be0526b2336cdada6ed6b7",
  "title": "Teszt bevásárlólista",
  "priority": 1,
  "products": [],
  "owner": "67be04f22fe174af05ee6d0d",
  "sharedUsers": [
    {
      "user": "67be04f22fe174af05ee6d10",
      "permissionLevel": "edit"
    }
  ],
  "createdAt": "2024-02-03T12:00:00.000Z",
  "updatedAt": "2024-02-03T12:00:00.000Z"
}
```

**Hibalehetőségek:**
- 400 Bad Request - Hiányzó kötelező mezők
- 401 Unauthorized - Érvénytelen vagy hiányzó token
- 500 Internal Server Error - Szerver oldali hiba

### Lista frissítése
**Végpont:** `PUT /api/lists/{listaId}`  
**Leírás:** Bevásárlólista adatainak frissítése  
**Jogosultság:** Autentikáció szükséges, a lista tulajdonosának vagy szerkesztési jogosultsággal rendelkező megosztott felhasználónak kell lenni

**Kérés:**
```json
{
  "title": "Frissített lista név",
  "priority": 2
}
```

**Sikeres válasz (200 OK):**
```json
{
  "_id": "67be0526b2336cdada6ed6b7",
  "title": "Frissített lista név",
  "priority": 2,
  "products": [/* termékek listája */],
  "owner": "67be04f22fe174af05ee6d0d",
  "sharedUsers": [/* megosztott felhasználók */],
  "createdAt": "2024-02-03T12:00:00.000Z",
  "updatedAt": "2024-02-03T13:00:00.000Z"
}
```

**Hibalehetőségek:**
- 400 Bad Request - Érvénytelen adatok
- 401 Unauthorized - Érvénytelen vagy hiányzó token
- 403 Forbidden - Nincs szerkesztési jogosultság
- 404 Not Found - A lista nem található
- 500 Internal Server Error - Szerver oldali hiba

### Lista törlése
**Végpont:** `DELETE /api/lists/{listaId}`  
**Leírás:** Bevásárlólista törlése  
**Jogosultság:** Autentikáció szükséges, csak a lista tulajdonosa törölheti

**Kérés:** Nincs szükség kérés törzsre

**Sikeres válasz (200 OK):**
```json
{
  "message": "Lista sikeresen törölve"
}
```

**Hibalehetőségek:**
- 401 Unauthorized - Érvénytelen vagy hiányzó token
- 403 Forbidden - Nincs törlési jogosultság (nem a tulajdonos)
- 404 Not Found - A lista nem található
- 500 Internal Server Error - Szerver oldali hiba

### Lista megosztása
**Végpont:** `POST /api/lists/{listaId}/share`  
**Leírás:** Bevásárlólista megosztása egy másik felhasználóval  
**Jogosultság:** Autentikáció szükséges, csak a lista tulajdonosa oszthatja meg

**Kérés:**
```json
{
  "username": "user10",
  "permissionLevel": "view"
}
```
**Megjegyzés:** A `permissionLevel` értéke lehet "view" (csak olvasás) vagy "edit" (szerkesztés)

**Sikeres válasz (200 OK):**
```json
{
  "message": "Lista sikeresen megosztva",
  "list": {
    "_id": "67be0526b2336cdada6ed6b7",
    "title": "Frissített lista név",
    "sharedUsers": [
      {
        "user": {
          "_id": "67be04f22fe174af05ee6d15",
          "username": "user10"
        },
        "permissionLevel": "view"
      },
      // ... többi megosztott felhasználó
    ]
  }
}
```

**Hibalehetőségek:**
- 400 Bad Request - Hiányzó felhasználónév vagy érvénytelen jogosultsági szint
- 401 Unauthorized - Érvénytelen vagy hiányzó token
- 403 Forbidden - Nincs megosztási jogosultság (nem a tulajdonos)
- 404 Not Found - A lista vagy a felhasználó nem található
- 409 Conflict - A lista már meg van osztva a felhasználóval
- 500 Internal Server Error - Szerver oldali hiba

### Megosztás visszavonása
**Végpont:** `DELETE /api/lists/{listaId}/unshare`  
**Leírás:** Lista megosztásának visszavonása egy felhasználótól  
**Jogosultság:** Autentikáció szükséges, csak a lista tulajdonosa vonhatja vissza a megosztást

**Kérés:**
```json
{
  "userId": "67be04f22fe174af05ee6d0d"
}
```

**Sikeres válasz (200 OK):**
```json
{
  "message": "Lista megosztás sikeresen visszavonva"
}
```

**Hibalehetőségek:**
- 400 Bad Request - Hiányzó felhasználó azonosító
- 401 Unauthorized - Érvénytelen vagy hiányzó token
- 403 Forbidden - Nincs jogosultság (nem a tulajdonos)
- 404 Not Found - A lista nem található vagy nincs megosztva a felhasználóval
- 500 Internal Server Error - Szerver oldali hiba

### Termék hozzáadása listához
**Végpont:** `POST /api/lists/{listaId}/products`  
**Leírás:** Új termék hozzáadása egy bevásárlólistához  
**Jogosultság:** Autentikáció szükséges, a lista tulajdonosának vagy szerkesztési jogosultsággal rendelkező megosztott felhasználónak kell lenni

**Kérés:**
```json
{
  "catalogItem": "67b4ccc82de718b6120e5245",
  "quantity": 3,
  "unit": "l",
  "notes": "Megjegyzés a termékhez"
}
```

**Sikeres válasz (201 Created):**
```json
{
  "message": "Termék sikeresen hozzáadva",
  "product": {
    "_id": "67be0526b2336cdada6ed6b9",
    "catalogItem": {
      "_id": "67b4ccc82de718b6120e5245",
      "name": "Tej",
      "categoryHierarchy": ["Élelmiszerek", "Tejtermékek"],
      "defaultUnit": "l"
    },
    "quantity": 3,
    "unit": "l",
    "isPurchased": false,
    "notes": "Megjegyzés a termékhez"
  }
}
```

**Hibalehetőségek:**
- 400 Bad Request - Hiányzó kötelező mezők vagy érvénytelen adatok
- 401 Unauthorized - Érvénytelen vagy hiányzó token
- 403 Forbidden - Nincs szerkesztési jogosultság
- 404 Not Found - A lista vagy a katalógus elem nem található
- 500 Internal Server Error - Szerver oldali hiba

### Termék törlése listából
**Végpont:** `DELETE /api/lists/{listaId}/products/{termékId}`  
**Leírás:** Termék törlése egy bevásárlólistából  
**Jogosultság:** Autentikáció szükséges, a lista tulajdonosának vagy szerkesztési jogosultsággal rendelkező megosztott felhasználónak kell lenni

**Kérés:** Nincs szükség kérés törzsre

**Sikeres válasz (200 OK):**
```json
{
  "message": "Termék sikeresen törölve a listából"
}
```

**Hibalehetőségek:**
- 401 Unauthorized - Érvénytelen vagy hiányzó token
- 403 Forbidden - Nincs szerkesztési jogosultság
- 404 Not Found - A lista vagy a termék nem található
- 500 Internal Server Error - Szerver oldali hiba

### Termék frissítése listában
**Végpont:** `PUT /api/lists/{listaId}/products/{termékId}`  
**Leírás:** Termék adatainak frissítése egy bevásárlólistában  
**Jogosultság:** Autentikáció szükséges, a lista tulajdonosának vagy szerkesztési jogosultsággal rendelkező megosztott felhasználónak kell lenni

**Kérés:**
```json
{
  "quantity": 5,
  "isPurchased": true,
  "notes": "Frissített megjegyzés"
}
```

**Sikeres válasz (200 OK):**
```json
{
  "message": "Termék sikeresen frissítve",
  "product": {
    "_id": "67be0526b2336cdada6ed6b8",
    "catalogItem": {
      "_id": "67b4ccc82de718b6120e5245",
      "name": "Tej",
      "categoryHierarchy": ["Élelmiszerek", "Tejtermékek"],
      "defaultUnit": "l"
    },
    "quantity": 5,
    "unit": "l",
    "isPurchased": true,
    "notes": "Frissített megjegyzés"
  }
}
```

**Hibalehetőségek:**
- 400 Bad Request - Érvénytelen adatok
- 401 Unauthorized - Érvénytelen vagy hiányzó token
- 403 Forbidden - Nincs szerkesztési jogosultság
- 404 Not Found - A lista vagy a termék nem található
- 500 Internal Server Error - Szerver oldali hiba

## Termékkatalógus

### Összes katalóguselem lekérése
**Végpont:** `GET /api/productCatalogs`  
**Leírás:** Az összes katalóguselem lekérése  
**Jogosultság:** Autentikáció szükséges

**Kérés:** Nincs szükség kérés törzsre
```json
{}
```

**Sikeres válasz (200 OK):**
```json
[
  {
    "_id": "67be5f355b7d4a909f52b129",
    "name": "Alma",
    "categoryHierarchy": ["Élelmiszerek", "Zöldségek és Gyümölcsök"],
    "defaultUnit": "db",
    "createdAt": "2024-02-03T12:00:00.000Z",
    "updatedAt": "2024-02-03T12:00:00.000Z"
  },
  {
    "_id": "67b4ccc82de718b6120e5245",
    "name": "Tej",
    "categoryHierarchy": ["Élelmiszerek", "Tejtermékek"],
    "defaultUnit": "l",
    "createdAt": "2024-02-02T10:00:00.000Z",
    "updatedAt": "2024-02-02T10:00:00.000Z"
  }
]
```

**Hibalehetőségek:**
- 401 Unauthorized - Érvénytelen vagy hiányzó token
- 500 Internal Server Error - Szerver oldali hiba

### Katalóguselem lekérése azonosító alapján
**Végpont:** `GET /api/productCatalogs/{katalógusElemId}`  
**Leírás:** Egy konkrét katalóguselem részleteinek lekérése  
**Jogosultság:** Autentikáció szükséges

**Kérés:** Nincs szükség kérés törzsre
```json
{}
```

**Sikeres válasz (200 OK):**
```json
{
  "_id": "67be5f355b7d4a909f52b129",
  "name": "Alma",
  "categoryHierarchy": ["Élelmiszerek", "Zöldségek és Gyümölcsök"],
  "defaultUnit": "db",
  "createdAt": "2024-02-03T12:00:00.000Z",
  "updatedAt": "2024-02-03T12:00:00.000Z"
}
```

**Hibalehetőségek:**
- 401 Unauthorized - Érvénytelen vagy hiányzó token
- 404 Not Found - A katalóguselem nem található
- 500 Internal Server Error - Szerver oldali hiba

### Katalóguselemek keresése
**Végpont:** `GET /api/productCatalogs/search?query={keresőkifejezés}`  
**Leírás:** Katalóguselemek keresése név vagy kategória alapján  
**Jogosultság:** Autentikáció szükséges

**Kérés:** Query paraméterként megadott keresőkifejezés (pl. "tej")
```json
{}
```

**Sikeres válasz (200 OK):**
```json
[
  {
    "_id": "67b4ccc82de718b6120e5245",
    "name": "Tej",
    "categoryHierarchy": ["Élelmiszerek", "Tejtermékek"],
    "defaultUnit": "l",
    "createdAt": "2024-02-02T10:00:00.000Z",
    "updatedAt": "2024-02-02T10:00:00.000Z"
  },
  {
    "_id": "67b4ccc82de718b6120e5246",
    "name": "Kakaós tej",
    "categoryHierarchy": ["Élelmiszerek", "Tejtermékek"],
    "defaultUnit": "l",
    "createdAt": "2024-02-02T10:00:00.000Z",
    "updatedAt": "2024-02-02T10:00:00.000Z"
  }
]
```

**Hibalehetőségek:**
- 401 Unauthorized - Érvénytelen vagy hiányzó token
- 500 Internal Server Error - Szerver oldali hiba

### Új katalóguselem létrehozása
**Végpont:** `POST /api/productCatalogs`  
**Leírás:** Új elem hozzáadása a termékkatalógushoz  
**Jogosultság:** Autentikáció szükséges, adminisztrátor jogosultság szükséges

**Kérés:**
```json
{
  "name": "Túró Rudi",
  "categoryHierarchy": ["Élelmiszerek", "Tejtermékek"],
  "defaultUnit": "db"
}
```

**Sikeres válasz (201 Created):**
```json
{
  "_id": "67be5f355b7d4a909f52b130",
  "name": "Túró Rudi",
  "categoryHierarchy": ["Élelmiszerek", "Tejtermékek"],
  "defaultUnit": "db",
  "createdAt": "2024-02-03T14:00:00.000Z",
  "updatedAt": "2024-02-03T14:00:00.000Z"
}
```

**Hibalehetőségek:**
- 400 Bad Request - Hiányzó kötelező mezők vagy érvénytelen adatok
- 401 Unauthorized - Érvénytelen vagy hiányzó token
- 403 Forbidden - Nincs adminisztrátori jogosultság
- 409 Conflict - Már létezik ilyen nevű katalóguselem
- 500 Internal Server Error - Szerver oldali hiba

### Katalóguselem frissítése
**Végpont:** `PUT /api/productCatalogs/{katalógusElemId}`  
**Leírás:** Katalóguselem adatainak frissítése  
**Jogosultság:** Autentikáció szükséges, adminisztrátor jogosultság szükséges

**Kérés:**
```json
{
  "name": "Alma",
  "categoryHierarchy": ["Élelmiszerek", "Zöldségek és Gyümölcsök"],
  "defaultUnit": "db"
}
```

**Sikeres válasz (200 OK):**
```json
{
  "_id": "67be5f355b7d4a909f52b129",
  "name": "Alma",
  "categoryHierarchy": ["Élelmiszerek", "Zöldségek és Gyümölcsök"],
  "defaultUnit": "db",
  "createdAt": "2024-02-03T12:00:00.000Z",
  "updatedAt": "2024-02-03T15:00:00.000Z"
}
```

**Hibalehetőségek:**
- 400 Bad Request - Érvénytelen adatok
- 401 Unauthorized - Érvénytelen vagy hiányzó token
- 403 Forbidden - Nincs adminisztrátori jogosultság
- 404 Not Found - A katalóguselem nem található
- 409 Conflict - Már létezik ilyen nevű katalóguselem
- 500 Internal Server Error - Szerver oldali hiba

### Katalóguselem törlése
**Végpont:** `DELETE /api/productCatalogs/{katalógusElemId}`  
**Leírás:** Katalóguselem törlése  
**Jogosultság:** Autentikáció szükséges, adminisztrátor jogosultság szükséges

**Kérés:** Nincs szükség kérés törzsre

**Sikeres válasz (200 OK):**
```json
{
  "message": "Katalóguselem sikeresen törölve"
}
```

**Hibalehetőségek:**
- 401 Unauthorized - Érvénytelen vagy hiányzó token
- 403 Forbidden - Nincs adminisztrátori jogosultság
- 404 Not Found - A katalóguselem nem található
- 500 Internal Server Error - Szerver oldali hiba

## Termékek

### Összes termék lekérése
**Végpont:** `GET /api/products`  
**Leírás:** Az összes termék lekérése (globális termékadatbázis)  
**Jogosultság:** Autentikáció szükséges

**Kérés:** Nincs szükség kérés törzsre
```json
{}
```

**Sikeres válasz (200 OK):**
```json
[
  {
    "_id": "67be63ef01cb05697fd5d4b0",
    "name": "Tej 2,8%",
    "brand": "Mizo",
    "category": "Tejtermék",
    "barcode": "5998200431742",
    "createdAt": "2024-02-03T12:00:00.000Z",
    "updatedAt": "2024-02-03T12:00:00.000Z"
  }
]
```

**Hibalehetőségek:**
- 401 Unauthorized - Érvénytelen vagy hiányzó token
- 500 Internal Server Error - Szerver oldali hiba

## Admin funkciók

### Összes felhasználó lekérése
**Végpont:** `GET /api/admin/users`  
**Leírás:** Az összes regisztrált felhasználó lekérése adminisztrátorok számára  
**Jogosultság:** Autentikáció szükséges, adminisztrátor jogosultság szükséges

**Kérés:** Nincs szükség kérés törzsre
```json
{}
```

**Sikeres válasz (200 OK):**
```json
[
  {
    "_id": "67be04f22fe174af05ee6d0d",
    "username": "teszt_felhasznalo",
    "email": "teszt@example.com",
    "role": "user",
    "createdAt": "2024-02-03T10:00:00.000Z"
  },
  {
    "_id": "67be63ef01cb05697fd5d4b1",
    "username": "admin_user",
    "email": "admin@example.com",
    "role": "admin",
    "createdAt": "2024-02-02T09:00:00.000Z"
  }
]
```

**Hibalehetőségek:**
- 401 Unauthorized - Érvénytelen vagy hiányzó token
- 403 Forbidden - Nincs adminisztrátori jogosultság
- 500 Internal Server Error - Szerver oldali hiba

### Felhasználó előléptetése adminisztrátorrá
**Végpont:** `POST /api/admin/promote/{felhasználóId}`  
**Leírás:** Egy felhasználó előléptetése adminisztrátori jogosultságúvá  
**Jogosultság:** Autentikáció szükséges, adminisztrátor jogosultság szükséges

**Kérés:** Nincs szükség kérés törzsre
```json
{}
```

**Sikeres válasz (200 OK):**
```json
{
  "message": "Felhasználó adminná téve."
}
```

**Hibalehetőségek:**
- 401 Unauthorized - Érvénytelen vagy hiányzó token
- 403 Forbidden - Nincs adminisztrátori jogosultság
- 404 Not Found - A felhasználó nem található
- 500 Internal Server Error - Szerver oldali hiba
