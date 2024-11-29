### Környezeti Változók Beállítása
1. Másolja le a `.env.example` fájlt `.env` néven:
   ```bash
   cp .env.example .env
   ```
2. Módosítsa a `.env` fájl tartalmát a saját környezetének megfelelően:
   - `MONGO_URI`: MongoDB kapcsolódási URL (connection string)
   - `JWT_SECRET`: Egyedi titkos kulcs a JWT tokenek aláírásához
   - `PORT`: A backend szerver portja (alapértelmezett: 5000)
