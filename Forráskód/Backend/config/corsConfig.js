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

const corsConfig = {
    origin: function (origin, callback) {
        // Allow requests with no origin (desktop apps, mobile apps)
        if (!origin) {
            return callback(null, true);
        }

        // Allow requests from web frontend
        if (ALLOWED_ORIGINS.indexOf(origin) !== -1) {
            return callback(null, true);
        }

        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = corsConfig;

// importáljuk a server.js-be: