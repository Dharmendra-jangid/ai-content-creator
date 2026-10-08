"use client";

import { Greeting } from "@/components/dashboard/greeting";
import { useDashboardUser } from "@/components/layout/dashboard-user-provider";

export function DashboardWelcome() {
  const user = useDashboardUser();

  return (
    <div className="space-y-1">
      <Greeting name={user.name} />
      <p className="text-sm text-muted-foreground sm:text-base">
        {user.creditsRemaining} of {user.creditsLimit} credits remaining
        this month.
      </p>
    </div>
  );
}
