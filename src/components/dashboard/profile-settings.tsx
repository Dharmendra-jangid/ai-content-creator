"use client";

import { LogoutButton } from "@/components/auth/logout-button";
import { useDashboardUser } from "@/components/layout/dashboard-user-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProfileSettings() {
  const user = useDashboardUser();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          This identity comes from your Aurateria account in MySQL.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" defaultValue={user.name} readOnly />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" defaultValue={user.email} readOnly />
        </div>
        <div className="sm:col-span-2">
          <LogoutButton variant="outline" className="w-fit justify-center" />
        </div>
      </CardContent>
    </Card>
  );
}
