import type { Metadata } from "next";

import { AuthForm } from "@/components/auth/auth-form";
import { APP_HOME, getSafeRedirectPath, parseAuthErrorCode } from "@/lib/auth/paths";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <AuthForm
      mode="login"
      nextPath={getSafeRedirectPath(params.next, APP_HOME)}
      errorCode={parseAuthErrorCode(params.error)}
    />
  );
}
