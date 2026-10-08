import { CopyButton } from "@/components/ui/copy-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PLATFORMS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { GeneratedContent } from "@/types";

type RecentContentProps = {
  items: GeneratedContent[];
};

export function RecentContent({ items }: RecentContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent drafts</CardTitle>
        <CardDescription>
          Copy anything below. Live history persistence comes next.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-4 sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <Badge variant="outline">{PLATFORMS[item.platform].label}</Badge>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
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
  );
}
