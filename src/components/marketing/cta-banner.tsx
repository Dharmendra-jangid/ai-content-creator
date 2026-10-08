import Link from "next/link";

import { Container, Section } from "@/components/marketing/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaBanner() {
  return (
    <Section className="pt-0">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-brand/25 bg-brand-soft px-6 py-14 text-center sm:px-12">
          <div className="hero-glow pointer-events-none absolute inset-0 opacity-70" />
          <div className="relative">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Write the next post before the feed needs it.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Create a free workspace, spend a few credits, and copy a draft you
              would actually publish. Upgrade only when the volume justifies it.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/signup" className={cn(buttonVariants({ size: "lg" }))}>
                Create your workspace
              </Link>
              <Link
                href="/generate"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                Open the generator
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
