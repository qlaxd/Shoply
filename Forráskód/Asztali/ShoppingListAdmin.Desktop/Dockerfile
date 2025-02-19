# Alap kép használata
FROM node:16

# Munkakönyvtár beállítása
WORKDIR /app

# package.json és package-lock.json másolása
COPY package*.json ./

# A függõségek telepítése
RUN npm install

# Az alkalmazás forráskódjának másolása
COPY . .

# Az alkalmazás portjának nyitása
EXPOSE 3000

# Az alkalmazás indítása
CMD ["npm", "start"]
