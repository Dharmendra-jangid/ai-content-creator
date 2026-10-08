import { NextResponse } from "next/server";

import { isTrustedBrowserOrigin } from "@/lib/security/origin";
import { consumeRateLimit } from "@/lib/security/rate-limit";

export const MAX_GENERATE_BODY_BYTES = 16_384;
export const MAX_CHECKOUT_BODY_BYTES = 4_096;
export const MAX_WEBHOOK_BODY_BYTES = 262_144;

export function rejectUntrustedOrigin(request: Request) {
  if (isTrustedBrowserOrigin(request)) {
    return null;
  }

  return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
}

export function rejectRateLimited(key: string, limit: number, windowMs: number) {
  if (consumeRateLimit(key, limit, windowMs)) {
    return null;
  }

  return NextResponse.json(
    { error: "Too many requests. Wait a moment and try again." },
    { status: 429 },
  );
}

export async function readJsonBody(request: Request, maxBytes: number) {
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    return { ok: false as const, error: "Request is too large." };
  }

  const buffer = await request.arrayBuffer();
  if (buffer.byteLength > maxBytes) {
    return { ok: false as const, error: "Request is too large." };
  }

  const decoder = new TextDecoder();
  const text = decoder.decode(buffer);

  if (!text.trim()) {
    return { ok: false as const, error: "Send a valid JSON body." };
  }

  try {
    return { ok: true as const, value: JSON.parse(text) as unknown };
  } catch {
    return { ok: false as const, error: "Send a valid JSON body." };
  }
}

export async function readRawBody(request: Request, maxBytes: number) {
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    return { ok: false as const, error: "Request is too large." };
  }

  const buffer = await request.arrayBuffer();
  if (buffer.byteLength > maxBytes) {
    return { ok: false as const, error: "Request is too large." };
  }

  return { ok: true as const, value: new TextDecoder().decode(buffer) };
}
