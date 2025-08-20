import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../auth.js';

const r = Router();

r.get('/', requireAuth, async (req, res) => {
  const { q = '', sort = 'name', order = 'asc', limit = 10, offset = 0 } = req.query;
  const sortCols = { name: 's.name', rating: 'v.average_rating' };
  const sortCol = sortCols[sort] || 's.name';
  const ord = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  const rows = await db.any(
    `
    SELECT
      s.id, s.name, s.address,
      COALESCE(v.average_rating, 0)::float AS overall_rating,
      ur.rating AS user_rating
    FROM stores s
    LEFT JOIN store_rating_stats v ON v.store_id = s.id
    LEFT JOIN ratings ur ON ur.store_id = s.id AND ur.user_id = $3
    WHERE ($1 = '' OR s.name ILIKE '%'||$1||'%' OR s.address ILIKE '%'||$1||'%')
    ORDER BY ${sortCol} ${ord}
    LIMIT $4 OFFSET $5
    `,
    [q, sort, req.user.id, +limit, +offset]
  );
  res.json(rows);
});

r.post('/:id/ratings', requireAuth, async (req, res) => {
  const storeId = +req.params.id;
  const { rating } = req.body;
  if (!(Number.isInteger(rating) && rating >= 1 && rating <= 5)) {
    return res.status(400).json({ error: 'Rating must be 1–5' });
  }
  const row = await db.one(
    `INSERT INTO ratings (user_id, store_id, rating)
     VALUES ($1,$2,$3)
     ON CONFLICT (user_id, store_id)
     DO UPDATE SET rating=EXCLUDED.rating, updated_at=NOW()
     RETURNING id, user_id, store_id, rating`,
    [req.user.id, storeId, rating]
  );
  res.json(row);
});

export default r;
