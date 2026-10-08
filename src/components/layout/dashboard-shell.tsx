import type { ReactNode } from "react";

import { DashboardUiProvider } from "@/components/layout/dashboard-ui-provider";
import { DashboardUserProvider } from "@/components/layout/dashboard-user-provider";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import type { UserProfile } from "@/types";

export function DashboardShell({
  user,
  children,
}: {
  user: UserProfile;
  children: ReactNode;
}) {
  return (
    <DashboardUserProvider user={user}>
      <DashboardUiProvider>
        <div className="flex min-h-screen bg-background">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <Header />
            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
          </div>
        </div>
      </DashboardUiProvider>
    </DashboardUserProvider>
  );
}
