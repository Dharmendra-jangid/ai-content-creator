import { planDisplayName } from "@/lib/billing/catalog";
import { PLAN_MONTHLY_CREDITS } from "@/lib/credits/constants";
import { mockStats } from "@/lib/mock-data";
import type { DashboardStat, UserProfile } from "@/types";

export function buildDashboardStats(user: UserProfile): DashboardStat[] {
  const copied = mockStats.find((stat) => stat.id === "copied");
  const planLabel = planDisplayName(user.plan);

  const resetLabel = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(user.creditsResetAt));

  return [
    {
      id: "credits",
      label: "Credits left",
      value: String(user.creditsRemaining),
      hint: `Resets ${resetLabel}`,
    },
    {
      id: "generated",
      label: "Generated this month",
      value: String(user.creditsUsed),
      hint: `${user.creditsLimit} included on ${planLabel}`,
    },
    copied ?? {
      id: "copied",
      label: "Copied to clipboard",
      value: "—",
      hint: "Ready to publish",
    },
    {
      id: "plan",
      label: "Current plan",
      value: planLabel,
      hint: `${PLAN_MONTHLY_CREDITS[user.plan]} credits / month`,
    },
  ];
}
