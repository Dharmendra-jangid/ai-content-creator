import { jwtVerify, SignJWT } from "jose";

export const SESSION_COOKIE = "aurateria_session";
const SESSION_DAYS = 30;

export type SessionPayload = {
  sub: string;
  email: string;
  name: string;
};

function getSecretKey() {
  const secret = process.env.AUTH_SECRET?.trim();
  if (!secret) {
    return null;
  }

  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: SessionPayload) {
  const secret = getSecretKey();
  if (!secret) {
    throw new Error("AUTH_SECRET is not set.");
  }

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secret);
}

export async function readSessionToken(token: string | undefined | null) {
  const secret = getSecretKey();
  if (!secret || !token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    if (
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string"
    ) {
      return null;
    }

    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
    } satisfies SessionPayload;
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  };
}
