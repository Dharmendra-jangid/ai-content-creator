"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { clearSessionCookie, setSessionCookie } from "@/lib/auth/cookies";
import {
  type AuthActionState,
  toAuthErrorMessage,
  validateEmail,
  validateName,
  validatePassword,
} from "@/lib/auth/errors";
import { getSafeRedirectPath, LOGIN_PATH } from "@/lib/auth/paths";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { isDatabaseConfigured, MISSING_DATABASE_MESSAGE } from "@/lib/db/config";
import { getPrisma } from "@/lib/db/prisma";

export async function signInWithEmail(
  _previous: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isDatabaseConfigured()) {
    return { error: MISSING_DATABASE_MESSAGE };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = getSafeRedirectPath(formData.get("next"));

  const emailError = validateEmail(email);
  if (emailError) {
    return { error: emailError };
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return { error: passwordError };
  }

  try {
    const prisma = getPrisma();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user?.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
      return { error: toAuthErrorMessage("Invalid login credentials") };
    }

    await setSessionCookie({
      sub: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    console.error("[auth] sign-in failed", error instanceof Error ? error.message : "unknown");
    return { error: toAuthErrorMessage("unavailable") };
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function signUpWithEmail(
  _previous: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isDatabaseConfigured()) {
    return { error: MISSING_DATABASE_MESSAGE };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = getSafeRedirectPath(formData.get("next"));

  const nameError = validateName(name);
  if (nameError) {
    return { error: nameError };
  }

  const emailError = validateEmail(email);
  if (emailError) {
    return { error: emailError };
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return { error: passwordError };
  }

  try {
    const prisma = getPrisma();
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: await hashPassword(password),
        planId: "free",
      },
    });

    await setSessionCookie({
      sub: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { error: toAuthErrorMessage("User already registered") };
    }

    console.error("[auth] sign-up failed", error instanceof Error ? error.message : "unknown");
    return { error: "Could not create the account. Check that MySQL is running and plans are seeded." };
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function signOut() {
  await clearSessionCookie();
  revalidatePath("/", "layout");
  redirect(LOGIN_PATH);
}
