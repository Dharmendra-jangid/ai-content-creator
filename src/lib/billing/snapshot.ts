import { isPlan } from "@/lib/billing/catalog";
import type {
  BillingProvider,
  Plan,
  SubscriptionStatus,
  UserSubscription,
} from "@/types";

const STATUSES: SubscriptionStatus[] = [
  "none",
  "incomplete",
  "active",
  "past_due",
  "canceled",
  "expired",
];

export type SubscriptionSnapshot = UserSubscription & {
  plan: Plan;
  creditsLimit: number;
};

export const EMPTY_SUBSCRIPTION: UserSubscription = {
  status: "none",
  periodEnd: null,
  cancelAtPeriodEnd: false,
  provider: null,
};

export function parseSubscriptionSnapshot(value: unknown): SubscriptionSnapshot | null {
  const row = typeof value === "string" ? parseJson(value) : value;
  if (!isRecord(row) || typeof row.plan_id !== "string" || !isPlan(row.plan_id)) {
    return null;
  }

  const status = parseStatus(row.status);
  const provider = parseProvider(row.provider);
  const creditsLimit = asNonNegativeInt(row.credits_limit);

  if (creditsLimit === null) {
    return null;
  }

  return {
    plan: row.plan_id,
    creditsLimit,
    status,
    periodEnd: asIso(row.current_period_end),
    cancelAtPeriodEnd: row.cancel_at_period_end === true,
    provider,
  };
}

export function parseCheckoutIntent(value: unknown): { id: string; planId: Plan } | null {
  const row = typeof value === "string" ? parseJson(value) : value;
  if (!isRecord(row) || typeof row.id !== "string" || typeof row.plan_id !== "string") {
    return null;
  }

  if (!isPlan(row.plan_id) || row.plan_id === "free") {
    return null;
  }

  return { id: row.id, planId: row.plan_id };
}

function parseStatus(value: unknown): SubscriptionStatus {
  if (typeof value === "string" && STATUSES.includes(value as SubscriptionStatus)) {
    return value as SubscriptionStatus;
  }

  return "none";
}

function parseProvider(value: unknown): BillingProvider | null {
  return value === "razorpay" ? "razorpay" : null;
}

function asIso(value: unknown) {
  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return null;
}

function parseJson(value: string) {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asNonNegativeInt(value: unknown) {
  if (typeof value === "number" && Number.isInteger(value) && value >= 0) {
    return value;
  }

  if (typeof value === "string" && /^\d+$/.test(value)) {
    return Number(value);
  }

  return null;
}
