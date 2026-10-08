import { NextResponse } from "next/server";

import { getSafeRedirectPath } from "@/lib/auth/paths";
import { getAppUrl } from "@/lib/env/app-url";
import { getServerEnv } from "@/lib/env/server";

export async function GET(request: Request) {
  const { googleClientId } = getServerEnv();
  const { searchParams } = new URL(request.url);
  const next = getSafeRedirectPath(searchParams.get("next"));

  if (!googleClientId) {
    return NextResponse.redirect(new URL(`/login?error=oauth`, getAppUrl()));
  }

  const state = encodeURIComponent(next);
  const redirectUri = `${getAppUrl()}/auth/callback`;
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", googleClientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  url.searchParams.set("prompt", "select_account");

  return NextResponse.redirect(url);
}
