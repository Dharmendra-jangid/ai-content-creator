import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PLATFORMS, PLATFORM_ORDER } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function QuickGenerate() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Start from a platform</CardTitle>
        <CardDescription>
          Jump into the generator with the right format already selected.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        {PLATFORM_ORDER.map((platform) => (
          <Link
            key={platform}
            href={`/generate?platform=${platform}`}
            className={cn(
              "rounded-xl border border-border bg-muted/40 px-3 py-3 transition-colors hover:border-brand/40 hover:bg-brand-soft",
            )}
          >
            <p className="text-sm font-semibold">{PLATFORMS[platform].label}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {PLATFORMS[platform].description}
            </p>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
