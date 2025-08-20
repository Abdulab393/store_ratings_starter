-- PostgreSQL schema
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('ADMIN', 'USER', 'OWNER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS users (
  id            BIGSERIAL PRIMARY KEY,
  name          VARCHAR(60) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  address       VARCHAR(400),
  role          user_role NOT NULL DEFAULT 'USER',
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stores (
  id            BIGSERIAL PRIMARY KEY,
  name          VARCHAR(60) NOT NULL,
  email         VARCHAR(255) UNIQUE,
  address       VARCHAR(400),
  owner_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ratings (
  id         BIGSERIAL PRIMARY KEY,
  user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_id   BIGINT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  rating     INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, store_id)
);

CREATE OR REPLACE VIEW store_rating_stats AS
SELECT
  s.id AS store_id,
  COUNT(r.id) AS rating_count,
  COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0) AS average_rating
FROM stores s
LEFT JOIN ratings r ON r.store_id = s.id
GROUP BY s.id;

CREATE INDEX IF NOT EXISTS idx_users_name ON users (name);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);

CREATE INDEX IF NOT EXISTS idx_stores_name ON stores (name);
CREATE INDEX IF NOT EXISTS idx_stores_address ON stores (address);
