import { isPlan } from "@/lib/billing/catalog";
import {
  BUSINESS_MONTHLY_CREDITS,
  FREE_MONTHLY_CREDITS,
  PRO_MONTHLY_CREDITS,
} from "@/lib/constants";
import type { Plan } from "@/types";

export { isPlan };

export const GENERATION_CREDIT_COST = 1;

export const PLAN_MONTHLY_CREDITS: Record<Plan, number> = {
  free: FREE_MONTHLY_CREDITS,
  pro: PRO_MONTHLY_CREDITS,
  business: BUSINESS_MONTHLY_CREDITS,
};

export const CREDITS_EXHAUSTED_MESSAGE =
  "You’re out of credits for this month. Upgrade or wait for the monthly reset.";

export const CREDITS_UNAVAILABLE_MESSAGE =
  "Credits are not available yet. Run npx prisma db push && npx prisma db seed.";

export function creditUsagePercent(remaining: number, limit: number) {
  if (limit <= 0) {
    return 100;
  }

  return Math.min(100, Math.max(0, Math.round(((limit - remaining) / limit) * 100)));
}

export function periodResetAt(periodStart: string) {
  const [year, month] = periodStart.split("-").map(Number);

  if (!year || !month) {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)).toISOString();
  }

  return new Date(Date.UTC(year, month, 1)).toISOString();
}
