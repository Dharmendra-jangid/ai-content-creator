"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardUser } from "@/components/layout/dashboard-user-provider";
import { creditUsagePercent } from "@/lib/credits/constants";

export function BillingUsage() {
  const user = useDashboardUser();
  const usedPercent = creditUsagePercent(user.creditsRemaining, user.creditsLimit);

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>This month</CardTitle>
          <Badge variant="brand" className="capitalize">
            {user.plan}
          </Badge>
        </div>
        <CardDescription>
          {user.creditsRemaining} of {user.creditsLimit} credits left on the{" "}
          {user.plan} plan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-brand"
            style={{ width: `${usedPercent}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
