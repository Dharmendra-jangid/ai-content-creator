import type { Metadata } from "next";
import Link from "next/link";

import { DashboardWelcome } from "@/components/dashboard/dashboard-welcome";
import { PreviewBanner } from "@/components/dashboard/page-header";
import { QuickGenerate } from "@/components/dashboard/quick-generate";
import { RecentContent } from "@/components/dashboard/recent-content";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { buttonVariants } from "@/components/ui/button";
import { requireUserProfile } from "@/lib/auth/session";
import { buildDashboardStats } from "@/lib/credits/stats";
import { mockHistory } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Overview",
};

export default async function DashboardPage() {
  const user = await requireUserProfile();

  return (
    <div className="mx-auto max-w-6xl">
      <PreviewBanner />
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <DashboardWelcome />
        <Link href="/generate" className={cn(buttonVariants(), "w-fit")}>
          New draft
        </Link>
      </div>
      <div className="space-y-6">
        <StatsGrid stats={buildDashboardStats(user)} />
        <QuickGenerate />
        <RecentContent items={mockHistory.slice(0, 4)} />
      </div>
    </div>
  );
}
