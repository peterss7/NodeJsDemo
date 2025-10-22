import { Router, Request, Response } from 'express';
// import { getDb } from '../db/db.js';

const router = Router();


// router.get('/api/inventory', async (_req: Request, res: Response) => {
//     const db = getDb();
//     const items = await db.all(`
//         SELECT * FROM inventory ORDER BY sku`
//     );
//     res.json(items);
// });

export default router;