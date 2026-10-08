import { getAppUrl } from "@/lib/env/app-url";

function hostFromValue(value: string | undefined | null) {
  if (!value) {
    return "";
  }

  const candidate = value.trim().split(",")[0]?.trim() ?? "";
  if (!candidate) {
    return "";
  }

  try {
    const url = candidate.includes("://")
      ? new URL(candidate)
      : new URL(`https://${candidate}`);
    return url.hostname.toLowerCase();
  } catch {
    return candidate.split("/")[0]?.split(":")[0]?.toLowerCase() ?? "";
  }
}

export function getAllowedHosts() {
  const hosts = new Set<string>();

  for (const value of [
    getAppUrl(),
    process.env.VERCEL_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_BRANCH_URL,
  ]) {
    const host = hostFromValue(value);
    if (host) {
      hosts.add(host);
    }
  }

  if (process.env.NODE_ENV !== "production") {
    hosts.add("localhost");
    hosts.add("127.0.0.1");
  }

  return hosts;
}

export function isAllowedHost(value: string | undefined | null) {
  const host = hostFromValue(value);
  return Boolean(host) && getAllowedHosts().has(host);
}

export function getTrustedOrigin(request: Request) {
  const requestUrl = new URL(request.url);

  if (process.env.NODE_ENV === "development") {
    return requestUrl.origin;
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const proto = forwardedProto === "http" ? "http" : "https";

  if (forwardedHost && isAllowedHost(forwardedHost)) {
    const host = forwardedHost.split(",")[0]?.trim();
    if (host) {
      return `${proto}://${host}`;
    }
  }

  try {
    return new URL(getAppUrl()).origin;
  } catch {
    return requestUrl.origin;
  }
}

export function isTrustedBrowserOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    return isAllowedHost(origin);
  }

  const referer = request.headers.get("referer");
  if (referer) {
    return isAllowedHost(referer);
  }

  return false;
}
