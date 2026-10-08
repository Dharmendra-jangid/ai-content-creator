export type AuthActionState = {
  error?: string;
  success?: string;
} | null;

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "That email or password is incorrect.",
  "Email not confirmed": "Confirm your email before signing in.",
  "User already registered": "An account with that email already exists. Sign in instead.",
  "Password should be at least 6 characters.":
    "Use a password with at least 8 characters.",
  "Signup requires a valid password": "Enter a password with at least 8 characters.",
  "Unable to validate email address: invalid format": "Enter a valid email address.",
  "over_email_send_rate_limit": "Too many emails sent. Try again in a few minutes.",
};

const GENERIC_AUTH_ERROR = "Could not complete that request. Try again.";

export function toAuthErrorMessage(message: string): string {
  return AUTH_ERROR_MESSAGES[message] ?? GENERIC_AUTH_ERROR;
}

export function validateName(name: string): string | null {
  if (!name) {
    return "Name is required.";
  }

  if (name.length > 80) {
    return "Use a name with 80 characters or fewer.";
  }

  return null;
}

export function validateEmail(email: string): string | null {
  if (!email) {
    return "Email is required.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Enter a valid email address.";
  }

  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return "Password is required.";
  }

  if (password.length < 8) {
    return "Use a password with at least 8 characters.";
  }

  return null;
}
