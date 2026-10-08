import { NextResponse } from "next/server";

import { AiError } from "@/lib/ai/errors";
import { generateContent } from "@/lib/ai/gemini";
import { getCurrentUserProfile } from "@/lib/auth/session";
import { CreditsError } from "@/lib/credits/errors";
import {
  consumeGenerationCredit,
  refundGenerationCredit,
} from "@/lib/credits/server";
import { parseGeneratorInput } from "@/lib/generator";
import {
  MAX_GENERATE_BODY_BYTES,
  readJsonBody,
  rejectRateLimited,
  rejectUntrustedOrigin,
} from "@/lib/security/request";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  const originError = rejectUntrustedOrigin(request);
  if (originError) {
    return originError;
  }

  const user = await getCurrentUserProfile();

  if (!user) {
    return NextResponse.json(
      { error: "Sign in to generate content." },
      { status: 401 },
    );
  }

  const rateLimited = rejectRateLimited(`generate:${user.id}`, 20, 60_000);
  if (rateLimited) {
    return rateLimited;
  }

  const body = await readJsonBody(request, MAX_GENERATE_BODY_BYTES);
  if (!body.ok) {
    return NextResponse.json({ error: body.error }, { status: 400 });
  }

  const parsed = parseGeneratorInput(body.value);

  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  let usageId: string | null = null;

  try {
    const reservation = await consumeGenerationCredit(user.id);
    usageId = reservation.usageId;

    const content = await generateContent(parsed.data);

    return NextResponse.json({
      content,
      plan: reservation.plan,
      creditsRemaining: reservation.creditsRemaining,
      creditsLimit: reservation.creditsLimit,
      creditsUsed: reservation.creditsUsed,
      creditsResetAt: reservation.creditsResetAt,
    });
  } catch (error) {
    if (usageId) {
      await refundGenerationCredit(user.id, usageId);
    }

    if (error instanceof CreditsError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    if (error instanceof AiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error(
      "[api/generate]",
      error instanceof Error ? error.message : "unknown",
    );

    return NextResponse.json(
      { error: "Could not generate content. Try again." },
      { status: 500 },
    );
  }
}
