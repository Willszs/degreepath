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

function normalizeDegree(value: string): DaadProgram["degree"] {
  if (value === "MA" || value === "MBA") return value;
  return "MSc";
}

async function recommendFromDaadWeb(
  answers: ShortlistAnswers,
  lang: "zh" | "en",
): Promise<ApiResult[] | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

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

  if (!response.ok) return null;
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
  if (!raw) return null;

  const jsonText = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "");
  const parsed = JSON.parse(jsonText) as {
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
  const items = parsed.items ?? [];
  if (items.length === 0) return null;

  return items
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
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { lang?: "zh" | "en"; answers?: ShortlistAnswers };
    const lang = body.lang === "en" ? "en" : "zh";
    const answers = body.answers ?? {};
    const aiResults = await recommendFromDaadWeb(answers, lang);
    if (!aiResults || aiResults.length === 0) {
      return NextResponse.json(
        {
          error:
            lang === "en"
              ? "Unable to generate DAAD-based recommendations right now."
              : "暂时无法生成基于 DAAD 官网的推荐。",
        },
        { status: 503 },
      );
    }

    return NextResponse.json({ results: aiResults });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate shortlist", detail: String(error) },
      { status: 400 },
    );
  }
}
