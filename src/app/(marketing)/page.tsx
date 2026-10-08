import { ContentTypes } from "@/components/marketing/content-types";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { Faq } from "@/components/marketing/faq";
import { Features } from "@/components/marketing/features";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { PricingPreview } from "@/components/marketing/pricing-preview";

export default function MarketingPage() {
  return (
    <main id="main">
      <Hero />
      <Features />
      <HowItWorks />
      <ContentTypes />
      <PricingPreview />
      <Faq />
      <CtaBanner />
    </main>
  );
}
