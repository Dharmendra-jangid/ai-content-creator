import "server-only";

export type AiErrorCode =
  | "config"
  | "timeout"
  | "empty"
  | "auth"
  | "rate_limit"
  | "model"
  | "upstream"
  | "unknown";

export class AiError extends Error {
  readonly status: number;
  readonly code: AiErrorCode;

  constructor(message: string, status: number, code: AiErrorCode) {
    super(message);
    this.name = "AiError";
    this.status = status;
    this.code = code;
  }
}

export function isTimeoutError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const name = "name" in error && typeof error.name === "string" ? error.name : "";
  const message = error instanceof Error ? error.message : "";

  return (
    name === "AbortError" ||
    name === "TimeoutError" ||
    name === "APIUserAbortError" ||
    /timed? ?out|aborted/i.test(message)
  );
}

export function redactErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "unknown";
  return message.replace(/key[=:\s]+\S+/gi, "[redacted]");
}
