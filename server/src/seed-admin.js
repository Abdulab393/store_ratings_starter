import 'dotenv/config';
import db from './db.js';
import bcrypt from 'bcryptjs';

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.SEED_ADMIN_PASSWORD || 'Admin@1234';
  const name = 'System Administrator Seed User';
  const address = 'Seed Address, City, Country';

  const exists = await db.oneOrNone('SELECT 1 FROM users WHERE email=$1', [email]);
  if (exists) {
    console.log('Admin already exists');
    process.exit(0);
  }
  const hash = await bcrypt.hash(password, 12);
  await db.none(
    `INSERT INTO users (name, email, address, role, password_hash) VALUES ($1,$2,$3,'ADMIN',$4)`,
    [name, email, address, hash]
  );
  console.log('Admin created:', email, 'password:', password);
  process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
