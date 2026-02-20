import daadPrograms from "@/content/daad-programs.json";
import type { Lang } from "@/lib/i18n";

export type BudgetLevel = "low" | "medium" | "high";
export type CitySize = "small" | "medium" | "large";
export type Intake = "winter" | "summer" | "both";

export type ShortlistAnswers = Record<string, string>;

export type DaadProgram = {
  id: string;
  programName: string;
  university: string;
  city: string;
  citySize: CitySize;
  tuitionLevel: BudgetLevel;
  englishFriendly: boolean;
  minIelts: number;
  intake: Intake;
  degree: "MSc" | "MA" | "MBA";
  tags: string[];
};

export type ScoredProgram = {
  program: DaadProgram;
  score: number;
  reason: string;
};

export const programPool = (daadPrograms as { programs: DaadProgram[] }).programs;

function mapBudget(value: string): BudgetLevel {
  if (value === "under_700" || value === "700_1000") return "low";
  if (value === "1000_1300") return "medium";
  return "high";
}

function mapCitySize(value: string): CitySize {
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

function mapIntake(value: string): Intake {
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

export function buildKeywordFromAnswers(answers: ShortlistAnswers): string {
  return [
    categoryKeyword(answers.programCategory ?? ""),
    directionKeyword(answers.trainingDirection ?? ""),
    answers.undergraduateMajor ?? "",
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function shortlistProgramsByRules(answers: ShortlistAnswers, lang: Lang, limit = 12): ScoredProgram[] {
  const keyword = buildKeywordFromAnswers(answers);
  const budget = mapBudget(answers.monthlyBudget ?? "no_limit");
  const englishOnly = mapEnglishOnly(answers.teachingLanguage ?? "no_pref");
  const languageScore = mapIelts(answers.englishScore ?? "none");
  const citySize = mapCitySize(answers.citySize ?? "large");
  const intake = mapIntake(answers.mustThisYear ?? "not_sure");

  const budgetWeight: Record<BudgetLevel, number> = { low: 3, medium: 2, high: 1 };

  return programPool
    .map((program) => {
      let score = 0;
      if (program.tuitionLevel === budget) score += 22;
      else if (budgetWeight[program.tuitionLevel] >= budgetWeight[budget]) score += 10;

      if (!englishOnly || program.englishFriendly) score += 14;
      if (languageScore >= program.minIelts) score += 18;
      if (program.citySize === citySize) score += 10;
      if (intake === "both" || program.intake === "both" || program.intake === intake) score += 10;

      const tagMatch = program.tags.some((tag) => keyword.includes(tag) || tag.includes(keyword));
      if (tagMatch) score += 26;

      const reason =
        lang === "en"
          ? `${program.university} · ${program.city} · ${program.tags.slice(0, 2).join(", ")}`
          : `${program.university} · ${program.city} · ${program.tags.slice(0, 2).join("、")}`;

      return { program, score, reason };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
