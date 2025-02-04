/* CORS beállítások:
 * 
 * Csak a frontend alkalmazás domain-jéről fogad el kéréseket
 * Meghatározza az engedélyezett HTTP metódusokat
 * Kezeli a preflight kéréseket
 */
const ALLOWED_ORIGINS = [
    'http://localhost:3000', // TODO: Ezt majd módosítani kell
    `http://${process.env.FRONTEND_IP}:3000`
];

module.exports = {
    origin: ALLOWED_ORIGINS,
    credentials: true, // engedélyezi a hitelesített kéréseket
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // engedélyezett HTTP metódusok
    allowedHeaders: ['Content-Type', 'Authorization'] // engedélyezett fejlécek
};

// importáljuk a server.js-be: