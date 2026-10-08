import { requireUserProfile } from "@/lib/auth/session";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default async function AppShellLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireUserProfile();

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
