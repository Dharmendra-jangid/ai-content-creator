import Link from "next/link";

import { Container } from "@/components/marketing/container";
import { Logo } from "@/components/layout/logo";
import { siteConfig } from "@/config/site";
import { MARKETING_NAV } from "@/lib/marketing";

const WORKSPACE_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/generate", label: "Generate" },
  { href: "/history", label: "History" },
] as const;

const ACCOUNT_LINKS = [
  { href: "/login", label: "Sign in" },
  { href: "/signup", label: "Create account" },
  { href: "/billing", label: "Billing" },
] as const;

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-sidebar">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
              {siteConfig.description}
            </p>
            <a
              href={siteConfig.website}
              className="mt-3 inline-block text-sm font-medium text-brand hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              aurateria.com
            </a>
          </div>
          <FooterColumn title="Product" links={MARKETING_NAV} />
          <FooterColumn title="Workspace" links={WORKSPACE_LINKS} />
          <FooterColumn title="Account" links={ACCOUNT_LINKS} />
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.company}. All rights reserved.
          </p>
          <p>AI generation runs on the server. API keys stay off the client.</p>
        </div>
      </Container>
    </footer>
  );
}

type FooterLink = {
  href: string;
  label: string;
};

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly FooterLink[];
}) {
  return (
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            {link.href.startsWith("#") ? (
              <a
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
