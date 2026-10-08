import "server-only";

import { cookies } from "next/headers";

import {
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
  type SessionPayload,
} from "@/lib/auth/jwt";

export async function setSessionCookie(payload: SessionPayload) {
  const token = await createSessionToken(payload);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, sessionCookieOptions());
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", {
    ...sessionCookieOptions(),
    maxAge: 0,
  });
}
