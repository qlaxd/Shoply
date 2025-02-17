# Frontend Implementációs Terv - Bevásárlólista Alkalmazás

## 1. Felhasználói Felület (UI) Kialakítása

### 1.1 Lista Komponens

**Funkció**:
  - Listák megjelenítése
  - Új lista létrehozása
  - Lista szerkesztése
  - Lista törlése


**Elemek:**
- Lista fejléc (név, tulajdonos, megosztott felhasználók)
- Verziószám és utolsó módosítás időbélyege
- Terméklista (beágyazott dokumentumok)
- Akció gombok (új elem, megosztás, archiválás)
- Valós idejű szerkesztési indikátor

**Megjelenítés:**

```tsx
<ListContainer>
<ListHeader>
<Title>{listaNev}</Title>
<Badge>Verzió: {version}</Badge>
<ShareButton onClick={handleShare} />
</ListHeader>
<ItemsList>
{elemek.map((elem) => (
<ProductItem key={elem.id} product={elem} />
))}
</ItemsList>
<ListFooter>
<AddItemForm onAdd={handleAddItem} />
</ListFooter>
</ListContainer>
```


### 1.2 Termék Komponens
**Tulajdonságok:**
- Terméknév és kategória
- Mennyiség és mértékegység
- Vásárlási státusz (checkbox)
- Vonalkód/azonosító
- Szerkesztés/törlés gombok

**Interakciók:**
```tsx
<ProductItem>
<StatusCheckbox checked={megveve} onChange={handleToggle} />
<ProductName>{nev}</ProductName>
<CategoryBadge>{kategoria}</CategoryBadge>
<Quantity>{mennyiseg} {mertekegyseg}</Quantity>
<ActionButtons>
<EditButton onClick={openEditor} />
<DeleteButton onClick={handleDelete} />
</ActionButtons>
</ProductItem>
```

## 2. Backend Kommunikáció

### 2.1 API Végpontok

**Fontos végpontok:**
| Metódus | Végpont                | Leírás                     |
|---------|------------------------|---------------------------|
| GET     | /api/lists             | Aktív listák lekérdezése  |
| POST    | /api/lists             | Új lista létrehozása      |
| PUT     | /api/lists/:id         | Lista frissítése          |
| DELETE  | /api/lists/:id         | Soft delete               |
| GET     | /api/products/search   | Termékkeresés             |

### 2.2 Adatátviteli Logika
- **JWT token** használata minden kérésnél
- **Optimistic UI updates**: lokális állapot frissítés azonnal, szerver válasz utáni szinkronizálás
- **Batching**: több változtatás együtt küldése WebSocket-en keresztül

## 3. Valós Idejű Szinkronizáció

### 3.1 WebSocket Architektúra

**Mechanizmusok:**
1. Kezdeti állapot lekérése REST API-ról
2. WebSocket kapcsolat létesítése
3. Operációs Transzformáció (OT) konfliktusfeloldáshoz
4. Verziószám alapú változáskövetés

**Eseménytípusok:**
- `LIST_UPDATED`
- `ITEM_ADDED` 
- `ITEM_MODIFIED`
- `ITEM_REMOVED`
- `CONFLICT_DETECTED`

## 4. Adatbázis Modellek

### 4.1 Fő Entitások

**Lista Modell:**
```tsx
interface List {
id: ObjectId;
name: string;
owner: ObjectId; // User referencia
sharedUsers: ObjectId[];
items: Product[]; // Beágyazott dokumentumok
version: number;
lastModified: Date;
deleted: boolean;
}
```

**Termék Modell:**
```tsx
interface Product {
id: ObjectId;
name: string;
category: string | ObjectId;
quantity: number;
unit: string;
status: boolean;
barcode?: string;
notes?: string;
}
```

### 4.2 Kapcsolatok és Indexelés
- **Lista ↔ User**: N-M kapcsolat (tulajdonos + megosztottak)
- **Lista ↔ Termék**: 1-N beágyazott kapcsolat
- **Indexek**: 
  - `{ owner: 1, name: 1 }` (kombinált)
  - `{ "items.name": "text" }` (teljes szöveges keresés)

## 5. Főbb Kihívások és Megoldások

1. **Konfliktuskezelés**
   - Operációs Transzformáció implementáció
   - Verziószám ellenőrzés minden változtatásnál
   - Felhasználói visszajelzés konfliktus esetén

2. **Teljesítményoptimalizálás**
   - Debounced mentési mechanizmus
   - Listaelemek lazy loadolása
   - Lokális cache (Redux/Context API)

3. **Biztonság**
   - Lista szintű RBAC (olvasó/szerkesztő/tulajdonos)
   - Titkosított adattovábbítás (TLS 1.3)
   - Audit log minden kritikus művelethez

## 6. Architektúra Diagram

[Frontend] ↔ [WebSocket] ↔ [Backend] ↔ [MongoDB]
│ │ │
│ │ └── Valós idejű események
│ │
└── REST API ──── CRUD műveletek


**Kulcs technológiák:**
- React + TypeScript (UI)
- Socket.io (valós idejű kommunikáció)
- JWT + RBAC (biztonság)
- MongoDB Change Streams (adatbázis szintű változáskövetés)

## 7. Implementációs Lépések

1. Alap komponensek kialakítása (2 nap)
2. REST API integráció (3 nap)
3. WebSocket kommunikáció (4 nap)
4. Konfliktuskezelés (3 nap)
5. Tesztelés és finomhangolás (2 nap)

**Ajánlott könyvtárak:**
- `react-query` adatkezeléshez
- `yjs` valós idejű kollaborációhoz
- `immer` immutábilis állapotkezeléshez