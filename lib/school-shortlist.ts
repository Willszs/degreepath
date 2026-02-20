import type { Lang } from "@/lib/i18n";

export type BudgetLevel = "low" | "medium" | "high";
export type CitySize = "small" | "medium" | "large";
export type Intake = "winter" | "summer" | "both";

export type ShortlistAnswers = {
  programKeyword: string;
  budget: BudgetLevel;
  englishOnly: boolean;
  languageScore: number;
  citySize: CitySize;
  intake: Intake;
};

export type SchoolItem = {
  id: string;
  name: string;
  city: string;
  citySize: CitySize;
  tuition: BudgetLevel;
  englishFriendly: boolean;
  minIelts: number;
  tags: string[];
  intake: Intake;
};

export type ScoredSchool = {
  school: SchoolItem;
  score: number;
  reason: string;
};

export const schoolPool: SchoolItem[] = [
  { id: "tum", name: "TUM", city: "Munich", citySize: "large", tuition: "medium", englishFriendly: true, minIelts: 6.5, tags: ["engineering", "data", "computer", "robotics"], intake: "both" },
  { id: "rwth", name: "RWTH Aachen", city: "Aachen", citySize: "medium", tuition: "low", englishFriendly: true, minIelts: 6, tags: ["engineering", "mechanical", "electrical", "materials"], intake: "both" },
  { id: "kit", name: "KIT", city: "Karlsruhe", citySize: "medium", tuition: "low", englishFriendly: true, minIelts: 6.5, tags: ["computer", "ai", "engineering", "physics"], intake: "both" },
  { id: "tum-dresden", name: "TU Dresden", city: "Dresden", citySize: "medium", tuition: "low", englishFriendly: true, minIelts: 6, tags: ["engineering", "microelectronics", "materials"], intake: "both" },
  { id: "stuttgart", name: "University of Stuttgart", city: "Stuttgart", citySize: "large", tuition: "medium", englishFriendly: true, minIelts: 6.5, tags: ["automotive", "mechanical", "embedded", "software"], intake: "both" },
  { id: "mannheim", name: "University of Mannheim", city: "Mannheim", citySize: "medium", tuition: "low", englishFriendly: true, minIelts: 6.5, tags: ["business", "economics", "data"], intake: "both" },
  { id: "hamburg", name: "University of Hamburg", city: "Hamburg", citySize: "large", tuition: "low", englishFriendly: true, minIelts: 6.5, tags: ["law", "social", "computer", "data"], intake: "both" },
  { id: "cologne", name: "University of Cologne", city: "Cologne", citySize: "large", tuition: "low", englishFriendly: true, minIelts: 6, tags: ["business", "economics", "management"], intake: "both" },
  { id: "freiburg", name: "University of Freiburg", city: "Freiburg", citySize: "small", tuition: "low", englishFriendly: true, minIelts: 6.5, tags: ["environment", "computer", "data", "sustainability"], intake: "both" },
  { id: "bremen", name: "University of Bremen", city: "Bremen", citySize: "medium", tuition: "low", englishFriendly: true, minIelts: 6, tags: ["logistics", "marine", "engineering", "computer"], intake: "both" },
];

const budgetWeight: Record<BudgetLevel, number> = { low: 3, medium: 2, high: 1 };

export function shortlistSchools(answers: ShortlistAnswers, lang: Lang): ScoredSchool[] {
  const keyword = answers.programKeyword.toLowerCase();

  return schoolPool
    .map((school) => {
      let score = 0;
      if (school.tuition === answers.budget) score += 22;
      else if (budgetWeight[school.tuition] >= budgetWeight[answers.budget]) score += 10;

      if (answers.englishOnly && school.englishFriendly) score += 14;
      if (answers.languageScore >= school.minIelts) score += 16;
      if (school.citySize === answers.citySize) score += 10;
      if (answers.intake === "both" || school.intake === "both" || school.intake === answers.intake) score += 10;

      const tagMatch = school.tags.some((tag) => keyword.includes(tag) || tag.includes(keyword));
      if (tagMatch) score += 28;

      const reason =
        lang === "en"
          ? `${school.city} · ${school.tags.slice(0, 2).join(", ")} · IELTS ${school.minIelts}+`
          : `${school.city} · ${school.tags.slice(0, 2).join("、")} · 雅思建议 ${school.minIelts}+`;

      return { school, score, reason };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}
