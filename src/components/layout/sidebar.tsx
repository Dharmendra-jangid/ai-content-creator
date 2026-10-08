"use client";

import {
  CreditCard,
  History,
  LayoutDashboard,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { LogoutButton } from "@/components/auth/logout-button";
import { useDashboardUi } from "@/components/layout/dashboard-ui-provider";
import { useDashboardUser } from "@/components/layout/dashboard-user-provider";
import { Logo } from "@/components/layout/logo";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DASHBOARD_NAV, type NavIcon } from "@/lib/constants";
import { creditUsagePercent } from "@/lib/credits/constants";
import { cn } from "@/lib/utils";

const NAV_ICONS: Record<NavIcon, typeof LayoutDashboard> = {
  overview: LayoutDashboard,
  generate: Sparkles,
  history: History,
  billing: CreditCard,
  settings: Settings,
};

export function Sidebar() {
  const pathname = usePathname();
  const user = useDashboardUser();
  const { mobileNavOpen, setMobileNavOpen } = useDashboardUi();
  const usedPercent = creditUsagePercent(user.creditsRemaining, user.creditsLimit);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname, setMobileNavOpen]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileNavOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setMobileNavOpen]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-foreground/30 backdrop-blur-[2px] transition-opacity lg:hidden",
          mobileNavOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setMobileNavOpen(false)}
        aria-hidden={!mobileNavOpen}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-sidebar transition-transform duration-200 lg:static lg:translate-x-0",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Logo href="/dashboard" />
          <button
            type="button"
            className="rounded-md p-1 text-muted-foreground hover:bg-muted lg:hidden"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close navigation"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
          {DASHBOARD_NAV.map((item) => {
            const Icon = NAV_ICONS[item.icon];
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-soft text-brand"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <div className="mb-4 rounded-xl border border-border bg-card p-3">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground">Credits</span>
              <span className="font-mono text-foreground">
                {user.creditsRemaining}/{user.creditsLimit}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-brand"
                style={{ width: `${usedPercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground capitalize">
              {user.plan} plan · resets monthly
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Avatar name={user.name} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <div className="flex items-center gap-2">
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
                <Badge variant="brand" className="capitalize">
                  {user.plan}
                </Badge>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <LogoutButton />
          </div>
        </div>
      </aside>
    </>
  );
}
