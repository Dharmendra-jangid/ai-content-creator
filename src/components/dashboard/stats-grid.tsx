import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { DashboardStat } from "@/types";
import { cn } from "@/lib/utils";

type StatsGridProps = {
  stats: DashboardStat[];
};

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.id}>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="font-mono text-3xl font-semibold tracking-tight">
              {stat.value}
            </p>
            {stat.trend ? (
              <p
                className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  stat.trend.direction === "up" ? "text-success" : "text-muted-foreground",
                )}
              >
                {stat.trend.direction === "up" ? (
                  <ArrowUpRight className="size-3.5" />
                ) : (
                  <ArrowDownRight className="size-3.5" />
                )}
                {stat.trend.label}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">{stat.hint}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
