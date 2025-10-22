import { Router, Request, Response } from 'express';

const router = Router();

// router.get('/api/p_and_l', async (_req: Request, res: Response) => {
//     const db = getDb();
//     const pAndL = await db.all(`
//         SELECT revenue_cents, profit_cents, losses_cents FROM p_and_l WHERE id=1`
//     );
//     res.json(pAndL ?? { revenue_cents: 0, profit_cents: 0, losses_cents: 0 });
// });


export default router;