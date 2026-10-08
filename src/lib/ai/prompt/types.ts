import type { GeneratorInput } from "@/types";

export const CONTENT_FAMILIES = [
  "social",
  "short_video",
  "youtube",
  "marketing",
  "editorial",
  "email",
] as const;

export type ContentFamily = (typeof CONTENT_FAMILIES)[number];

export const OUTPUT_SECTION_IDS = [
  "subject",
  "titles",
  "headline",
  "hook",
  "main",
  "script",
  "benefits",
  "cta",
  "hashtags",
] as const;

export type OutputSectionId = (typeof OUTPUT_SECTION_IDS)[number];

export type HashtagPolicy = "none" | "light" | "standard";

export type OutputSectionSpec = {
  id: OutputSectionId;
  heading: string;
  instruction: string;
};

export type PlatformPlaybook = {
  displayName: string;
  firstLineRule: string;
  channelRules: readonly string[];
  hashtagPolicy: HashtagPolicy;
};

export type ContentTypePlaybook = {
  craft: string;
  rules: readonly string[];
};

export type TonePlaybook = {
  voice: string;
  avoid: readonly string[];
};

export type LanguagePlaybook = {
  outputIn: string;
  scriptRule: string;
};

export type LengthPlaybook = {
  target: string;
  instruction: string;
  maxOutputTokens: number;
};

export type PromptBlueprint = {
  family: ContentFamily;
  sections: readonly OutputSectionSpec[];
  systemInstruction: string;
  userPrompt: string;
  maxOutputTokens: number;
};

export type PromptBrief = GeneratorInput;

export type ResolvedPromptContext = {
  input: PromptBrief;
  family: ContentFamily;
  platform: PlatformPlaybook;
  contentType: ContentTypePlaybook;
  tone: TonePlaybook;
  language: LanguagePlaybook;
  length: LengthPlaybook;
  audience: string;
  labels: {
    platform: string;
    contentType: string;
    tone: string;
    language: string;
    length: string;
  };
  sections: readonly OutputSectionSpec[];
  includeHashtags: boolean;
};
