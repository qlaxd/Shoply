# Alap k�p haszn�lata
FROM node:16

# Munkak�nyvt�r be�ll�t�sa
WORKDIR /app

# package.json �s package-lock.json m�sol�sa
COPY package*.json ./

# A f�gg�s�gek telep�t�se
RUN npm install

# Az alkalmaz�s forr�sk�dj�nak m�sol�sa
COPY . .

# Az alkalmaz�s portj�nak nyit�sa
EXPOSE 3000

# Az alkalmaz�s ind�t�sa
CMD ["npm", "start"]
