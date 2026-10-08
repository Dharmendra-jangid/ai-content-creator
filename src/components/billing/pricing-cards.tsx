import { Check } from "lucide-react";

import { UpgradeButton } from "@/components/billing/upgrade-button";
import { Badge } from "@/components/ui/badge";
import {
  formatPlanPrice,
  PLAN_CATALOG,
  PLAN_ORDER,
} from "@/lib/billing/catalog";
import { cn } from "@/lib/utils";
import type { Plan } from "@/types";

type PricingCardsProps = {
  currentPlan?: Plan;
  signedIn?: boolean;
};

export function PricingCards({ currentPlan, signedIn = false }: PricingCardsProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {PLAN_ORDER.map((id) => {
        const plan = PLAN_CATALOG[id];

        return (
          <article
            key={plan.id}
            className={cn(
              "flex flex-col rounded-2xl border bg-card p-6 shadow-surface sm:p-8",
              plan.highlighted
                ? "border-brand/40 ring-1 ring-brand/20"
                : "border-border",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              {plan.highlighted ? <Badge variant="brand">Most used</Badge> : null}
            </div>
            <p className="mt-4 flex items-baseline gap-1">
              <span className="font-mono text-4xl font-semibold tracking-tight">
                {formatPlanPrice(plan.amountPaise)}
              </span>
              <span className="text-sm text-muted-foreground">per month</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {plan.monthlyCredits.toLocaleString("en-IN")} generations / month
            </p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{plan.description}</p>
            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <UpgradeButton
                planId={plan.id}
                currentPlan={currentPlan}
                signedIn={signedIn}
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}
