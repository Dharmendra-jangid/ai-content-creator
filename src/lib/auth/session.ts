import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { readSessionToken, SESSION_COOKIE } from "@/lib/auth/jwt";
import { LOGIN_PATH } from "@/lib/auth/paths";
import { toUserIdentity } from "@/lib/auth/user";
import { getSubscriptionForUser } from "@/lib/billing/server";
import { EMPTY_SUBSCRIPTION } from "@/lib/billing/snapshot";
import { CreditsError } from "@/lib/credits/errors";
import { getCreditSnapshot } from "@/lib/credits/server";
import { emptyCreditSnapshot } from "@/lib/credits/snapshot";
import { isDatabaseConfigured } from "@/lib/db/config";
import type { UserProfile } from "@/types";

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const store = await cookies();
  const session = await readSessionToken(store.get(SESSION_COOKIE)?.value);

  if (!session) {
    return null;
  }

  const identity = toUserIdentity({
    id: session.sub,
    name: session.name,
    email: session.email,
  });

  try {
    const credits = await getCreditSnapshot(session.sub);
    const subscription = await getSubscriptionForUser(session.sub);
    return { ...identity, ...credits, creditsTracked: true, subscription };
  } catch (caught) {
    if (!(caught instanceof CreditsError && caught.code === "unavailable")) {
      console.error(
        "[credits] snapshot failed",
        caught instanceof Error ? caught.message : "unknown",
      );
    }

    return {
      ...identity,
      ...emptyCreditSnapshot(),
      creditsTracked: false,
      subscription: EMPTY_SUBSCRIPTION,
    };
  }
}

export async function requireUserProfile(): Promise<UserProfile> {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect(LOGIN_PATH);
  }

  return profile;
}
