import { isPlan } from "@/lib/credits/constants";
import type { CreditSnapshot, GenerateContentSuccess, GeneratorInput } from "@/types";

export const GENERATE_CLIENT_TIMEOUT_MS = 30_000;

export async function requestGeneratedContent(input: GeneratorInput) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), GENERATE_CLIENT_TIMEOUT_MS);

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(input),
      cache: "no-store",
      signal: controller.signal,
    });

    const payload = await readJson(response);

    if (!response.ok) {
      throw new Error(readErrorMessage(payload));
    }

    const result = readSuccess(payload);
    if (!result) {
      throw new Error("The server returned an empty draft. Try again.");
    }

    return result;
  } catch (error) {
    if (isAbortError(error)) {
      throw new Error("Generation timed out. Try a shorter length or try again.");
    }

    if (error instanceof TypeError) {
      throw new Error("Could not reach the server. Check your connection and try again.");
    }

    throw error;
  } finally {
    window.clearTimeout(timer);
  }
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error("The server returned an unexpected response. Try again.");
  }
}

function readSuccess(payload: unknown): GenerateContentSuccess | null {
  if (!isRecord(payload) || typeof payload.content !== "string") {
    return null;
  }

  const content = payload.content.trim();
  if (!content) {
    return null;
  }

  const credits = readCreditSnapshot(payload);
  if (!credits) {
    return null;
  }

  return { content, ...credits };
}

function readCreditSnapshot(payload: Record<string, unknown>): CreditSnapshot | null {
  if (
    typeof payload.plan !== "string" ||
    !isPlan(payload.plan) ||
    !isNonNegativeInt(payload.creditsRemaining) ||
    !isNonNegativeInt(payload.creditsLimit) ||
    !isNonNegativeInt(payload.creditsUsed) ||
    typeof payload.creditsResetAt !== "string"
  ) {
    return null;
  }

  return {
    plan: payload.plan,
    creditsRemaining: payload.creditsRemaining,
    creditsLimit: payload.creditsLimit,
    creditsUsed: payload.creditsUsed,
    creditsResetAt: payload.creditsResetAt,
  };
}

function readErrorMessage(payload: unknown) {
  if (isRecord(payload) && typeof payload.error === "string" && payload.error.trim()) {
    return payload.error.trim();
  }

  return "Could not generate content. Try again.";
}

function isAbortError(error: unknown) {
  return (
    (error instanceof DOMException && error.name === "AbortError") ||
    (error instanceof Error && error.name === "AbortError")
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonNegativeInt(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}
