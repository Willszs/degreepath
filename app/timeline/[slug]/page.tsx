import { notFound } from "next/navigation";
import Link from "next/link";
import { resolveLang, otherLang, withLang, type SearchParams } from "@/lib/i18n";
import { timelineSteps } from "@/lib/timeline-steps";

export default async function TimelineDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const lang = resolveLang(await searchParams);
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
