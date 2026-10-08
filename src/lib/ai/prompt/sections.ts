import type { ContentType, GeneratorPlatform } from "@/types";

import {
  hashtagInstruction,
  PLATFORM_PLAYBOOKS,
} from "@/lib/ai/prompt/playbooks";
import type {
  ContentFamily,
  HashtagPolicy,
  OutputSectionId,
  OutputSectionSpec,
} from "@/lib/ai/prompt/types";

const SECTION_LIBRARY = {
  subject: {
    id: "subject",
    heading: "SUBJECT LINE",
    instruction:
      "One subject line that earns the open. No ALL CAPS spam, no fake “Re:”.",
  },
  titles: {
    id: "titles",
    heading: "TITLE IDEAS",
    instruction:
      "Give 3–5 YouTube title options. Specific, clickable, honest. No bait-and-switch.",
  },
  headline: {
    id: "headline",
    heading: "HEADLINE",
    instruction:
      "One strong headline. Lead with the outcome or the tension the audience already feels.",
  },
  hook: {
    id: "hook",
    heading: "HOOK",
    instruction:
      "An attention-grabbing opening. For video, this is the first 8–15 seconds. For social, this is the first line that stops the scroll.",
  },
  main: {
    id: "main",
    heading: "MAIN",
    instruction:
      "The core copy: useful, specific, and ready to publish. Pay off the hook. Do not repeat the brief.",
  },
  script: {
    id: "script",
    heading: "VIDEO SCRIPT",
    instruction:
      "A filmable script with labeled beats (HOOK, ON-SCREEN TEXT, VOICEOVER or SPOKEN, VISUALS, CTA). Spoken lines must sound natural out loud.",
  },
  benefits: {
    id: "benefits",
    heading: "BENEFITS",
    instruction:
      "3–5 concrete benefits as short bullets. Translate features into outcomes. Invent nothing.",
  },
  cta: {
    id: "cta",
    heading: "CALL TO ACTION",
    instruction:
      "One clear next step. Specific and doable (comment, save, watch, reply, visit). Not “learn more” with no object.",
  },
  hashtags: {
    id: "hashtags",
    heading: "HASHTAGS",
    instruction: "Relevant hashtags only, on their own lines or a single trailing block.",
  },
} as const satisfies Record<OutputSectionId, OutputSectionSpec>;

function withHashtagCopy(
  spec: OutputSectionSpec,
  platform: GeneratorPlatform,
  policy: HashtagPolicy,
): OutputSectionSpec {
  if (spec.id !== "hashtags") {
    return spec;
  }

  return {
    ...spec,
    instruction: hashtagInstruction(platform, policy),
  };
}

function socialSections(
  platform: GeneratorPlatform,
  includeHashtags: boolean,
): OutputSectionSpec[] {
  const sections: OutputSectionSpec[] = [
    SECTION_LIBRARY.hook,
    {
      ...SECTION_LIBRARY.main,
      heading: "MAIN CONTENT",
      instruction:
        "The body of the post or caption. Short paragraphs, native line breaks, worth reading after the hook.",
    },
    SECTION_LIBRARY.cta,
  ];

  if (includeHashtags) {
    sections.push(
      withHashtagCopy(
        SECTION_LIBRARY.hashtags,
        platform,
        PLATFORM_PLAYBOOKS[platform].hashtagPolicy,
      ),
    );
  }

  return sections;
}

function shortVideoSections(
  platform: GeneratorPlatform,
  includeHashtags: boolean,
): OutputSectionSpec[] {
  const sections: OutputSectionSpec[] = [
    {
      ...SECTION_LIBRARY.hook,
      instruction:
        "A pattern-interrupt opening the viewer hears or sees in the first 1–3 seconds, plus the line that follows.",
    },
    SECTION_LIBRARY.script,
    SECTION_LIBRARY.cta,
  ];

  if (includeHashtags) {
    sections.push(
      withHashtagCopy(
        SECTION_LIBRARY.hashtags,
        platform,
        PLATFORM_PLAYBOOKS[platform].hashtagPolicy,
      ),
    );
  }

  return sections;
}

