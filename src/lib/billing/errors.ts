import "server-only";

export type BillingErrorCode =
  | "unauthenticated"
  | "invalid_plan"
  | "already_on_plan"
  | "downgrade_not_allowed"
  | "not_configured"
  | "unavailable";

export class BillingError extends Error {
  readonly status: 400 | 401 | 409 | 503;
  readonly code: BillingErrorCode;

  constructor(message: string, status: 400 | 401 | 409 | 503, code: BillingErrorCode) {
    super(message);
    this.name = "BillingError";
    this.status = status;
    this.code = code;
  }
}
