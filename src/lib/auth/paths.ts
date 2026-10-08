export const APP_HOME = "/dashboard";
export const LOGIN_PATH = "/login";
export const SIGNUP_PATH = "/signup";

export const AUTH_ERROR_QUERY = {
  config: "config",
  oauth: "oauth",
  confirm: "confirm",
} as const;

const PROTECTED_PATHS = [
  "/dashboard",
  "/generate",
  "/history",
  "/billing",
  "/settings",
] as const;

const AUTH_PATHS = [LOGIN_PATH, SIGNUP_PATH] as const;

function matchesPath(pathname: string, base: string) {
  return pathname === base || pathname.startsWith(`${base}/`);
}

export function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some((path) => matchesPath(pathname, path));
}

export function isAuthPath(pathname: string) {
  return AUTH_PATHS.some((path) => matchesPath(pathname, path));
}

export function getSafeRedirectPath(
  value: unknown,
  fallback: string = APP_HOME,
): string {
  if (typeof value !== "string") {
    return fallback;
  }

  const path = value.trim();

  if (!path.startsWith("/")) {
    return fallback;
  }

  if (path.startsWith("//") || path.startsWith("/\\")) {
    return fallback;
  }

  if (path.includes("://")) {
    return fallback;
  }

  return path;
}

export function parseAuthErrorCode(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  return (Object.values(AUTH_ERROR_QUERY) as string[]).includes(value)
    ? value
    : undefined;
}
