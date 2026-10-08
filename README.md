# Aurateria — AI Content Creator

Next.js app with **MySQL** (Prisma), email/password auth, and server-side Gemini generation.

## Run locally

1. Start MySQL:

```bash
docker compose up -d
```

Or use your own MySQL and set `DATABASE_URL` in `.env.local`.

2. Copy env and fill secrets:

```bash
cp .env.example .env.local
```

Required:

- `DATABASE_URL` — e.g. `mysql://root:aurateria@127.0.0.1:3306/aurateria`
- `AUTH_SECRET` — `openssl rand -base64 32`
- `GEMINI_API_KEY` — Google AI Studio
- `NEXT_PUBLIC_APP_URL=http://localhost:3000`

3. Create tables and plans:

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up with email — no Supabase needed.

See [docs/setup.md](docs/setup.md).
# ai-content-creator
# ai-content-creator
# ai-content-creator
