import { ChevronDown } from "lucide-react";

import { Container, Section } from "@/components/marketing/container";
import { SectionHeading } from "@/components/marketing/section-heading";
import { FAQS } from "@/lib/marketing";

export function Faq() {
  return (
    <Section id="faq">
      <Container>
        <SectionHeading
          eyebrow="FAQ"
          title="Straight answers before you start."
          description="Credits, formats, and where the model actually runs."
        />
        <div className="mx-auto max-w-3xl divide-y divide-border rounded-2xl border border-border bg-card px-4 shadow-surface sm:px-6">
          {FAQS.map((item) => (
            <details key={item.question} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-sm font-semibold tracking-tight marker:content-none [&::-webkit-details-marker]:hidden">
                {item.question}
                <ChevronDown
                  className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="pb-4 pr-8 text-sm leading-6 text-muted-foreground">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}
