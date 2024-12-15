### Környezeti Változók Beállítása
1. Másolja le a `.env.example` fájlt `.env` néven:
   ```bash
   cp .env.example .env
   ```
2. Módosítsa a `.env` fájl tartalmát a saját környezetének megfelelően:
   - `MONGO_URI`: MongoDB kapcsolódási URL (connection string) pl.: mongodb://127.0.0.1:27017
   - `JWT_SECRET`: Egyedi titkos kulcs a JWT tokenek aláírásához (bármi lehet ami komplex)
   - `PORT`: A backend szerver portja (alapértelmezett: 5000)
   - `HOST`: A backend szerver ip címe amin hallgat
