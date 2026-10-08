import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { planDisplayName } from "@/lib/billing/catalog";
import { creditUsagePercent } from "@/lib/credits/constants";
import type { UserProfile } from "@/types";

const STATUS_LABEL: Record<UserProfile["subscription"]["status"], string> = {
  none: "Free",
  incomplete: "Incomplete",
  active: "Active",
  past_due: "Past due",
  canceled: "Canceled",
  expired: "Expired",
};

export function SubscriptionStatus({ user }: { user: UserProfile }) {
  const usedPercent = creditUsagePercent(user.creditsRemaining, user.creditsLimit);
  const paid = user.subscription.status !== "none";
  const periodEnd = user.subscription.periodEnd
    ? new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeZone: "UTC",
      }).format(new Date(user.subscription.periodEnd))
    : null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>Subscription</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="brand">{planDisplayName(user.plan)}</Badge>
            <Badge variant="outline">{STATUS_LABEL[user.subscription.status]}</Badge>
          </div>
        </div>
        <CardDescription>
          {user.creditsRemaining} of {user.creditsLimit} generations left this month.
          {paid && periodEnd
            ? user.subscription.cancelAtPeriodEnd
              ? ` Access continues until ${periodEnd}.`
              : ` Renews ${periodEnd}.`
            : " Paid plans will bill through Razorpay on the server."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-brand"
            style={{ width: `${usedPercent}%` }}
          />
        </div>
        <dl className="grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted-foreground">Provider</dt>
            <dd className="mt-1 font-medium capitalize">
              {user.subscription.provider ?? "Razorpay (not connected)"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Status</dt>
            <dd className="mt-1 font-medium">{STATUS_LABEL[user.subscription.status]}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Payment</dt>
            <dd className="mt-1 font-medium">Checkout disabled until Razorpay goes live</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
