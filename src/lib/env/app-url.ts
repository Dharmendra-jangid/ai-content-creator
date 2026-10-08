const FALLBACK_APP_URL = "http://localhost:3000";

function stripTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function hostFromEnv(value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) {
    return "";
  }

  return stripTrailingSlash(trimmed.replace(/^https?:\/\//i, "")).split("/")[0];
}

export function getAppUrl() {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) {
    return stripTrailingSlash(explicit);
  }

  const productionHost = hostFromEnv(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  if (productionHost) {
    return `https://${productionHost}`;
  }

  const deploymentHost = hostFromEnv(process.env.VERCEL_URL);
  if (deploymentHost) {
    return `https://${deploymentHost}`;
  }

  return FALLBACK_APP_URL;
}

export function getMetadataBase() {
  try {
    return new URL(getAppUrl());
  } catch {
    return new URL(FALLBACK_APP_URL);
  }
}
