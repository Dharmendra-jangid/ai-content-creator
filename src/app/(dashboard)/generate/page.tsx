import type { Metadata } from "next";

import { ContentGeneratorForm } from "@/components/generate/content-generator-form";
import { PageHeader, PreviewBanner } from "@/components/dashboard/page-header";
import { isGeneratorPlatform } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Generate",
};

export default async function GeneratePage({
  searchParams,
}: {
  searchParams: Promise<{ platform?: string }>;
}) {
  const params = await searchParams;
  const platform = isGeneratorPlatform(params.platform)
    ? params.platform
    : undefined;

  return (
    <div className="mx-auto max-w-6xl">
      <PreviewBanner />
      <PageHeader
        title="Generate"
        description="Pick a platform, describe the topic, and generate a draft you can copy, regenerate, or save."
      />
      <ContentGeneratorForm initialPlatform={platform} />
    </div>
  );
}
