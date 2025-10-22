/** Imports */
// env
import dotenv from 'dotenv';
dotenv.config();

// node
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// db
import { initDb } from './db/db.js';

// server
import { startHttpsServer, startHttpRedirect } from './server/transport.js';
import { getEnvInt, getEnvBool, getEnv } from './utils/env.js';

// routes
import inventoryRouter from './routes/inventory.route.js';
import customersRouter from './routes/customers.route.js';
import ordersRouter from './routes/orders.route.js';
import financialsRouter from './routes/financials.route.js';

// security
import { securityHeaders } from './middleware/securityHeaders.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// init app obj
const app = express();
app.use(express.json());

// begin use routers, middleware, etc
app.use(securityHeaders);

app.use('/api/inventory', inventoryRouter);
app.use('/api/customers', customersRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/financials', financialsRouter);

// Read typed config
const HTTP_PORT = getEnvInt('PORT', 3000);
const HTTPS_PORT = getEnvInt('HTTPS_PORT', 3443);
const USE_HTTPS = getEnvBool('USE_HTTPS', true);

// Certificate paths (fall back to files next to server if not set)
const KEY_PATH = getEnv('SSL_KEY_PATH', path.join(__dirname, '..', 'certs', 'localhost+2-key.pem'));
const CERT_PATH = getEnv('SSL_CERT_PATH', path.join(__dirname, '..', 'certs', 'localhost+2.pem'));

// DB file (used by db.ts)
process.env.DB_FILE = getEnv('DB_FILE', path.join(__dirname, '..', 'pizza.db'));

await initDb();

if (USE_HTTPS) {
    startHttpsServer({
        app,
        httpsPort: HTTPS_PORT,
        keyPath: KEY_PATH,
        certPath: CERT_PATH,        
        minVersion: 'TLSv1.2'
    });
    startHttpRedirect(HTTP_PORT, HTTPS_PORT); // for quality of life
} else {
    app.listen(HTTP_PORT, () => console.log(`HTTP only -> http://localhost:${HTTP_PORT}`));
}



// // Server error handling
// server.on('error', (error) => {
//     console.error('Server error', error);
// });
