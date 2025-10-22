import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import type express from 'express';

export interface HttpsOptions {
    app: express.Express;
    httpsPort: number;
    keyPath: string;
    certPath: string;
    minVersion: string;
}

export function startHttpRedirect(httpPort: number, httpsPort: number): http.Server {
    // redirect HTTP to HTTPS
    const httpServer = http.createServer((req, res) => {
        const host = req.headers.host?.split(':')[0] ?? 'localhost';
        res.statusCode = 301;
        res.setHeader('Location', `https://${host}:${httpsPort}${req.url ?? '/'}`);
        res.end();
    });
    httpServer.listen(httpPort, () => {
        console.log(`HTTP  -> http://localhost:${httpPort} (redirects to HTTPS)`);
    });
    return httpServer;
}

export function startHttpsServer(opts: HttpsOptions): https.Server {
    const { app, httpsPort, keyPath, certPath } = opts;

    const sslOptions: https.ServerOptions = {
        key: fs.readFileSync(path.resolve(keyPath)),
        cert: fs.readFileSync(path.resolve(certPath)),
    };

    const httpsServer = https.createServer(sslOptions, app);
    httpsServer.on('error', (err) => console.error('HTTPS server error:', err));
    httpsServer.listen(httpsPort, () => {
        console.log(`HTTPS -> https://localhost:${httpsPort}`);
    });
    return httpsServer;
}