import { Check, History, Languages, Moon, MousePointerClick, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Container, Section } from "@/components/marketing/container";
import { SectionHeading } from "@/components/marketing/section-heading";
import { FEATURES } from "@/lib/marketing";

const FEATURE_ICONS: Record<(typeof FEATURES)[number]["id"], LucideIcon> = {
  channel: Languages,
  tone: Check,
  credits: Wallet,
  copy: MousePointerClick,
  history: History,
  theme: Moon,
};

export function Features() {
  return (
    <Section id="features">
      <Container>
        <SectionHeading
          eyebrow="Features"
          title="A writing desk, not another chat window."
          description="Aurateria is built for people who publish on a schedule. Pick a format, spend a credit, copy the draft, and move on."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = FEATURE_ICONS[feature.id];

            return (
              <article
                key={feature.id}
                className="group rounded-2xl border border-border bg-card p-6 shadow-surface transition-all duration-200 motion-safe:hover:-translate-y-1 hover:border-brand/35 hover:shadow-lg"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.body}
                </p>
              </article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
