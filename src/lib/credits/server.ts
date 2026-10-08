import "server-only";

import {
  CREDITS_EXHAUSTED_MESSAGE,
  CREDITS_UNAVAILABLE_MESSAGE,
  PLAN_MONTHLY_CREDITS,
  periodResetAt,
} from "@/lib/credits/constants";
import { CreditsError } from "@/lib/credits/errors";
import { type ConsumedCredits } from "@/lib/credits/snapshot";
import { getPrisma } from "@/lib/db/prisma";
import { isPlan } from "@/lib/billing/catalog";
import type { CreditSnapshot, Plan } from "@/types";

function currentPeriodStart() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

function toSnapshot(plan: Plan, used: number, limit: number): CreditSnapshot {
  const periodStart = currentPeriodStart();
  return {
    plan,
    creditsRemaining: Math.max(limit - used, 0),
    creditsLimit: limit,
    creditsUsed: used,
    creditsResetAt: periodResetAt(periodStart.toISOString().slice(0, 10)),
  };
}

export async function getEntitledPlan(userId: string): Promise<Plan> {
  const prisma = getPrisma();
  const now = new Date();

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "active",
      OR: [{ currentPeriodEnd: null }, { currentPeriodEnd: { gt: now } }],
    },
    orderBy: [{ currentPeriodEnd: "desc" }, { updatedAt: "desc" }],
  });

  if (subscription && isPlan(subscription.planId)) {
    return subscription.planId;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { planId: true },
  });

  return user && isPlan(user.planId) ? user.planId : "free";
}

export async function getCreditSnapshot(userId: string): Promise<CreditSnapshot> {
  try {
    const prisma = getPrisma();
    const plan = await getEntitledPlan(userId);
    const periodStart = currentPeriodStart();
    const used = await prisma.creditUsage.aggregate({
      where: { userId, periodStart },
      _sum: { credits: true },
    });

    const limit = PLAN_MONTHLY_CREDITS[plan];
    return toSnapshot(plan, used._sum.credits ?? 0, limit);
  } catch (error) {
    console.error("[credits] snapshot failed", error instanceof Error ? error.message : "unknown");
    throw new CreditsError(CREDITS_UNAVAILABLE_MESSAGE, 503, "unavailable");
  }
}

export async function consumeGenerationCredit(userId: string): Promise<ConsumedCredits> {
  const prisma = getPrisma();
  const periodStart = currentPeriodStart();
  const cost = 1;

  try {
    return await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM users WHERE id = ${userId} FOR UPDATE`;

      const now = new Date();
      const subscription = await tx.subscription.findFirst({
        where: {
          userId,
          status: "active",
          OR: [{ currentPeriodEnd: null }, { currentPeriodEnd: { gt: now } }],
        },
        orderBy: [{ currentPeriodEnd: "desc" }, { updatedAt: "desc" }],
      });

      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { planId: true },
      });

      const planId = subscription?.planId ?? user?.planId ?? "free";
      const plan: Plan = isPlan(planId) ? planId : "free";
      const limit = PLAN_MONTHLY_CREDITS[plan];
      const used = await tx.creditUsage.aggregate({
        where: { userId, periodStart },
        _sum: { credits: true },
      });
      const usedCount = used._sum.credits ?? 0;

      if (usedCount + cost > limit) {
        throw new CreditsError(CREDITS_EXHAUSTED_MESSAGE, 402, "exhausted");
      }

      const usage = await tx.creditUsage.create({
        data: {
          userId,
          credits: cost,
          reason: "generation",
          periodStart,
        },
      });

      const snapshot = toSnapshot(plan, usedCount + cost, limit);
      return { ...snapshot, usageId: usage.id };
    });
  } catch (error) {
    if (error instanceof CreditsError) {
      throw error;
    }

    console.error("[credits] consume failed", error instanceof Error ? error.message : "unknown");
    throw new CreditsError(CREDITS_UNAVAILABLE_MESSAGE, 503, "unavailable");
  }
}

export async function refundGenerationCredit(
  userId: string,
  usageId: string,
): Promise<CreditSnapshot | null> {
  const prisma = getPrisma();
  const cutoff = new Date(Date.now() - 15 * 60 * 1000);

  try {
    const deleted = await prisma.creditUsage.deleteMany({
      where: {
        id: usageId,
        userId,
        reason: "generation",
        createdAt: { gt: cutoff },
      },
    });

    if (deleted.count === 0) {
      return null;
    }

    return getCreditSnapshot(userId);
  } catch (error) {
    console.error("[credits] refund failed", error instanceof Error ? error.message : "unknown");
    return null;
  }
}

