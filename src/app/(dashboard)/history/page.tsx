import type { Metadata } from "next";

import { PageHeader, PreviewBanner } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { PLATFORMS } from "@/lib/constants";
import { mockHistory } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "History",
};

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PreviewBanner />
      <PageHeader
        title="History"
        description="Every generation will land here once history persistence is wired."
        action={{ href: "/generate", label: "New draft" }}
      />
      <Card>
        <CardContent className="divide-y divide-border p-0">
          {mockHistory.map((item) => (
            <article
              key={item.id}
              className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-semibold">{item.title}</h2>
                  <Badge variant="outline">{PLATFORMS[item.platform].label}</Badge>
                </div>
                <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                  {item.preview}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(item.createdAt)} · {item.creditsUsed} credit
                  {item.creditsUsed === 1 ? "" : "s"}
                </p>
              </div>
              <CopyButton value={`${item.title}\n\n${item.preview}`} />
            </article>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
