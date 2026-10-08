import "server-only";

import { isPaidPlan, PLAN_CATALOG, planRank } from "@/lib/billing/catalog";
import { BillingError } from "@/lib/billing/errors";
import { EMPTY_SUBSCRIPTION } from "@/lib/billing/snapshot";
import { getEntitledPlan } from "@/lib/credits/server";
import { getPrisma } from "@/lib/db/prisma";
import { isBillingCheckoutReady } from "@/lib/env/server";
import type { UserSubscription } from "@/types";

export async function getSubscriptionForUser(userId: string): Promise<UserSubscription> {
  try {
    const prisma = getPrisma();
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: { in: ["incomplete", "active", "past_due", "canceled", "expired"] },
      },
      orderBy: [{ updatedAt: "desc" }],
    });

    if (!subscription) {
      return EMPTY_SUBSCRIPTION;
    }

    return {
      status:
        subscription.status === "active" ||
        subscription.status === "incomplete" ||
        subscription.status === "past_due" ||
        subscription.status === "canceled" ||
        subscription.status === "expired"
          ? subscription.status
          : "none",
      periodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      provider: subscription.provider === "razorpay" ? "razorpay" : null,
    };
  } catch (error) {
    console.error("[billing] snapshot failed", error instanceof Error ? error.message : "unknown");
    return EMPTY_SUBSCRIPTION;
  }
}

export async function createCheckoutIntent(
  userId: string,
  planId: string,
): Promise<void> {
  if (!isPaidPlan(planId)) {
    throw new BillingError("Choose Pro or Business to upgrade.", 400, "invalid_plan");
  }

  const prisma = getPrisma();
  const current = await getEntitledPlan(userId);
  const catalog = PLAN_CATALOG[planId];

  if (planRank(planId) === planRank(current)) {
    throw new BillingError("You are already on this plan.", 409, "already_on_plan");
  }

  if (planRank(planId) < planRank(current)) {
    throw new BillingError(
      "Downgrades will be handled from the billing portal after Razorpay is connected.",
      400,
      "downgrade_not_allowed",
    );
  }

  await prisma.checkoutIntent.updateMany({
    where: { userId, status: "pending" },
    data: { status: "aborted" },
  });

  await prisma.checkoutIntent.create({
    data: {
      userId,
      planId,
      status: "pending",
      provider: "razorpay",
      amountPaise: catalog.amountPaise,
      currency: "INR",
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    },
  });

  if (!isBillingCheckoutReady()) {
    throw new BillingError(
      "Razorpay checkout is not enabled yet. Your upgrade request was saved and will be charged only after payments go live.",
      503,
      "not_configured",
    );
  }

  throw new BillingError(
    "Razorpay checkout is not enabled yet. Payment collection is intentionally disabled until this flow is finished.",
    503,
    "not_configured",
  );
}
