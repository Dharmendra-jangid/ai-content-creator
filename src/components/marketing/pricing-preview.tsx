import Link from "next/link";

import { PricingCards } from "@/components/billing/pricing-cards";
import { Container, Section } from "@/components/marketing/container";
import { SectionHeading } from "@/components/marketing/section-heading";

export function PricingPreview() {
  return (
    <Section id="pricing" className="bg-muted/40">
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          title="Start free. Upgrade when the volume shows up."
          description="Credits reset every month. Paid plans will debit through Razorpay on the server — never from a hidden client call."
        />
        <PricingCards />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/pricing" className="font-medium text-brand hover:underline">
            Compare plans
          </Link>
          {" · "}
          Checkout is designed, but Razorpay is not collecting payment yet.
        </p>
      </Container>
    </Section>
  );
}
