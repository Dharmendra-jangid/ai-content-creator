import type { Metadata } from "next";

import { PageHeader, PreviewBanner } from "@/components/dashboard/page-header";
import { ProfileSettings } from "@/components/dashboard/profile-settings";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PreviewBanner />
      <PageHeader
        title="Settings"
        description="Account details come from your MySQL user record. Appearance is stored on this device."
      />

      <div className="space-y-6">
        <ProfileSettings />

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Theme follows your system by default. Toggle anytime — the choice is stored locally.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Color mode</p>
            <ThemeToggle />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
