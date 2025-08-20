import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import { validateUserSignup, passwordRegex } from '../validators.js';
import { requireAuth } from '../auth.js';

const r = Router();

r.post('/signup', async (req, res) => {
  const errors = validateUserSignup(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const { name, email, address, password } = req.body;
  const existing = await db.oneOrNone('SELECT id FROM users WHERE email=$1', [email]);
  if (existing) return res.status(409).json({ error: 'Email already exists' });

  const hash = await bcrypt.hash(password, 12);
  const user = await db.one(
    `INSERT INTO users (name, email, address, role, password_hash)
     VALUES ($1,$2,$3,'USER',$4) RETURNING id, name, email, address, role`,
    [name, email, address, hash]
  );
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user });
});

r.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const u = await db.oneOrNone('SELECT * FROM users WHERE email=$1', [email]);
  if (!u) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, u.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: u.id, role: u.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  const { password_hash, ...user } = u;
  res.json({ token, user });
});

r.post('/change-password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({ error: 'New password fails policy' });
  }
  const u = await db.one('SELECT * FROM users WHERE id=$1', [req.user.id]);
  const ok = await bcrypt.compare(currentPassword, u.password_hash);
  if (!ok) return res.status(400).json({ error: 'Current password is incorrect' });
  const hash = await bcrypt.hash(newPassword, 12);
  await db.none('UPDATE users SET password_hash=$1, updated_at=NOW() WHERE id=$2', [hash, req.user.id]);
  res.json({ success: true });
});

export default r;
