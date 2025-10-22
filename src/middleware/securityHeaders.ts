import { Request, Response, NextFunction } from 'express';


// Security options

export function securityHeaders(_req: Request, res: Response, next: NextFunction): void {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Uncomment only if you're sure (browsers cache HSTS for a long time)
    // res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    // res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
}