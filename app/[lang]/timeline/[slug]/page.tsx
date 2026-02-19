import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { compileMDX } from "next-mdx-remote/rsc";
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

  const renderedItems = await Promise.all(
    step.items[lang].map(async (item) => {
      const source = item.content.trim();
      if (!source) {
        return { title: item.title, content: null as React.ReactNode | null };
      }

      const { content } = await compileMDX({
        source,
        options: { parseFrontmatter: false },
      });
      return { title: item.title, content };
    }),
  );

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
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <section className="paper relative overflow-hidden rounded-3xl px-6 py-8 md:px-10 lg:px-12">
          <div className="pointer-events-none absolute -right-24 -top-20 h-56 w-56 rounded-full bg-[var(--accent-soft)] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-white/60 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="lg:sticky lg:top-8 lg:self-start">
              <div className="flex items-center justify-between gap-4 lg:block">
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
            </aside>

            <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-6 md:p-7">
              <h2 className="text-lg font-semibold">{t.title}</h2>
              <div className="mt-4 space-y-3">
                {renderedItems.map((it) => (
                  <details key={it.title} className="fold-item rounded-xl border border-[var(--line)] bg-white/85 px-4 py-3">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-lg font-medium">
                      {it.title}
                      <span aria-hidden="true" className="fold-arrow text-xl leading-none">
                        ▾
                      </span>
                    </summary>
                    {it.content ? (
                      <div className="fold-markdown mt-2">{it.content}</div>
                    ) : (
                      <p className="mt-2 text-sm muted">
                        {lang === "en" ? "No details yet. Add content in CMS under Timeline." : "暂无详细内容，可在 CMS 的 Timeline 中补充。"}
                      </p>
                    )}
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
