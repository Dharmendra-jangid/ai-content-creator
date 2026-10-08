import "server-only";

import {
  CONTENT_TYPES,
  GENERATOR_PLATFORMS,
  LANGUAGES,
  LENGTHS,
  TONES,
} from "@/lib/constants";
import { getOptionLabel } from "@/lib/generator";
import { resolveContentFamily } from "@/lib/ai/prompt/family";
import {
  CONTENT_TYPE_PLAYBOOKS,
  getLengthPlaybook,
  LANGUAGE_PLAYBOOKS,
  PLATFORM_PLAYBOOKS,
  shouldIncludeHashtags,
  TONE_PLAYBOOKS,
} from "@/lib/ai/prompt/playbooks";
import {
  buildOutputSections,
  formatHeadingList,
  formatSectionContract,
} from "@/lib/ai/prompt/sections";
import type {
  PromptBlueprint,
  PromptBrief,
  ResolvedPromptContext,
} from "@/lib/ai/prompt/types";

const ROLE_INSTRUCTION = [
  "You are Aurateria, a senior editor for social, video, email, and marketing.",
  "Write high-quality copy a creator can publish with light editing, not a brainstorm dump.",
  "Match the brief exactly: platform, format, audience, tone, language, and length.",
  "Return only the finished draft using the requested section headings.",
  "No preamble, no recap of the brief, no markdown fences, no “here is your caption”.",
  "Do not mention that you are an AI. Do not invent facts, prices, discounts, testimonials, or statistics.",
].join(" ");

export function buildContentGenerationPrompt(input: PromptBrief): PromptBlueprint {
  const context = resolvePromptContext(input);
  return {
    family: context.family,
    sections: context.sections,
    systemInstruction: buildSystemInstruction(context),
    userPrompt: buildUserPrompt(context),
    maxOutputTokens: context.length.maxOutputTokens,
  };
}

export function resolvePromptContext(input: PromptBrief): ResolvedPromptContext {
  const family = resolveContentFamily(input.platform, input.contentType);
  const platform = PLATFORM_PLAYBOOKS[input.platform];
  const includeHashtags = shouldIncludeHashtags(
    family,
    input.platform,
    input.contentType,
  );

  return {
    input,
    family,
    platform,
    contentType: CONTENT_TYPE_PLAYBOOKS[input.contentType],
    tone: TONE_PLAYBOOKS[input.tone],
    language: LANGUAGE_PLAYBOOKS[input.language],
    length: getLengthPlaybook(family, input.length),
    audience: input.audience.trim() || "a general audience for this channel",
    labels: {
      platform: getOptionLabel(GENERATOR_PLATFORMS, input.platform),
      contentType: getOptionLabel(CONTENT_TYPES, input.contentType),
      tone: getOptionLabel(TONES, input.tone),
      language: getOptionLabel(LANGUAGES, input.language),
      length: getOptionLabel(LENGTHS, input.length),
    },
    sections: buildOutputSections({
      family,
      platform: input.platform,
      contentType: input.contentType,
      includeHashtags,
    }),
    includeHashtags,
  };
}

function buildSystemInstruction(context: ResolvedPromptContext) {
  return [
    ROLE_INSTRUCTION,
    `Write the entire output in ${context.language.outputIn}. ${context.language.scriptRule}`,
    `Tone: ${context.tone.voice} Avoid: ${context.tone.avoid.join(", ")}.`,
    `Channel: ${context.platform.displayName}. ${context.platform.firstLineRule}`,
  ].join(" ");
}

function buildUserPrompt(context: ResolvedPromptContext) {
  const headingOrder = formatHeadingList(context.sections);
  const sectionContract = formatSectionContract(context.sections);

  return [
    "Write one publish-ready piece from this brief.",
    "",
    "BRIEF",
    `Platform: ${context.labels.platform}`,
    `Content type: ${context.labels.contentType}`,
    `Topic: ${context.input.topic.trim()}`,
    `Target audience: ${context.audience}`,
    `Tone: ${context.labels.tone}`,
    `Language: ${context.labels.language}`,
    `Length: ${context.labels.length} (${context.length.target})`,
    `Format family: ${familyLabel(context.family)}`,
    "",
    "CRAFT",
    context.contentType.craft,
    ...context.contentType.rules.map((rule) => `- ${rule}`),
    ...context.platform.channelRules.map((rule) => `- ${rule}`),
    `- ${context.length.instruction}`,
    "",
    "OUTPUT CONTRACT",
    `Use these section headings in this order: ${headingOrder}.`,
    "Put each heading on its own line in CAPITALS as written. Put the copy under it. Skip any other headings.",
    sectionContract,
    "",
    "Output the draft only.",
  ].join("\n");
}

function familyLabel(family: ResolvedPromptContext["family"]) {
  switch (family) {
    case "social":
      return "social post — hook, main content, CTA, hashtags when they help";
    case "short_video":
      return "short-form video — hook, filmable script, CTA, hashtags when they help";
    case "youtube":
      return "YouTube package — title ideas, hook, script, CTA";
    case "marketing":
      return "marketing copy — headline, main copy, benefits, CTA";
    case "editorial":
      return "editorial article — title, hook, draft, CTA";
    case "email":
      return "email — subject, body, CTA";
  }
}