function youtubeSections(
  contentType: ContentType,
  includeHashtags: boolean,
): OutputSectionSpec[] {
  const scriptHeading =
    contentType === "caption" ? "DESCRIPTION" : "VIDEO SCRIPT";
  const scriptInstruction =
    contentType === "caption"
      ? "A YouTube description: hook in the first two lines, then the body, timestamps only if length is long. Ready to paste under the video."
      : SECTION_LIBRARY.script.instruction;

  const sections: OutputSectionSpec[] = [
    SECTION_LIBRARY.titles,
    {
      ...SECTION_LIBRARY.hook,
      instruction:
        "The spoken (or description) hook: first 8–15 seconds / first two lines. Preview the payoff without giving it all away.",
    },
    {
      ...SECTION_LIBRARY.script,
      heading: scriptHeading,
      instruction: scriptInstruction,
    },
    SECTION_LIBRARY.cta,
  ];

  if (includeHashtags) {
    sections.push(
      withHashtagCopy(SECTION_LIBRARY.hashtags, "youtube", "light"),
    );
  }

  return sections;
}

function marketingSections(): OutputSectionSpec[] {
  return [
    SECTION_LIBRARY.headline,
    {
      ...SECTION_LIBRARY.main,
      heading: "MAIN COPY",
      instruction:
        "The primary ad or product text. Specific, benefit-led, ready to paste. No invented proof.",
    },
    SECTION_LIBRARY.benefits,
    SECTION_LIBRARY.cta,
  ];
}

function editorialSections(): OutputSectionSpec[] {
  return [
    {
      ...SECTION_LIBRARY.headline,
      heading: "TITLE",
      instruction: "One publishable title. Specific over clever.",
    },
    {
      ...SECTION_LIBRARY.hook,
      instruction: "The opening that makes the reader stay. No “In today’s world”.",
    },
    {
      ...SECTION_LIBRARY.main,
      heading: "ARTICLE",
      instruction:
        "The full draft with short sections and headings. Useful, concrete, ready to edit not invent from scratch.",
    },
    SECTION_LIBRARY.cta,
  ];
}

function emailSections(contentType: ContentType): OutputSectionSpec[] {
  const sections: OutputSectionSpec[] = [
    SECTION_LIBRARY.subject,
    {
      ...SECTION_LIBRARY.hook,
      instruction: "The opening lines after the greeting. Earn the next sentence.",
    },
    {
      ...SECTION_LIBRARY.main,
      heading: "BODY",
      instruction: "The email body. Scannable. One idea that leads to the CTA.",
    },
  ];

  if (
    contentType === "product_description" ||
    contentType === "advertisement_copy"
  ) {
    sections.push(SECTION_LIBRARY.benefits);
  }

  sections.push(SECTION_LIBRARY.cta);
  return sections;
}

export function buildOutputSections(options: {
  family: ContentFamily;
  platform: GeneratorPlatform;
  contentType: ContentType;
  includeHashtags: boolean;
}): readonly OutputSectionSpec[] {
  const { family, platform, contentType, includeHashtags } = options;

  switch (family) {
    case "social":
      return socialSections(platform, includeHashtags);
    case "short_video":
      return shortVideoSections(platform, includeHashtags);
    case "youtube":
      return youtubeSections(contentType, includeHashtags);
    case "marketing":
      return marketingSections();
    case "editorial":
      return editorialSections();
    case "email":
      return emailSections(contentType);
  }
}

export function formatSectionContract(sections: readonly OutputSectionSpec[]) {
  return sections
    .map(
      (section, index) =>
        `${index + 1}. ${section.heading}\n   ${section.instruction}`,
    )
    .join("\n");
}

export function formatHeadingList(sections: readonly OutputSectionSpec[]) {
  return sections.map((section) => section.heading).join(" → ");
}
