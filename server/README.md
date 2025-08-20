# Server setup

1) Copy `.env.example` to `.env` and edit values.
2) Create DB and run schema:
   - psql: `createdb store_ratings`
   - `psql store_ratings < sql/schema.sql`
3) Install deps: `npm i`
4) Seed admin: `npm run seed`
5) Run: `npm run dev` (default http://localhost:4000)
