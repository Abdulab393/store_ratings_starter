import { Router } from 'express';
import db from '../db.js';
import { requireAuth, requireRole } from '../auth.js';

const r = Router();
r.use(requireAuth, requireRole('OWNER'));

r.get('/store/ratings', async (req, res) => {
  const store = await db.oneOrNone('SELECT id FROM stores WHERE owner_user_id=$1', [req.user.id]);
  if (!store) return res.json([]);
  const rows = await db.any(
    `SELECT r.id, r.rating, r.created_at, u.id as user_id, u.name, u.email
     FROM ratings r
     JOIN users u ON u.id = r.user_id
     WHERE r.store_id=$1
     ORDER BY r.created_at DESC`, [store.id]
  );
  res.json(rows);
});

r.get('/store/average', async (req, res) => {
  const store = await db.oneOrNone('SELECT id FROM stores WHERE owner_user_id=$1', [req.user.id]);
  if (!store) return res.json({ averageRating: 0, ratingCount: 0 });
  const stats = await db.one('SELECT * FROM store_rating_stats WHERE store_id=$1', [store.id]);
  res.json({ averageRating: Number(stats.average_rating), ratingCount: Number(stats.rating_count) });
});

export default r;
