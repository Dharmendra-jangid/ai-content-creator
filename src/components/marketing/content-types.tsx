import {
  Briefcase,
  Camera,
  Clapperboard,
  FileText,
  Mail,
  Megaphone,
  ShoppingBag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Container, Section } from "@/components/marketing/container";
import { SectionHeading } from "@/components/marketing/section-heading";
import { CONTENT_TYPES } from "@/lib/marketing";

const ICONS: Record<(typeof CONTENT_TYPES)[number]["id"], LucideIcon> = {
  instagram: Camera,
  linkedin: Briefcase,
  youtube: Clapperboard,
  blog: FileText,
  product: ShoppingBag,
  marketing: Megaphone,
  email: Mail,
};

export function ContentTypes() {
  return (
    <Section id="content-types">
      <Container>
        <SectionHeading
          eyebrow="Supported content"
          title="Seven formats. One workspace."
          description="Each card opens the generator with that channel in mind. Copy stays on the clipboard until you paste it into the native app."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CONTENT_TYPES.map((item) => {
            const Icon = ICONS[item.id];

            return (
              <Link
                key={item.id}
                href={`/generate?platform=${toPlatformQuery(item.id)}`}
                aria-label={`Generate ${item.title}`}
                className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-surface transition-all duration-200 motion-safe:hover:-translate-y-1 hover:border-brand/35 hover:shadow-lg"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-muted text-foreground transition-colors group-hover:bg-brand-soft group-hover:text-brand">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
                <p className="mt-4 text-sm font-medium text-brand">{item.example}</p>
              </Link>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

function toPlatformQuery(id: (typeof CONTENT_TYPES)[number]["id"]): string {
  if (id === "product" || id === "marketing") {
    return "blog";
  }

  return id;
}
