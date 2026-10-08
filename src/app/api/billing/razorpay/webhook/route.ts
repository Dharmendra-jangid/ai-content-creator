import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { verifyRazorpayWebhookSignature } from "@/lib/billing/razorpay";
import { getPrisma } from "@/lib/db/prisma";
import { getServerEnv } from "@/lib/env/server";
import {
  MAX_WEBHOOK_BODY_BYTES,
  readRawBody,
} from "@/lib/security/request";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { razorpayWebhookSecret } = getServerEnv();
  const body = await readRawBody(request, MAX_WEBHOOK_BODY_BYTES);

  if (!body.ok) {
    return NextResponse.json({ error: "Invalid webhook payload." }, { status: 400 });
  }

  if (!razorpayWebhookSecret) {
    return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });
  }

  const signature = request.headers.get("x-razorpay-signature");

  if (!verifyRazorpayWebhookSignature(body.value, signature, razorpayWebhookSecret)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  let payload: Record<string, unknown> = {};

  try {
    payload = JSON.parse(body.value) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const eventType = typeof payload.event === "string" ? payload.event : "unknown";
  const eventId = typeof payload.id === "string" ? payload.id : null;

  try {
    await getPrisma().billingWebhookEvent.create({
      data: {
        provider: "razorpay",
        providerEventId: eventId,
        eventType,
        payload: payload as Prisma.InputJsonValue,
        processed: false,
      },
    });
  } catch (error) {
    const duplicate =
      error instanceof Error &&
      "code" in error &&
      error.code === "P2002";
    if (!duplicate) {
      console.error("[billing] webhook persist failed");
    }
  }

  return NextResponse.json({
    received: true,
    applied: false,
  });
}
