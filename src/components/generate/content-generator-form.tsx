"use client";

import { LoaderCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Field, OptionGroup } from "@/components/generate/form-controls";
import { GeneratorOutput } from "@/components/generate/generator-output";
import {
  useApplyCreditSnapshot,
  useDashboardUser,
} from "@/components/layout/dashboard-user-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { requestGeneratedContent } from "@/lib/ai/request";
import {
  CONTENT_TYPES,
  GENERATOR_PLATFORMS,
  LANGUAGES,
  LENGTHS,
  TONES,
} from "@/lib/constants";
import {
  CREDITS_EXHAUSTED_MESSAGE,
  GENERATION_CREDIT_COST,
} from "@/lib/credits/constants";
import { validateGeneratorInput, TOPIC_MAX_LENGTH, AUDIENCE_MAX_LENGTH } from "@/lib/generator";
import type {
  ContentLanguage,
  ContentLength,
  ContentTone,
  ContentType,
  GeneratorDraft,
  GeneratorInput,
  GeneratorPlatform,
} from "@/types";

type ContentGeneratorFormProps = {
  initialPlatform?: GeneratorPlatform;
};

export function ContentGeneratorForm({
  initialPlatform,
}: ContentGeneratorFormProps) {
  const user = useDashboardUser();
  const applyCreditSnapshot = useApplyCreditSnapshot();
  const outOfCredits =
    user.creditsTracked && user.creditsRemaining < GENERATION_CREDIT_COST;
  const [input, setInput] = useState<GeneratorInput>({
    platform: initialPlatform ?? "instagram",
    contentType: "caption",
    topic: "",
    audience: "",
    tone: "professional",
    language: "english",
    length: "medium",
  });
  const [draft, setDraft] = useState<GeneratorDraft | null>(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [noticeTone, setNoticeTone] = useState<"info" | "error">("info");

  function update<K extends keyof GeneratorInput>(key: K, value: GeneratorInput[K]) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  async function generate() {
    const error = validateGeneratorInput(input);
    if (error) {
      setNoticeTone("error");
      setNotice(error);
      return;
    }

    if (user.creditsTracked && user.creditsRemaining < GENERATION_CREDIT_COST) {
      setNoticeTone("error");
      setNotice(CREDITS_EXHAUSTED_MESSAGE);
      return;
    }

    setLoading(true);
    setNotice(null);

    try {
      const result = await requestGeneratedContent(input);
      applyCreditSnapshot({
        plan: result.plan,
        creditsRemaining: result.creditsRemaining,
        creditsLimit: result.creditsLimit,
        creditsUsed: result.creditsUsed,
        creditsResetAt: result.creditsResetAt,
      });
      setDraft({
        id: `draft_${Date.now()}`,
        input,
        body: result.content,
        createdAt: new Date().toISOString(),
        saved: false,
      });
    } catch (caught) {
      setNoticeTone("error");
      setNotice(
        caught instanceof Error
          ? caught.message
          : "Could not generate content. Try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function saveDraft() {
    if (!draft) {
      return;
    }

    setDraft({ ...draft, saved: true });
    setNoticeTone("info");
    setNotice("Saved in this session. History persistence will come with the database.");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)]">
      <Card>
        <CardHeader>
          <CardTitle>Brief</CardTitle>
          <CardDescription>
            Set the channel and voice. Each draft uses {GENERATION_CREDIT_COST}{" "}
            credit. {user.creditsRemaining} left this month.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-6"
            onSubmit={(event) => {
              event.preventDefault();
              void generate();
            }}
          >
            <OptionGroup
              legend="Content platform"
              required
              value={input.platform}
              options={GENERATOR_PLATFORMS}
              onChange={(value) => update("platform", value)}
              columns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
              disabled={loading}
            />

            <OptionGroup
              legend="Content type"
              required
              value={input.contentType}
              options={CONTENT_TYPES}
              onChange={(value: ContentType) => update("contentType", value)}
              columns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
              disabled={loading}
            />

            <Field label="Topic" htmlFor="topic" required>
              <Textarea
                id="topic"
                value={input.topic}
                onChange={(event) => update("topic", event.target.value)}
                placeholder="Launch of a ceramic pour-over dripper for home baristas..."
                disabled={loading}
                maxLength={TOPIC_MAX_LENGTH}
                className="min-h-28"
              />
            </Field>

            <Field
              label="Target audience"
              htmlFor="audience"
              hint="Optional"
            >
              <Input
                id="audience"
                value={input.audience}
                onChange={(event) => update("audience", event.target.value)}
                placeholder="Independent café owners, 28–45"
                disabled={loading}
                maxLength={AUDIENCE_MAX_LENGTH}
              />
            </Field>

            <OptionGroup
              legend="Tone"
              required
              value={input.tone}
              options={TONES}
              onChange={(value: ContentTone) => update("tone", value)}
              columns="grid-cols-2 sm:grid-cols-3"
              disabled={loading}
            />

            <OptionGroup
              legend="Language"
              required
              value={input.language}
              options={LANGUAGES}
              onChange={(value: ContentLanguage) => update("language", value)}
              columns="grid-cols-1 sm:grid-cols-3"
              disabled={loading}
            />

            <OptionGroup
              legend="Content length"
              required
              value={input.length}
              options={LENGTHS}
              onChange={(value: ContentLength) => update("length", value)}
              columns="grid-cols-1 sm:grid-cols-3"
              disabled={loading}
            />

            <Button
              type="submit"
              size="lg"
              className="h-12 w-full text-base"
              disabled={loading || outOfCredits}
            >
              {loading ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              {loading
                ? "Generating content..."
                : outOfCredits
                  ? "Out of credits"
                  : "Generate Content"}
            </Button>
            {outOfCredits ? (
              <p className="text-center text-sm text-muted-foreground">
                {CREDITS_EXHAUSTED_MESSAGE}{" "}
                <Link href="/billing" className="font-medium text-brand hover:underline">
                  View plans
                </Link>
              </p>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <GeneratorOutput
        draft={draft}
        loading={loading}
        notice={notice}
        noticeTone={noticeTone}
        onRegenerate={() => void generate()}
        onSave={saveDraft}
      />
    </div>
  );
}
