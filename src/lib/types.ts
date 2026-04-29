export type Mode =
  | "Practical"
  | "Deep"
  | "Skeptical"
  | "Beginner-friendly"
  | "Technical"
  | "Business-focused"
  | "Social Reply + Claude Prompt";

export type Length = "Short" | "Balanced" | "Detailed";

export interface ContextCard {
  deviceClass: "mobile" | "tablet" | "desktop";
  browserLanguage: string;
  timezone: string;
  selectedMode: Mode;
  selectedLength: Length;
  pageCategory: "prompt_builder";
  anonymousPreferences: string[];
}

export interface GenerateRequest {
  rawQuestion: string;
  contextCard: ContextCard;
}

export interface GenerateResult {
  cleaned_intent: string;
  assumptions: string[];
  social_reply: string;
  claude_prompt: string;
  short_version: string;
  suggested_adjustments: string[];
}
