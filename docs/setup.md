# Aurateria setup (MySQL)

Product: **Aurateria**. Database is **MySQL**, not Supabase.

## Required

| Variable | Kahan se |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | Local: `http://localhost:3000` |
| `DATABASE_URL` | MySQL connection string |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/apikey) |

Optional: `GEMINI_MODEL=gemini-2.5-flash`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.

## MySQL start

Docker (project folder):

```bash
docker compose up -d
```

Ya XAMPP / MAMP / local MySQL. Database name: `aurateria`.

Example URL:

```
DATABASE_URL="mysql://root:PASSWORD@127.0.0.1:3306/aurateria"
```

Phir:

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

Signup `/signup` se account banao. Credits MySQL `credit_usage` table mein track hote hain.

## Google login (optional)

Google Cloud OAuth Web client:

- Redirect URI: `http://localhost:3000/auth/callback`
- `.env.local`: `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

## Razorpay

Abhi skip. `BILLING_PAYMENTS_ENABLED` mat lagao.
