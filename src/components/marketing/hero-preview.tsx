import { CopyButton } from "@/components/ui/copy-button";
import { HERO_SAMPLE } from "@/lib/marketing";

export function HeroPreview() {
  return (
    <div className="min-w-0 relative">
      <div className="absolute -inset-4 rounded-[2rem] bg-brand/10 blur-2xl dark:bg-brand/15" />
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-surface">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="size-2.5 rounded-full bg-danger/70" />
          <span className="size-2.5 rounded-full bg-warning/80" />
          <span className="size-2.5 rounded-full bg-success/80" />
          <p className="ml-2 text-xs font-medium text-muted-foreground">
            New draft · {HERO_SAMPLE.platform}
          </p>
        </div>
        <div className="space-y-4 p-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Brief
            </p>
            <p className="mt-1.5 rounded-xl bg-muted/70 px-3 py-2.5 text-sm leading-6 text-foreground">
              {HERO_SAMPLE.brief}
            </p>
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Output
              </p>
              <CopyButton value={HERO_SAMPLE.output} />
            </div>
            <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-xl border border-border bg-background px-3 py-3 font-sans text-sm leading-7 text-foreground">
              {HERO_SAMPLE.output}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
