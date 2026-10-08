"use client";

import { LoaderCircle, LogOut } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  className?: string;
  variant?: "ghost" | "outline" | "secondary";
};

export function LogoutButton({
  className,
  variant = "ghost",
}: LogoutButtonProps) {
  return (
    <form action={signOut}>
      <LogoutSubmit className={className} variant={variant} />
    </form>
  );
}

function LogoutSubmit({
  className,
  variant,
}: {
  className?: string;
  variant: "ghost" | "outline" | "secondary";
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      size="sm"
      className={cn("w-full justify-start", className)}
      disabled={pending}
    >
      {pending ? (
        <LoaderCircle className="size-4 animate-spin" />
      ) : (
        <LogOut className="size-4" />
      )}
      {pending ? "Signing out..." : "Log out"}
    </Button>
  );
}
