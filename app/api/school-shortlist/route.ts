import { NextResponse } from "next/server";
import type { DaadProgram, ShortlistAnswers } from "@/lib/school-shortlist";

type ApiResult = {
  id: string;
  programName: string;
  university: string;
  city: string;
  degree: DaadProgram["degree"];
  reason: string;
};

class RecommendationError extends Error {
  status: number;
  detail?: string;

  constructor(message: string, status = 500, detail?: string) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

function normalizeDegree(value: string): DaadProgram["degree"] {
  if (value === "MA" || value === "MBA") return value;
  return "MSc";
}

async function recommendFromDaadWeb(
  answers: ShortlistAnswers,
  lang: "zh" | "en",
): Promise<ApiResult[] | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new RecommendationError("Missing OPENAI_API_KEY", 500);
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-5-mini";
  const system =
    "You are a study-abroad advisor for Germany. Data source constraint: use ONLY DAAD official website data (domain daad.de)." +
    " Do not use any non-DAAD source. Return strict JSON only with this shape: " +
    '{"items":[{"id":"string","programName":"string","university":"string","city":"string","degree":"MSc|MA|MBA","reason":"string","sourceUrl":"https://..."}]}.' +
    " Exactly 8 items.";
  const user = JSON.stringify({ lang, answers }, null, 2);

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      tools: [{ type: "web_search_preview", search_context_size: "medium" }],
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: system }],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                `Use DAAD website only. Prefer pages under https://www.daad.de/ and DAAD degree database pages. ` +
                `If you cannot find enough DAAD-backed programs, return fewer and explain in reason. ` +
                `Questionnaire answers:\n${user}`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new RecommendationError("OpenAI request failed", response.status, errText.slice(0, 1200));
  }
  const data = (await response.json()) as {
    output_text?: string;
    output?: Array<{
      content?: Array<{ type?: string; text?: string }>;
    }>;
  };
  const raw =
    data.output_text ??
    data.output
      ?.flatMap((item) => item.content ?? [])
      .find((item) => item.type === "output_text")
      ?.text;
  if (!raw) {
    throw new RecommendationError("OpenAI returned empty content", 502);
  }

  const jsonText = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "");
  let parsed: {
    items?: Array<{
      id?: string;
      programName?: string;
      university?: string;
      city?: string;
      degree?: string;
      reason?: string;
      sourceUrl?: string;
    }>;
  };
  try {
    parsed = JSON.parse(jsonText) as typeof parsed;
  } catch {
    throw new RecommendationError("Invalid JSON from OpenAI", 502, jsonText.slice(0, 1200));
  }
  const items = parsed.items ?? [];
  if (items.length === 0) {
    throw new RecommendationError("No recommendations returned by OpenAI", 502);
  }

  const filtered = items
    .filter(
      (item) =>
        item.programName &&
        item.university &&
        item.city &&
        typeof item.sourceUrl === "string" &&
        item.sourceUrl.includes("daad.de"),
    )
    .slice(0, 8)
    .map((item, index) => ({
      id: item.id?.trim() || `daad-${index + 1}`,
      programName: String(item.programName),
      university: String(item.university),
      city: String(item.city),
      degree: normalizeDegree(String(item.degree ?? "MSc")),
      reason: String(item.reason ?? ""),
    }));

  if (filtered.length === 0) {
    throw new RecommendationError("No DAAD-domain recommendations after filtering", 502);
  }

  return filtered;
}

export async function POST(req: Request) {
  let lang: "zh" | "en" = "zh";
  try {
    const body = (await req.json()) as { lang?: "zh" | "en"; answers?: ShortlistAnswers };
    lang = body.lang === "en" ? "en" : "zh";
    const answers = body.answers ?? {};
    const aiResults = await recommendFromDaadWeb(answers, lang);
    return NextResponse.json({ results: aiResults });
  } catch (error) {
    const err = error instanceof RecommendationError ? error : null;
    const isDev = process.env.NODE_ENV !== "production";
    const status = err?.status ?? 400;
    const message =
      status === 401
        ? "OpenAI key is invalid."
        : status === 403
          ? "OpenAI access is forbidden for this model/tool."
          : status === 429
            ? "OpenAI quota/rate limit exceeded."
            : status >= 500
              ? "Unable to generate DAAD-based recommendations right now."
              : "Failed to generate shortlist.";
    return NextResponse.json(
      {
        error: lang === "en" ? message : "暂时无法生成基于 DAAD 官网的推荐。",
        detail: isDev ? (err?.detail ?? String(error)) : undefined,
      },
      { status },
    );
  }
}
