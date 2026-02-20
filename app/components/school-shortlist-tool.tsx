"use client";

import { useMemo, useState } from "react";
import type { Lang } from "@/lib/i18n";
import { shortlistSchools } from "@/lib/school-shortlist";
import questionnaire from "@/content/school-shortlist-questionnaire.json";

type Props = { lang: Lang };

type Option = { value: string; label: { zh: string; en: string } };
type Question = {
  id: string;
  type: "options" | "input" | "gpa";
  title: { zh: string; en: string };
  options?: Option[];
  placeholder?: { zh: string; en: string };
};
type Section = {
  id: string;
  icon: string;
  title: { zh: string; en: string };
  questions: Question[];
};

type Answers = Record<string, string>;

const sections = questionnaire.sections as Section[];
const initialAnswers: Answers = { gpaScale: "4", gpaValue: "" };

function mapBudget(value: string): "low" | "medium" | "high" {
  if (value === "under_700" || value === "700_1000") return "low";
  if (value === "1000_1300") return "medium";
  return "high";
}

function mapCitySize(value: string): "small" | "medium" | "large" {
  if (value === "small") return "small";
  if (value === "medium") return "medium";
  return "large";
}

function mapEnglishOnly(value: string): boolean {
  return value === "english";
}

function mapIelts(value: string): number {
  if (["ielts_7_plus", "toefl_100_plus", "tdn5", "dsh3"].includes(value)) return 7;
  if (["ielts_65_70", "toefl_90_100", "c1", "tdn4", "dsh2"].includes(value)) return 6.5;
  if (["ielts_6_65", "toefl_80_90", "b2", "dsh1"].includes(value)) return 6;
  return 5.5;
}

function mapIntake(value: string): "winter" | "summer" | "both" {
  if (value === "yes") return "winter";
  return "both";
}

function categoryKeyword(value: string): string {
  const map: Record<string, string> = {
    engineering: "engineering mechanical electrical",
    cs_it: "computer data software ai",
    business: "business economics management",
    science: "physics chemistry biology materials",
    social: "social policy law",
    design: "design media art",
  };
  return map[value] ?? value;
}

function directionKeyword(value: string): string {
  const map: Record<string, string> = {
    theory: "research theory",
    practice: "practice applied",
    tech_mgmt: "technology management",
    salary: "employment industry",
    interest: "interest focus",
  };
  return map[value] ?? value;
}

