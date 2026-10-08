import { Check, Minus } from "lucide-react";

import {
  PLAN_CATALOG,
  PLAN_COMPARISON,
  PLAN_ORDER,
} from "@/lib/billing/catalog";
import { cn } from "@/lib/utils";
import type { Plan } from "@/types";

type PlanComparisonProps = {
  currentPlan?: Plan;
};

export function PlanComparison({ currentPlan }: PlanComparisonProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-surface">
      <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-4 font-medium text-muted-foreground sm:px-6">
              Compare plans
            </th>
            {PLAN_ORDER.map((id) => (
              <th key={id} className="px-4 py-4 sm:px-6">
                <span className="font-semibold text-foreground">
                  {PLAN_CATALOG[id].name}
                </span>
                {currentPlan === id ? (
                  <span className="mt-1 block text-xs font-medium text-brand">Current</span>
                ) : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PLAN_COMPARISON.map((row) => (
            <tr key={row.label} className="border-b border-border last:border-0">
              <th className="px-4 py-3.5 font-medium text-foreground sm:px-6">{row.label}</th>
              {PLAN_ORDER.map((id) => {
                const value = row.values[id];

                return (
                  <td key={id} className="px-4 py-3.5 text-muted-foreground sm:px-6">
                    {typeof value === "boolean" ? (
                      value ? (
                        <Check
                          className={cn("size-4 text-brand")}
                          aria-label="Included"
                        />
                      ) : (
                        <Minus
                          className="size-4 text-border"
                          aria-label="Not included"
                        />
                      )
                    ) : (
                      value
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
