import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: {
    href: string;
    label: string;
  };
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <Link href={action.href} className={cn(buttonVariants(), "w-fit")}>
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}

export function PreviewBanner() {
  return (
    <div className="mb-6 rounded-xl border border-brand/20 bg-brand-soft px-4 py-3 text-sm text-brand">
      You are signed in. Credits are tracked on your account. History still uses
      sample data.
    </div>
  );
}
