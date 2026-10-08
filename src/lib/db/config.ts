export function isDatabaseConfigured() {
  return Boolean(
    process.env.DATABASE_URL?.trim() && process.env.AUTH_SECRET?.trim(),
  );
}

export const MISSING_DATABASE_MESSAGE =
  process.env.NODE_ENV === "development"
    ? "MySQL ready nahi hai. .env.local mein DATABASE_URL aur AUTH_SECRET bharo, docker compose up -d chalao, phir npx prisma db push && npx prisma db seed."
    : "Authentication is not configured yet.";
