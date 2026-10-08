"use client";

import Link from "next/link";
import { useActionState } from "react";

import { AuthMessage } from "@/components/auth/auth-message";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithEmail, signUpWithEmail } from "@/lib/auth/actions";
import { AUTH_ERROR_QUERY } from "@/lib/auth/paths";
import { MISSING_DATABASE_MESSAGE } from "@/lib/db/config";

type AuthFormProps = {
  mode: "login" | "signup";
  nextPath: string;
  errorCode?: string;
};

const QUERY_ERRORS: Record<string, string> = {
  [AUTH_ERROR_QUERY.config]: MISSING_DATABASE_MESSAGE,
  [AUTH_ERROR_QUERY.oauth]:
    "Google sign-in was cancelled or is not configured. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET, then try again.",
  [AUTH_ERROR_QUERY.confirm]:
    "That confirmation link is invalid or expired. Sign in with email instead.",
};

export function AuthForm({ mode, nextPath, errorCode }: AuthFormProps) {
  const isLogin = mode === "login";
  const action = isLogin ? signInWithEmail : signUpWithEmail;
  const [state, formAction, pending] = useActionState(action, null);

  const error = state?.error ?? (errorCode ? QUERY_ERRORS[errorCode] : undefined);
  const success = state?.success;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between px-6 py-4">
        <Logo />
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-surface sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            {isLogin ? "Welcome back" : "Create your workspace"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isLogin
              ? "Sign in to pick up drafts, credits, and history."
              : "Start on the free plan with monthly credits."}
          </p>

          <div className="mt-6">
            <GoogleSignInButton nextPath={nextPath} />
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <p className="relative flex justify-center text-xs text-muted-foreground">
              <span className="bg-card px-2">or continue with email</span>
            </p>
          </div>

          <form className="space-y-4" action={formAction}>
            <input type="hidden" name="next" value={nextPath} />
            {!isLogin ? (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={80}
                  disabled={pending}
                />
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={pending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                minLength={8}
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
                disabled={pending}
              />
            </div>
            {error ? <AuthMessage tone="error">{error}</AuthMessage> : null}
            {success ? <AuthMessage tone="success">{success}</AuthMessage> : null}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending
                ? isLogin
                  ? "Signing in..."
                  : "Creating account..."
                : isLogin
                  ? "Sign in"
                  : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? "No account yet?" : "Already have an account?"}{" "}
            <Link
              href={isLogin ? `/signup?next=${encodeURIComponent(nextPath)}` : `/login?next=${encodeURIComponent(nextPath)}`}
              className="font-medium text-brand hover:underline"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
