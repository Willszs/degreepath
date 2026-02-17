import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostSummaries } from "@/lib/content-posts";
import { resolveLangParam, otherLang, withLang } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = resolveLangParam(rawLang);
  if (!lang) return {};

  const title = lang === "en" ? "All Posts | DegreePath" : "全部文章 | DegreePath";
  const description =
    lang === "en"
      ? "Read practical study-abroad posts by your current stage."
      : "按你当前阶段阅读实用留学经验文章。";

  return {
    title,
    description,
    alternates: {
      canonical: withLang("/posts", lang),
      languages: {
        "zh-CN": withLang("/posts", "zh"),
        "en-US": withLang("/posts", "en"),
      },
    },
  };
}

export default async function PostsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const posts = await getPostSummaries();
  const { lang: rawLang } = await params;
  const lang = resolveLangParam(rawLang);
  if (!lang) return notFound();
  const nextLang = otherLang(lang);

  const t =
    lang === "en"
      ? {
          back: "Back to home",
          title: "All Posts",
          subtitle: "Read by the topic that best matches your current stage.",
          switchLabel: "中文",
          read: "Read",
        }
      : {
          back: "返回首页",
          title: "全部文章",
          subtitle: "慢慢读，按你当下最需要解决的问题开始。",
          switchLabel: "EN",
          read: "点击阅读",
        };

  return (
    <main className="min-h-screen text-[var(--foreground)]">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="paper rounded-3xl px-6 py-8">
          <div className="flex items-center justify-between gap-4">
            <Link href={withLang("/", lang)} className="text-sm muted hover:text-[var(--accent)]">
              ← {t.back}
            </Link>
            <Link
              href={withLang("/posts", nextLang)}
              className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-3 py-1 text-xs font-semibold"
            >
              {t.switchLabel}
            </Link>
          </div>

          <h1 className="mt-5 text-4xl font-semibold">{t.title}</h1>
          <p className="mt-2 muted">{t.subtitle}</p>

          <p className="mt-6 text-sm muted">Found: {posts.length} posts</p>

          <div className="mt-6 grid gap-4">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={withLang(`/posts/${post.slug}`, lang)}
                className="rounded-2xl border border-[var(--line)] bg-white/75 p-5 transition hover:-translate-y-0.5 hover:bg-[var(--accent-soft)]"
              >
                <div className="text-xs muted">{post.date}</div>
                <div className="mt-1 text-lg font-semibold">{post.title}</div>
                {post.excerpt ? <div className="mt-2 text-sm muted">{post.excerpt}</div> : null}
                <div className="mt-2 text-sm muted">{t.read} →</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
