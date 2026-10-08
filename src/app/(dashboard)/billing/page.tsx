import type { Metadata } from "next";

import { PlanComparison } from "@/components/billing/plan-comparison";
import { PricingCards } from "@/components/billing/pricing-cards";
import { SubscriptionStatus } from "@/components/billing/subscription-status";
import { PageHeader, PreviewBanner } from "@/components/dashboard/page-header";
import { requireUserProfile } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Billing",
};

export default async function BillingPage() {
  const user = await requireUserProfile();

  return (
    <div className="mx-auto max-w-6xl">
      <PreviewBanner />
      <PageHeader
        title="Billing"
        description="Manage your plan and monthly generations. Razorpay checkout is wired on the server but not collecting payment yet."
        action={{ href: "/pricing", label: "View pricing" }}
      />

      <SubscriptionStatus user={user} />

      <div className="mb-10">
        <h2 className="mb-4 text-lg font-semibold tracking-tight">Upgrade</h2>
        <PricingCards currentPlan={user.plan} signedIn />
      </div>

      <h2 className="mb-4 text-lg font-semibold tracking-tight">Compare plans</h2>
      <PlanComparison currentPlan={user.plan} />
    </div>
  );
}
