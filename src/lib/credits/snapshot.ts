import {
  isPlan,
  periodResetAt,
  PLAN_MONTHLY_CREDITS,
} from "@/lib/credits/constants";
import type { CreditSnapshot, Plan } from "@/types";

type CreditRow = {
  credits_remaining: number;
  credits_limit: number;
  credits_used: number;
  plan_id: string;
  period_start: string;
  usage_id: string | null;
};

export type ConsumedCredits = CreditSnapshot & {
  usageId: string;
};

export function emptyCreditSnapshot(plan: Plan = "free"): CreditSnapshot {
  const now = new Date();
  const periodStart = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-01`;

  return {
    plan,
    creditsRemaining: 0,
    creditsLimit: PLAN_MONTHLY_CREDITS[plan],
    creditsUsed: 0,
    creditsResetAt: periodResetAt(periodStart),
  };
}

export function parseCreditSnapshot(value: unknown): CreditSnapshot | null {
  const row = parseCreditRow(value);
  if (!row || !isPlan(row.plan_id)) {
    return null;
  }

  return {
    plan: row.plan_id,
    creditsRemaining: row.credits_remaining,
    creditsLimit: row.credits_limit,
    creditsUsed: row.credits_used,
    creditsResetAt: periodResetAt(String(row.period_start).slice(0, 10)),
  };
}

export function parseConsumedCredits(value: unknown): ConsumedCredits | null {
  const row = parseCreditRow(value);
  const snapshot = parseCreditSnapshot(value);

  if (!row || !snapshot || !row.usage_id) {
    return null;
  }

  return {
    ...snapshot,
    usageId: row.usage_id,
  };
}

function parseCreditRow(value: unknown): CreditRow | null {
  if (typeof value === "string") {
    try {
      value = JSON.parse(value) as unknown;
    } catch {
      return null;
    }
  }

  if (!isRecord(value)) {
    return null;
  }

  const remaining = asNonNegativeInt(value.credits_remaining);
  const limit = asNonNegativeInt(value.credits_limit);
  const used = asNonNegativeInt(value.credits_used);

  if (
    remaining === null ||
    limit === null ||
    used === null ||
    typeof value.plan_id !== "string" ||
    (typeof value.period_start !== "string" && !(value.period_start instanceof Date))
  ) {
    return null;
  }

  const usageId = value.usage_id;
  if (usageId !== null && usageId !== undefined && typeof usageId !== "string") {
    return null;
  }

  return {
    credits_remaining: remaining,
    credits_limit: limit,
    credits_used: used,
    plan_id: value.plan_id,
    period_start:
      value.period_start instanceof Date
        ? value.period_start.toISOString().slice(0, 10)
        : value.period_start,
    usage_id: typeof usageId === "string" ? usageId : null,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asNonNegativeInt(value: unknown): number | null {
  if (typeof value === "number" && Number.isInteger(value) && value >= 0) {
    return value;
  }

  if (typeof value === "string" && /^\d+$/.test(value)) {
    return Number(value);
  }

  return null;
}
