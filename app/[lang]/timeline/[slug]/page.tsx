import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { resolveLangParam, otherLang, withLang } from "@/lib/i18n";
import { timelineSteps } from "@/lib/timeline-steps";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  const lang = resolveLangParam(rawLang);
  if (!lang) return {};
  const step = timelineSteps.find((item) => item.slug === slug);
  if (!step) return {};

  return {
    title: `${step.title[lang]} | DegreePath`,
    description: step.subtitle[lang],
    alternates: {
      canonical: withLang(`/timeline/${slug}`, lang),
      languages: {
        "zh-CN": withLang(`/timeline/${slug}`, "zh"),
        "en-US": withLang(`/timeline/${slug}`, "en"),
      },
    },
  };
}

export default async function TimelineDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { slug, lang: rawLang } = await params;
  const lang = resolveLangParam(rawLang);
  if (!lang) return notFound();
  const nextLang = otherLang(lang);
  const step = timelineSteps.find((item) => item.slug === slug);

  if (!step) return notFound();

  const t =
    lang === "en"
      ? {
          back: "Back to home",
          switchLabel: "中文",
          title: "Start With These Tasks",
        }
      : {
          back: "返回首页",
          switchLabel: "EN",
          title: "你可以先完成这几件事",
        };

  return (
    <main className="min-h-screen text-[var(--foreground)]">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <section className="paper rounded-3xl px-6 py-8 md:px-10">
          <div className="flex items-center justify-between gap-4">
            <Link href={withLang("/", lang)} className="text-sm muted hover:text-[var(--accent)]">
              ← {t.back}
            </Link>
            <Link
              href={withLang(`/timeline/${slug}`, nextLang)}
              className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-3 py-1 text-xs font-semibold"
            >
              {t.switchLabel}
            </Link>
          </div>

          <h1 className="mt-6 text-4xl font-semibold">{step.title[lang]}</h1>
          <p className="mt-2 muted">{step.subtitle[lang]}</p>

          <div className="mt-8 rounded-2xl border border-[var(--line)] bg-white/70 p-6">
            <h2 className="text-lg font-semibold">{t.title}</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              {step.items[lang].map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
