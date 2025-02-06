# Adatbázis Fejlesztési Terv - Lépésről Lépésre

### 1. Hiányzó Modelljeink Kialakítása

- **Lista modell bővítése**:
  - Versioning a valós idejű szinkronizációhoz
  - SharedUsers tömb referenciákkal
  - LastModified timestamp
  - Soft delete flag

- **Termék katalógus**:
  - Standardizált terméknevek
  - Kategóriafa struktúra
  - Vonalkód/termékazonosító

- **AuditLog modell**:
  - User reference
  - Művelet típusa
  - Timestamp
  - IP cím/device info

### 2. Kapcsolati Modell Finomhangolása

- **N-M kapcsolatok**:
  - User ↔ Lista (tulajdonjogok)
  - Lista ↔ Termék (elemek)
  - Termék ↔ Kategória (besorolás)

- **Beágyazott dokumentumok**:
  - Listaelemek beágyazva a Lista dokumentumba
  - Gyakran változó adatok külön kollekcióban

### 3. Teljesítményoptimalizálás (development.md 54-56. sorok)

- **Indexelési stratégia**:
  - Lista neve + tulajdonos kombinált index
  - Terméknév teljes szöveges keresés
  - Keresési mezőkre compound indexek

- **Particionálás**:
  - Aktív/inaktív listák külön kollekciókban
  - Idősoros adatok shardolása

### 4. Biztonsági Réteg Kialakítása

- **Titkosított mezők**:
  - Felhasználó személyes adatai
  - Megosztási linkek

- **RBAC implementáció**:
  - Szerepkör alapú hozzáférés
  - Lista szintű engedélyek

### 5. Valós Idejű Szinkronizáció

- **WebSocket események**:
  - Lista változás követése
  - Operációs transzformáció támogatása
  - Konfliktus feloldási mechanizmus

### 6. Migrációs Terv

- **Verziózott séma változtatások**:
  - Mongoose migration szkriptek
  - Backward kompatibilitás
  - Adatátviteli stratégiák

### 7. Tesztelési Stratégia

- **Teszt adatgenerálás**:
  - 10k felhasználó
  - 100k lista
  - 1M lista elem

- **Teljesítménytesztek**:
  - Terheléses tesztek
  - Concurrent write szimuláció

### 8. Dokumentáció Frissítése


- **Swagger bővítés**:
  - Új végpontok dokumentálása
  - Séma referencia hozzáadása
  - Példa kérések/válaszok

### Implementációs Prioritások:

1. **Alapmodell kialakítása** (2-3 nap)
   - Lista és Termék sémák
   - Kapcsolati struktúra

2. **Biztonsági réteg** (1-2 nap)
   - Titkosítás
   - Audit log

3. **Teljesítményoptimalizálás** (3-4 nap)
   - Indexelés
   - Particionálás

4. **Valós idejű szinkronizáció** (4-5 nap)
   - WebSocket integráció
   - Konfliktuskezelés

5. **Tesztelés és dokumentáció** (2-3 nap)
   - E2E tesztek
   - API dokumentáció kiegészítése


### Fontos Megvalósítási Részletek

1. **Kapcsolatok Kezelése**
   - Lista ↔ User: N-M kapcsolat (tulajdonos + megosztott felhasználók)
   - Lista ↔ Termék: 1-N kapcsolat beágyazott dokumentumokkal

2. **Verziókezelés**
   - `version` mező a valós idejű szinkronizációhoz (WebSocket eseményeknél használandó)

3. **Soft Delete**
   - `deleted` flag a listák archiválásához (nem fizikai törlés)

4. **Indexelési Stratégia**
   - Gyakran keresett mezőkre (pl. owner, sharedUsers)
   - Teljes szöveges keresés a terméknevekhez

### 1. Következő Lépések

1. **Adatbázis Migráció** (ha már van éles adat)
   - Alapértelmezett listák létrehozása
   - Tesztadatok generálása

2. **API Végpontok** (tervezés.md 28-32. sorok)

3. **WebSocket Integráció** (tervezés.md 21. sor)

4. **Tesztelés**
   - Unit tesztek a modellekhez
   - E2E tesztek a lista műveletekhez

### 5. Figyelmeztetések

- A termék katalógus esetén érdemes külön kollekcióban tárolni a gyakran változó adatokat
- A lista elemek beágyazása optimalizálja a lekérdezéseket, de korlátozza a egyedi műveleteket