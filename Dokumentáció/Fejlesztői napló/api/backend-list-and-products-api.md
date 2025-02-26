# API Dokumentáció

## 1. Termékek kezelése

### 1.1 Összes termék lekérdezése
```http
GET /api/products
```

**Válasz példa:**
```json
[
  {
    "_id": "67b4ccce51bd774baa98b714",
    "catalogItem": {
      "_id": "67b4ccc82de718b6120e5245",
      "name": "Tej 2,8%",
      "category": ["Élelmiszerek", "Tejtermékek"],
      "defaultUnit": "l"
    },
    "quantity": 1,
    "isPurchased": false
  }
]
```

### 1.2 Egy termék lekérdezése
```http
GET /api/products/:id
```

**Paraméterek:**
- `id` - Termék egyedi azonosítója

**Válasz példa:**
```json
{
  "_id": "67b4ccce51bd774baa98b714",
  "catalogItem": {
    "_id": "67b4ccc82de718b6120e5245",
    "name": "Tej 2,8%",
    "category": ["Élelmiszerek", "Tejtermékek"],
    "defaultUnit": "l"
  },
  "quantity": 1,
  "isPurchased": false
}
```

### 1.3 Új termék létrehozása
```http
POST /api/products
```

**Request body példa:**
```json
{
  "catalogItem": "67b4ccc82de718b6120e5245",
  "quantity": 3
}
```

## 2. Listák kezelése

### 2.1 Lista megosztása
```http
POST /api/lists/id/share
```
- ':id' -  fontos hogy a kérés headerjében az Authorization: Bearer <JWT_TOKEN> az annak a usernek a tokenje legyen aki a lista ownerje, mert különben hozzáférés megtagadva

**Request body példa:**
```json
{
  "userId": "67a253a4deaf2909247feb7d",
  "permissionLevel": "edit"
}
```

**Sikeres válasz:**
```json
{
  "sharedWith": [
    {
      "user": "67a253a4deaf2909247feb7d",
      "permissionLevel": "edit",
      "_id": "67b4d3a4deaf2909247feb7c"
    }
  ]
}
```

### 2.2 Lista lekérdezése
```http
GET /api/lists/:id
```

**Válasz példa:**
```json
{
  "_id": "67b4d3a4deaf2909247feb7c",
  "name": "Felhasználó bevásárlólistája",
  "products": [
    {
      "_id": "67b4ccce51bd774baa98b714",
      "catalogItem": {
        "name": "Tej 2,8%",
        "defaultUnit": "l"
      },
      "quantity": 2
    }
  ],
  "sharedWith": []
}
```

## 3. Autentikáció

**Fejléc formátum:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Példa curl kérés:**
```bash
curl -X GET "http://localhost:5000/api/products" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 4. Hibakódok
- `401 Unauthorized`: Érvénytelen vagy hiányzó token
- `403 Forbidden`: Nincs jogosultság a művelethez
- `404 Not Found`: Erőforrás nem található
- `500 Internal Server Error`: Szerverhiba

> **Fontos:** A teljes API specifikáció a kódbázisban található, a fentiek csak a legfontosabb végpontokat mutatják be. A pontos modellek és válaszstruktúrák a megfelelő model fájlokban találhatók.