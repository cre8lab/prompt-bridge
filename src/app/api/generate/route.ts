import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { SYSTEM_PROMPT } from "@/lib/systemPrompt";
import type { GenerateRequest, GenerateResult } from "@/lib/types";

const VALID_MODES = [
  "Practical",
  "Deep",
  "Skeptical",
  "Beginner-friendly",
  "Technical",
  "Business-focused",
  "Social Reply + Claude Prompt",
];
const VALID_LENGTHS = ["Short", "Balanced", "Detailed"];
const MAX_INPUT_LENGTH = 4000;

function sanitizeField(value: string, maxLen = 80): string {
  return value.replace(/[\x00-\x1F\x7F]/g, "").slice(0, maxLen);
}

function buildUserMessage(body: GenerateRequest): string {
  const { rawQuestion, contextCard } = body;
  return `Context Card:
- Device: ${sanitizeField(contextCard.deviceClass)}
- Language: ${sanitizeField(contextCard.browserLanguage)}
- Timezone: ${sanitizeField(contextCard.timezone)}
- Mode: ${sanitizeField(contextCard.selectedMode)}
- Length: ${sanitizeField(contextCard.selectedLength)}

Raw input:
${rawQuestion}

Generate the JSON output now.`;
}

export async function POST(req: NextRequest) {
  let body: GenerateRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { rawQuestion, contextCard } = body;

  if (!rawQuestion || typeof rawQuestion !== "string" || rawQuestion.trim().length === 0) {
    return NextResponse.json({ error: "rawQuestion is required and must not be empty." }, { status: 400 });
  }

  if (rawQuestion.length > MAX_INPUT_LENGTH) {
    return NextResponse.json(
      { error: `Input is too long. Maximum ${MAX_INPUT_LENGTH} characters allowed.` },
      { status: 400 }
    );
  }

  if (!contextCard || !VALID_MODES.includes(contextCard.selectedMode)) {
    return NextResponse.json({ error: "Invalid or missing selectedMode." }, { status: 400 });
  }

  if (!VALID_LENGTHS.includes(contextCard.selectedLength)) {
    return NextResponse.json({ error: "Invalid selectedLength." }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Server is not configured with an API key." }, { status: 500 });
  }

  const client = new OpenAI({ apiKey });

  let rawContent: string;
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserMessage(body) },
      ],
      temperature: 0.4,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });
    rawContent = completion.choices[0]?.message?.content ?? "";
  } catch (err) {
    console.error("OpenAI error:", err);
    return NextResponse.json({ error: "Failed to reach the AI service. Please try again." }, { status: 502 });
  }

  let result: GenerateResult;
  try {
    const cleaned = rawContent.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    result = JSON.parse(cleaned);
  } catch {
    console.error("LLM returned non-JSON:", rawContent);
    return NextResponse.json(
      { error: "The AI returned an unexpected response. Please try again." },
      { status: 502 }
    );
  }

  const required: (keyof GenerateResult)[] = [
    "cleaned_intent",
    "assumptions",
    "social_reply",
    "claude_prompt",
    "short_version",
    "suggested_adjustments",
  ];
  for (const key of required) {
    if (!(key in result)) {
      return NextResponse.json(
        { error: "The AI response was incomplete. Please try again." },
        { status: 502 }
      );
    }
  }

  return NextResponse.json(result);
}
