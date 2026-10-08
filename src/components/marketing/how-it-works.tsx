import { Container, Section } from "@/components/marketing/container";
import { SectionHeading } from "@/components/marketing/section-heading";
import { HOW_IT_WORKS } from "@/lib/marketing";

export function HowItWorks() {
  return (
    <Section id="how-it-works" className="bg-muted/40">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="Three steps from brief to clipboard."
          description="No social scheduling, no extra tabs. Write here, publish where your audience already is."
        />
        <ol className="grid gap-4 lg:grid-cols-3">
          {HOW_IT_WORKS.map((item) => (
            <li
              key={item.step}
              className="relative rounded-2xl border border-border bg-card p-6 shadow-surface transition-all duration-200 motion-safe:hover:-translate-y-1 hover:border-brand/35"
            >
              <span className="font-mono text-sm font-semibold text-brand">
                {item.step}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.body}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
