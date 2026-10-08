import {
  BUSINESS_MONTHLY_CREDITS,
  FREE_MONTHLY_CREDITS,
  PRO_MONTHLY_CREDITS,
} from "@/lib/constants";
import type { PaidPlan, Plan } from "@/types";

export const BILLING_CURRENCY = "INR";
export const BILLING_PROVIDER = "razorpay" as const;

export const PLAN_IDS = ["free", "pro", "business"] as const;

export const PAID_PLAN_IDS = ["pro", "business"] as const satisfies readonly PaidPlan[];

export type PlanCatalogItem = {
  id: Plan;
  name: string;
  description: string;
  monthlyCredits: number;
  amountPaise: number;
  interval: "month";
  highlighted: boolean;
  features: readonly string[];
  cta: string;
};

export const PLAN_CATALOG: Record<Plan, PlanCatalogItem> = {
  free: {
    id: "free",
    name: "Free",
    description: "Learn the workflow and ship a few real drafts each month.",
    monthlyCredits: FREE_MONTHLY_CREDITS,
    amountPaise: 0,
    interval: "month",
    highlighted: false,
    features: [
      `${FREE_MONTHLY_CREDITS} generations each month`,
      "All content formats",
      "Copy to clipboard",
      "Light and dark workspace",
    ],
    cta: "Start free",
  },
  pro: {
    id: "pro",
    name: "Pro",
    description: "For operators who publish more than a handful of pieces a month.",
    monthlyCredits: PRO_MONTHLY_CREDITS,
    amountPaise: 149_900,
    interval: "month",
    highlighted: true,
    features: [
      `${PRO_MONTHLY_CREDITS} generations each month`,
      "Everything in Free",
      "Saved generation history",
      "Priority generation",
    ],
    cta: "Upgrade to Pro",
  },
  business: {
    id: "business",
    name: "Business",
    description: "Higher volume for teams that write across channels every week.",
    monthlyCredits: BUSINESS_MONTHLY_CREDITS,
    amountPaise: 499_900,
    interval: "month",
    highlighted: false,
    features: [
      `${BUSINESS_MONTHLY_CREDITS} generations each month`,
      "Everything in Pro",
      "Team-ready workspace",
      "Priority support",
    ],
    cta: "Upgrade to Business",
  },
};

export const PLAN_ORDER: Plan[] = ["free", "pro", "business"];

export type ComparisonValue = boolean | string;

export type PlanComparisonRow = {
  label: string;
  values: Record<Plan, ComparisonValue>;
};

export const PLAN_COMPARISON: readonly PlanComparisonRow[] = [
  {
    label: "Generations / month",
    values: {
      free: String(FREE_MONTHLY_CREDITS),
      pro: String(PRO_MONTHLY_CREDITS),
      business: String(BUSINESS_MONTHLY_CREDITS),
    },
  },
  {
    label: "All content formats",
    values: { free: true, pro: true, business: true },
  },
  {
    label: "Copy to clipboard",
    values: { free: true, pro: true, business: true },
  },
  {
    label: "Saved history",
    values: { free: false, pro: true, business: true },
  },
  {
    label: "Priority generation",
    values: { free: false, pro: true, business: true },
  },
  {
    label: "Team workspace",
    values: { free: false, pro: false, business: true },
  },
  {
    label: "Priority support",
    values: { free: false, pro: false, business: true },
  },
  {
    label: "Razorpay billing",
    values: { free: false, pro: true, business: true },
  },
];

export function isPlan(value: string): value is Plan {
  return (PLAN_IDS as readonly string[]).includes(value);
}

export function isPaidPlan(value: string): value is PaidPlan {
  return (PAID_PLAN_IDS as readonly string[]).includes(value);
}

export function planRank(plan: Plan) {
  return PLAN_ORDER.indexOf(plan);
}

export function formatPlanPrice(amountPaise: number, currency = BILLING_CURRENCY) {
  if (amountPaise <= 0) {
    return "₹0";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amountPaise / 100);
}

export function planDisplayName(plan: Plan) {
  return PLAN_CATALOG[plan].name;
}
