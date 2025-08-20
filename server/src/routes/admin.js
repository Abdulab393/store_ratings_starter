import { Router } from 'express';
import db from '../db.js';
import bcrypt from 'bcryptjs';
import { requireAuth, requireRole } from '../auth.js';

const r = Router();
r.use(requireAuth, requireRole('ADMIN'));

r.get('/dashboard', async (_req, res) => {
  const [{ count: totalUsers }]   = await db.any('SELECT COUNT(*) FROM users');
  const [{ count: totalStores }]  = await db.any('SELECT COUNT(*) FROM stores');
  const [{ count: totalRatings }] = await db.any('SELECT COUNT(*) FROM ratings');
  res.json({ totalUsers: +totalUsers, totalStores: +totalStores, totalRatings: +totalRatings });
});

r.get('/users', async (req, res) => {
  const { q = '', role, sort = 'name', order = 'asc', limit = 10, offset = 0 } = req.query;
  const sortCols = { name: 'u.name', email: 'u.email', role: 'u.role' };
  const ord = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  const rows = await db.any(
    `
    SELECT u.id, u.name, u.email, u.address, u.role
    FROM users u
    WHERE ($1='' OR u.name ILIKE '%'||$1||'%' OR u.email ILIKE '%'||$1||'%' OR u.address ILIKE '%'||$1||'%')
      AND ($2::text IS NULL OR u.role::text = $2::text)
    ORDER BY ${sortCols[sort] || 'u.name'} ${ord}
    LIMIT $3 OFFSET $4
    `, [q, role || None, +limit, +offset]
  );
  res.json(rows);
});

r.get('/users/:id', async (req, res) => {
  const u = await db.oneOrNone('SELECT id, name, email, address, role FROM users WHERE id=$1', [req.params.id]);
  if (!u) return res.status(404).json({ error: 'Not found' });
  if (u.role === 'OWNER') {
    const rating = await db.oneOrNone(
      `SELECT COALESCE(ROUND(AVG(r.rating)::numeric,2),0) AS rating
       FROM stores s LEFT JOIN ratings r ON r.store_id = s.id WHERE s.owner_user_id=$1`, [u.id]
    );
u.owner_rating = rating ? Number(rating.rating) : 0;
  }
  res.json(u);
});

r.post('/users', async (req, res) => {
  const { name, email, address, role = 'USER', password } = req.body;
  const exists = await db.oneOrNone('SELECT 1 FROM users WHERE email=$1', [email]);
  if (exists) return res.status(409).json({ error: 'Email exists' });
  const hash = await bcrypt.hash(password, 12);
  const user = await db.one(
    `INSERT INTO users (name, email, address, role, password_hash)
     VALUES ($1,$2,$3,$4,$5) RETURNING id, name, email, address, role`,
    [name, email, address, role, hash]
  );
  res.json(user);
});

r.get('/stores', async (req, res) => {
  const { q = '', sort = 'name', order = 'asc', limit = 10, offset = 0 } = req.query;
  const sortCols = { name: 's.name', email: 's.email', rating: 'v.average_rating' };
  const ord = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  const rows = await db.any(
    `
    SELECT s.id, s.name, s.email, s.address, COALESCE(v.average_rating,0)::float AS rating
    FROM stores s
    LEFT JOIN store_rating_stats v ON v.store_id = s.id
    WHERE ($1='' OR s.name ILIKE '%'||$1||'%' OR s.email ILIKE '%'||$1||'%' OR s.address ILIKE '%'||$1||'%')
    ORDER BY ${sortCols[sort] || 's.name'} ${ord}
    LIMIT $2 OFFSET $3
    `, [q, +limit, +offset]
  );
  res.json(rows);
});

r.post('/stores', async (req, res) => {
  const { name, email, address, ownerUserId } = req.body;
  const store = await db.one(
    `INSERT INTO stores (name, email, address, owner_user_id)
     VALUES ($1,$2,$3,$4)
     RETURNING id, name, email, address, owner_user_id`, [name, email, address, ownerUserId || null]
  );
  res.json(store);
});

export default r;
