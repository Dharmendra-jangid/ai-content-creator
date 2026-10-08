"use client";

import { Menu } from "lucide-react";
import Link from "next/link";

import { useDashboardUi } from "@/components/layout/dashboard-ui-provider";
import { useDashboardUser } from "@/components/layout/dashboard-user-provider";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Header() {
  const { setMobileNavOpen } = useDashboardUi();
  const user = useDashboardUser();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="size-9 lg:hidden"
          aria-label="Open navigation"
          onClick={() => setMobileNavOpen(true)}
        >
          <Menu className="size-4" />
        </Button>
        <p className="hidden text-sm text-muted-foreground sm:block">
          Draft once. Publish everywhere.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="outline" className="max-w-[8.5rem] truncate font-mono text-xs sm:max-w-none sm:text-sm">
          {user.creditsRemaining} credits
        </Badge>
        <ThemeToggle />
        <Link
          href="/settings"
          className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
          aria-label="Open settings"
        >
          <Avatar name={user.name} className="size-8" />
        </Link>
      </div>
    </header>
  );
}
