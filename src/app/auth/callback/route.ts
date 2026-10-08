import { NextResponse } from "next/server";

import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/jwt";
import { AUTH_ERROR_QUERY, getSafeRedirectPath } from "@/lib/auth/paths";
import { getPrisma } from "@/lib/db/prisma";
import { getAppUrl } from "@/lib/env/app-url";
import { getServerEnv } from "@/lib/env/server";
import { getTrustedOrigin } from "@/lib/security/origin";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const origin = getTrustedOrigin(request);
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = getSafeRedirectPath(searchParams.get("state"));
  const { googleClientId, googleClientSecret } = getServerEnv();

  if (!code || !googleClientId || !googleClientSecret) {
    return NextResponse.redirect(
      `${origin}/login?error=${AUTH_ERROR_QUERY.oauth}`,
    );
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: `${getAppUrl()}/auth/callback`,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      return NextResponse.redirect(
        `${origin}/login?error=${AUTH_ERROR_QUERY.oauth}`,
      );
    }

    const tokens = (await tokenResponse.json()) as { access_token?: string };
    if (!tokens.access_token) {
      return NextResponse.redirect(
        `${origin}/login?error=${AUTH_ERROR_QUERY.oauth}`,
      );
    }

    const profileResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${tokens.access_token}` } },
    );

    if (!profileResponse.ok) {
      return NextResponse.redirect(
        `${origin}/login?error=${AUTH_ERROR_QUERY.oauth}`,
      );
    }

    const profile = (await profileResponse.json()) as {
      id?: string;
      email?: string;
      name?: string;
    };

    if (!profile.email || !profile.id) {
      return NextResponse.redirect(
        `${origin}/login?error=${AUTH_ERROR_QUERY.oauth}`,
      );
    }

    const prisma = getPrisma();
    const email = profile.email.trim().toLowerCase();
    const name = (profile.name ?? email.split("@")[0] ?? "there").slice(0, 80);

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        googleId: profile.id,
        name,
      },
      create: {
        email,
        name,
        googleId: profile.id,
        planId: "free",
      },
    });

    const token = await createSessionToken({
      sub: user.id,
      email: user.email,
      name: user.name,
    });
    const response = NextResponse.redirect(`${origin}${next}`);
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return response;
  } catch {
    return NextResponse.redirect(
      `${origin}/login?error=${AUTH_ERROR_QUERY.oauth}`,
    );
  }
}
