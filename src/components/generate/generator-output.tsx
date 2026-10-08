"use client";

import { Bookmark, LoaderCircle, RefreshCw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import {
  CONTENT_TYPES,
  GENERATOR_PLATFORMS,
  LANGUAGES,
  LENGTHS,
  TONES,
} from "@/lib/constants";
import { getOptionLabel } from "@/lib/generator";
import type { GeneratorDraft } from "@/types";

type GeneratorOutputProps = {
  draft: GeneratorDraft | null;
  loading: boolean;
  notice: string | null;
  noticeTone?: "info" | "error";
  onRegenerate: () => void;
  onSave: () => void;
};

export function GeneratorOutput({
  draft,
  loading,
  notice,
  noticeTone = "info",
  onRegenerate,
  onSave,
}: GeneratorOutputProps) {
  return (
    <Card className="h-fit xl:sticky xl:top-24">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Generated content</CardTitle>
            <CardDescription>
              Review, copy, or save. Drafts are written by Gemini on the server.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? <OutputSkeleton /> : null}

        {!loading && draft ? (
          <>
            <div className="flex flex-wrap gap-2">
              <Badge variant="brand">
                {getOptionLabel(GENERATOR_PLATFORMS, draft.input.platform)}
              </Badge>
              <Badge variant="outline">
                {getOptionLabel(CONTENT_TYPES, draft.input.contentType)}
              </Badge>
              <Badge variant="outline">
                {getOptionLabel(TONES, draft.input.tone)}
              </Badge>
              <Badge variant="outline">
                {getOptionLabel(LANGUAGES, draft.input.language)}
              </Badge>
              <Badge variant="outline">
                {getOptionLabel(LENGTHS, draft.input.length)}
              </Badge>
            </div>
            <pre className="max-h-[28rem] overflow-auto whitespace-pre-wrap rounded-xl border border-border bg-background px-4 py-4 font-sans text-sm leading-7 text-foreground">
              {draft.body}
            </pre>
            <div className="flex flex-wrap gap-2">
              <CopyButton value={draft.body} />
              <Button variant="outline" size="sm" onClick={onRegenerate}>
                <RefreshCw className="size-3.5" />
                Regenerate
              </Button>
              <Button
                variant={draft.saved ? "secondary" : "outline"}
                size="sm"
                onClick={onSave}
                disabled={draft.saved}
              >
                <Bookmark className="size-3.5" />
                {draft.saved ? "Saved" : "Save"}
              </Button>
            </div>
          </>
        ) : null}

        {!loading && !draft ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/40 px-4 py-12 text-center">
            <Badge variant="outline">Waiting for a brief</Badge>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
              Fill the form and generate. The draft will land here on desktop,
              and below the form on smaller screens.
            </p>
          </div>
        ) : null}

        {notice && !loading ? (
          <p
            className={
              noticeTone === "error"
                ? "rounded-lg border border-danger/25 bg-danger/10 px-3 py-2 text-sm text-danger"
                : "rounded-lg border border-brand/20 bg-brand-soft px-3 py-2 text-sm text-brand"
            }
            role={noticeTone === "error" ? "alert" : "status"}
          >
            {notice}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function OutputSkeleton() {
  return (
    <div className="space-y-4" aria-live="polite" aria-busy="true">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <LoaderCircle className="size-4 animate-spin text-brand" />
        Generating your draft…
      </div>
      <div className="space-y-2">
        <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
