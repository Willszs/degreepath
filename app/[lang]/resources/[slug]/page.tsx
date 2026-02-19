import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { resolveLangParam, otherLang, withLang } from "@/lib/i18n";
import { resourceItems } from "@/lib/resources";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  const lang = resolveLangParam(rawLang);
  if (!lang) return {};
  const resource = resourceItems.find((item) => item.slug === slug);
  if (!resource) return {};

  return {
    title: `${resource.title[lang]} | DegreePath`,
    description: resource.subtitle[lang],
    alternates: {
      canonical: withLang(`/resources/${slug}`, lang),
      languages: {
        "zh-CN": withLang(`/resources/${slug}`, "zh"),
        "en-US": withLang(`/resources/${slug}`, "en"),
      },
    },
  };
}

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { slug, lang: rawLang } = await params;
  const lang = resolveLangParam(rawLang);
  if (!lang) return notFound();
  const nextLang = otherLang(lang);
  const resource = resourceItems.find((item) => item.slug === slug);

  if (!resource) return notFound();

  const t =
    lang === "en"
      ? {
          back: "Back to home",
          switchLabel: "中文",
          title: "How to Use This Template",
        }
      : {
          back: "返回首页",
          switchLabel: "EN",
          title: "建议你这样使用这个模板",
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
                  href={withLang(`/resources/${slug}`, nextLang)}
                  className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-3 py-1 text-xs font-semibold"
                >
                  {t.switchLabel}
                </Link>
              </div>

              <h1 className="mt-6 text-4xl font-semibold">{resource.title[lang]}</h1>
              <p className="mt-2 muted">{resource.subtitle[lang]}</p>
            </aside>

            <details className="fold-card rounded-2xl border border-[var(--line)] bg-white/75 p-6 md:p-7" open>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-lg font-semibold">
                {t.title}
                <span aria-hidden="true" className="fold-arrow text-xl leading-none">
                  ▾
                </span>
              </summary>
              <ul className="mt-4 list-disc space-y-2 pl-5">
                {resource.highlights[lang].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </details>
          </div>
        </section>
      </div>
    </main>
  );
}
