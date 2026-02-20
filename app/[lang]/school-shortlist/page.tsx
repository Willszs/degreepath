import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import SchoolShortlistTool from "@/app/components/school-shortlist-tool";
import { otherLang, resolveLangParam, withLang } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = resolveLangParam(rawLang);
  if (!lang) return {};

  return {
    title: lang === "en" ? "School Shortlist Tool | DegreePath" : "学校初选工具 | DegreePath",
    description:
      lang === "en"
        ? "Answer a short questionnaire and get 8 suggested schools."
        : "通过简短问卷生成 8 所建议学校。",
    alternates: {
      canonical: withLang("/school-shortlist", lang),
      languages: {
        "zh-CN": withLang("/school-shortlist", "zh"),
        "en-US": withLang("/school-shortlist", "en"),
      },
    },
  };
}

export default async function SchoolShortlistPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = resolveLangParam(rawLang);
  if (!lang) return notFound();
  const nextLang = otherLang(lang);

  const t =
    lang === "en"
      ? { back: "Back to home", switchLabel: "中文", title: "School Shortlist" }
      : { back: "返回首页", switchLabel: "EN", title: "学校初选" };

  return (
    <main className="min-h-screen text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link href={withLang("/", lang)} className="text-sm muted hover:text-[var(--accent)]">
            ← {t.back}
          </Link>
          <Link
            href={withLang("/school-shortlist", nextLang)}
            className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-3 py-1 text-xs font-semibold"
          >
            {t.switchLabel}
          </Link>
        </div>
        <h1 className="mb-6 text-4xl font-semibold">{t.title}</h1>
        <SchoolShortlistTool lang={lang} />
      </div>
    </main>
  );
}
