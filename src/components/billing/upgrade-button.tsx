"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { isPaidPlan, PLAN_CATALOG, planRank } from "@/lib/billing/catalog";
import { cn } from "@/lib/utils";
import type { Plan } from "@/types";

type UpgradeButtonProps = {
  planId: Plan;
  currentPlan?: Plan;
  signedIn: boolean;
};

export function UpgradeButton({ planId, currentPlan, signedIn }: UpgradeButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const catalog = PLAN_CATALOG[planId];
  const isCurrent = currentPlan === planId;

  if (planId === "free") {
    if (isCurrent) {
      return (
        <Button className="w-full" variant="outline" disabled>
          Current plan
        </Button>
      );
    }

    return (
      <Link
        href={signedIn ? "/billing" : "/signup"}
        className={cn(buttonVariants({ variant: "outline" }), "w-full")}
      >
        {catalog.cta}
      </Link>
    );
  }

  if (isCurrent) {
    return (
      <Button className="w-full" variant="outline" disabled>
        Current plan
      </Button>
    );
  }

  if (!signedIn) {
    return (
      <Link
        href="/signup?next=/billing"
        className={cn(
          buttonVariants({ variant: catalog.highlighted ? "primary" : "outline" }),
          "w-full",
        )}
      >
        {catalog.cta}
      </Link>
    );
  }

  if (currentPlan && isPaidPlan(planId) && planRank(currentPlan) >= planRank(planId)) {
    return (
      <Button className="w-full" variant="outline" disabled>
        Included
      </Button>
    );
  }

  async function upgrade() {
    setPending(true);
    setMessage(null);

    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ planId }),
        cache: "no-store",
      });

      const payload = (await response.json()) as { error?: string };

      if (response.status === 401) {
        router.push("/login?next=/billing");
        return;
      }

      setMessage(
        payload.error ??
          "Razorpay checkout is not enabled yet. Upgrade requests are saved on the server.",
      );
    } catch {
      setMessage("Could not reach billing. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button
        className="w-full"
        variant={catalog.highlighted ? "primary" : "outline"}
        disabled={pending}
        onClick={() => void upgrade()}
      >
        {pending ? "Starting checkout..." : catalog.cta}
      </Button>
      {message ? <p className="text-xs leading-5 text-muted-foreground">{message}</p> : null}
    </div>
  );
}
