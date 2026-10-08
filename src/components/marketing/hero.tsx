import Link from "next/link";

import { HeroPreview } from "@/components/marketing/hero-preview";
import { Container } from "@/components/marketing/container";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { HERO_STATS } from "@/lib/marketing";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-12 sm:pb-24 sm:pt-16">
      <div className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[560px]" />
      <div className="app-grid pointer-events-none absolute inset-x-0 top-0 h-[560px]" />
      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div>
            <Badge variant="brand">{siteConfig.tagline}</Badge>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08]">
              Generate content that is ready to publish, not rewrite.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Aurateria drafts Instagram captions, LinkedIn posts, YouTube scripts,
              blog ideas, product copy, campaigns, and email — in the format each
              channel actually uses.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className={cn(buttonVariants({ size: "lg" }))}>
                Start for free
              </Link>
              <Link
                href="/dashboard"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                Preview the product
              </Link>
            </div>
            <dl className="mt-10 grid grid-cols-1 gap-5 border-t border-border pt-8 sm:grid-cols-3 sm:gap-4">
              {HERO_STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-xs text-muted-foreground">{stat.label}</dt>
                  <dd className="mt-1 font-mono text-lg font-semibold sm:text-xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <HeroPreview />
        </div>
      </Container>
    </section>
  );
}
