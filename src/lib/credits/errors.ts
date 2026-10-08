import "server-only";

export type CreditsErrorCode = "exhausted" | "unavailable" | "refund_failed";

export class CreditsError extends Error {
  readonly status: 402 | 503;
  readonly code: CreditsErrorCode;

  constructor(message: string, status: 402 | 503, code: CreditsErrorCode) {
    super(message);
    this.name = "CreditsError";
    this.status = status;
    this.code = code;
  }
}
