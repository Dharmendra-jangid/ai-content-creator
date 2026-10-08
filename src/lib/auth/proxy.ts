import { NextResponse, type NextRequest } from "next/server";

import { readSessionToken, SESSION_COOKIE } from "@/lib/auth/jwt";
import {
  APP_HOME,
  AUTH_ERROR_QUERY,
  isAuthPath,
  isProtectedPath,
  LOGIN_PATH,
} from "@/lib/auth/paths";
import { isDatabaseConfigured } from "@/lib/db/config";

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/api/billing/razorpay/webhook")) {
    return NextResponse.next({ request });
  }

  if (!isDatabaseConfigured()) {
    if (isProtectedPath(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = LOGIN_PATH;
      url.searchParams.set("error", AUTH_ERROR_QUERY.config);
      return NextResponse.redirect(url);
    }

    return NextResponse.next({ request });
  }

  const session = await readSessionToken(
    request.cookies.get(SESSION_COOKIE)?.value,
  );
  const isAuthenticated = Boolean(session);

  if (!isAuthenticated && isProtectedPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.search = "";
    url.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && isAuthPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = APP_HOME;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
}
