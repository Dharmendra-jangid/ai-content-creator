import { NextResponse } from "next/server";

import { getCurrentUserProfile } from "@/lib/auth/session";
import { BillingError } from "@/lib/billing/errors";
import { createCheckoutIntent } from "@/lib/billing/server";
import {
  MAX_CHECKOUT_BODY_BYTES,
  readJsonBody,
  rejectRateLimited,
  rejectUntrustedOrigin,
} from "@/lib/security/request";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const originError = rejectUntrustedOrigin(request);
  if (originError) {
    return originError;
  }

  const user = await getCurrentUserProfile();

  if (!user) {
    return NextResponse.json(
      { error: "Sign in to upgrade your plan.", code: "unauthenticated" },
      { status: 401 },
    );
  }

  const rateLimited = rejectRateLimited(`checkout:${user.id}`, 10, 60_000);
  if (rateLimited) {
    return rateLimited;
  }

  const body = await readJsonBody(request, MAX_CHECKOUT_BODY_BYTES);
  if (!body.ok) {
    return NextResponse.json(
      { error: body.error, code: "invalid_plan" },
      { status: 400 },
    );
  }

  const planId =
    typeof body.value === "object" &&
    body.value !== null &&
    "planId" in body.value &&
    typeof body.value.planId === "string"
      ? body.value.planId
      : "";

  try {
    await createCheckoutIntent(user.id, planId);
    return NextResponse.json(
      { error: "Checkout is not enabled.", code: "not_configured" },
      { status: 503 },
    );
  } catch (error) {
    if (error instanceof BillingError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status },
      );
    }

    console.error(
      "[api/billing/checkout]",
      error instanceof Error ? error.message : "unknown",
    );

    return NextResponse.json(
      { error: "Could not start checkout. Try again.", code: "unavailable" },
      { status: 503 },
    );
  }
}
