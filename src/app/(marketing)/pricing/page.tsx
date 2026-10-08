import type { Metadata } from "next";

import { PlanComparison } from "@/components/billing/plan-comparison";
import { PricingCards } from "@/components/billing/pricing-cards";
import { Container, Section } from "@/components/marketing/container";
import { SectionHeading } from "@/components/marketing/section-heading";
import { getCurrentUserProfile } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Free, Pro, and Business plans for Aurateria. Start with 10 generations a month, then upgrade when volume shows up.",
};

export default async function PricingPage() {
  const user = await getCurrentUserProfile();

  return (
    <main id="main">
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Pricing"
            title="Start free. Upgrade when the volume shows up."
            description="Each generation uses one credit. Paid plans will charge through Razorpay on the server — never from a key in the browser."
          />
          <PricingCards currentPlan={user?.plan} signedIn={Boolean(user)} />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Checkout is designed and recorded, but Razorpay does not collect payment yet.
          </p>
        </Container>
      </Section>
      <Section className="bg-muted/40 pt-0 sm:pt-0">
        <Container>
          <SectionHeading
            eyebrow="Compare"
            title="What you get on each plan"
            description="Free is enough to learn the workflow. Pro and Business raise the monthly generation cap."
          />
          <PlanComparison currentPlan={user?.plan} />
        </Container>
      </Section>
    </main>
  );
}