export default function SchoolShortlistTool({ lang }: Props) {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [loading, setLoading] = useState(false);

  const section = sections[currentSection];
  const progress = Math.round(((currentSection + 1) / sections.length) * 100);

  const t =
    lang === "en"
      ? {
          title: "School Shortlist Questionnaire",
          subtitle: "7 structured blocks · 21 questions",
          prev: "Previous",
          next: "Next",
          run: "Generate 8 Schools",
          analyzing: "Analyzing your profile...",
          reset: "Reset",
          score: "Fit Score",
          reason: "Reason",
        }
      : {
          title: "学校初选问卷",
          subtitle: "7个结构化模块 · 21个问题",
          prev: "上一部分",
          next: "下一部分",
          run: "生成 8 所学校",
          analyzing: "正在分析你的画像...",
          reset: "重置问卷",
          score: "匹配分",
          reason: "推荐理由",
        };

  const results = useMemo(() => {
    const keyword = [
      categoryKeyword(answers.programCategory ?? ""),
      directionKeyword(answers.trainingDirection ?? ""),
      answers.undergraduateMajor ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return shortlistSchools(
      {
        programKeyword: keyword,
        budget: mapBudget(answers.monthlyBudget ?? "no_limit"),
        englishOnly: mapEnglishOnly(answers.teachingLanguage ?? "no_pref"),
        languageScore: mapIelts(answers.englishScore ?? "none"),
        citySize: mapCitySize(answers.citySize ?? "large"),
        intake: mapIntake(answers.mustThisYear ?? "not_sure"),
      },
      lang,
    );
  }, [answers, lang]);

  const setAnswer = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const onGenerate = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
  };

  return (
    <section className="paper rounded-3xl p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-semibold">{t.title}</h2>
          <p className="mt-1 text-sm muted">{t.subtitle}</p>
        </div>
        <div className="rounded-full border border-[var(--line)] bg-white px-3 py-1 text-xs font-semibold">{progress}%</div>
      </div>

      <div className="mt-4 h-2 rounded-full bg-white">
        <div className="h-2 rounded-full bg-[var(--accent)] transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="space-y-2">
          {sections.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentSection(idx)}
              className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition ${
                idx === currentSection ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--line)] bg-white/70"
              }`}
            >
              <span>{s.icon}</span>
              <span>{s.title[lang]}</span>
            </button>
          ))}
        </aside>

        <div className="rounded-2xl border border-[var(--line)] bg-white/80 p-5 transition-all duration-300">
          <h3 className="text-xl font-semibold">{section.title[lang]}</h3>

          <div className="mt-4 space-y-6">
            {section.questions.map((q) => {
              if (q.type === "input") {
                return (
                  <div key={q.id}>
                    <div className="text-sm font-medium">{q.title[lang]}</div>
                    <input
                      value={answers[q.id] ?? ""}
                      onChange={(e) => setAnswer(q.id, e.target.value)}
                      placeholder={q.placeholder?.[lang] ?? ""}
                      className="mt-2 w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                );
              }

              if (q.type === "gpa") {
                return (
                  <div key={q.id}>
                    <div className="text-sm font-medium">{q.title[lang]}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(["4", "100"] as const).map((scale) => (
                        <button
                          type="button"
                          key={scale}
                          onClick={() => setAnswer("gpaScale", scale)}
                          className={`rounded-full border px-3 py-1 text-sm ${answers.gpaScale === scale ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--line)] bg-white"}`}
                        >
                          {scale === "4" ? "4分制" : "百分制"}
                        </button>
                      ))}
                    </div>
                    <input
                      value={answers.gpaValue ?? ""}
                      onChange={(e) => setAnswer("gpaValue", e.target.value)}
                      placeholder={answers.gpaScale === "4" ? "例如 3.2" : "例如 82"}
                      className="mt-2 w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                );
              }

              return (
                <div key={q.id}>
                  <div className="text-sm font-medium">{q.title[lang]}</div>
                  <div className="mt-2 grid gap-2 md:grid-cols-2">
                    {(q.options ?? []).map((opt) => (
                      <button
                        type="button"
                        key={opt.value}
                        onClick={() => setAnswer(q.id, opt.value)}
                        className={`rounded-xl border px-4 py-2 text-left text-sm transition ${
                          answers[q.id] === opt.value ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--line)] bg-white"
                        }`}
                      >
                        {opt.label[lang]}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCurrentSection((s) => Math.max(0, s - 1))}
              className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm"
            >
              {t.prev}
            </button>

            {currentSection < sections.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentSection((s) => Math.min(sections.length - 1, s + 1))}
                className="rounded-full border border-[var(--accent)] bg-[var(--accent)] px-4 py-2 text-sm text-white"
              >
                {t.next}
              </button>
            ) : (
              <button
                type="button"
                onClick={onGenerate}
                className="rounded-full border border-[var(--accent)] bg-[var(--accent)] px-4 py-2 text-sm text-white"
              >
                {t.run}
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setAnswers(initialAnswers);
                setCurrentSection(0);
              }}
              className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm"
            >
              {t.reset}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        {loading ? <div className="paper rounded-2xl p-4 text-sm">{t.analyzing}</div> : null}
        {!loading && currentSection === sections.length - 1 ? (
          <div className="grid gap-3 md:grid-cols-2">
            {results.map((row, idx) => (
              <div key={row.school.id} className="paper rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold">
                      {idx + 1}. {row.school.name}
                    </div>
                    <div className="text-xs muted">
                      {row.school.city} · IELTS {row.school.minIelts}+
                    </div>
                  </div>
                  <div className="rounded-full border border-[var(--line)] bg-white px-3 py-1 text-xs font-semibold">
                    {t.score}: {row.score}
                  </div>
                </div>
                <div className="mt-3 text-sm muted">
                  {t.reason}: {row.reason}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
