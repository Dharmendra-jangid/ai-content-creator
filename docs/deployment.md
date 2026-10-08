# Production deployment

Aurateria uses **MySQL** (Prisma) and a signed session cookie. Do not put secrets in git.

## Required environment variables

| Variable | Secret | Used for |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | No | Canonical origin, no trailing slash |
| `DATABASE_URL` | Yes | MySQL connection (`mysql://user:pass@host:3306/aurateria`) |
| `AUTH_SECRET` | Yes | Signed login cookie. `openssl rand -base64 32` |
| `GEMINI_API_KEY` | Yes | Server-only generation |

Optional: `GEMINI_MODEL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, Razorpay keys (`BILLING_PAYMENTS_ENABLED` leave unset).

Never set `NEXT_PUBLIC_GEMINI_API_KEY` or `NEXT_PUBLIC_AUTH_SECRET`.

## Database

1. Create a production MySQL database (RDS, PlanetScale, Railway, DigitalOcean, etc.).
2. Set `DATABASE_URL`.
3. Run `npx prisma db push` and `npx prisma db seed` against that database (or `prisma migrate deploy` once you add migrations).

Vercel does not include MySQL. Point `DATABASE_URL` at a hosted MySQL instance. Prisma runs on the Node.js runtime.

## App host (Vercel or Node VPS)

1. Set the env vars above.
2. `NEXT_PUBLIC_APP_URL` must match the live origin.
3. Google OAuth redirect URI: `https://your-domain.com/auth/callback`.
4. Generation `maxDuration` is 30s.

Local MySQL: `docker compose up -d` then `npx prisma db push && npx prisma db seed`. See [setup.md](./setup.md).
