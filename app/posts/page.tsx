import Link from "next/link";
import { getPostSlugs } from "@/lib/content-posts";
import { resolveLang, otherLang, withLang, type SearchParams } from "@/lib/i18n";

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const posts = await getPostSlugs();
  const lang = resolveLang(await searchParams);
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
            {posts.map((slug) => (
              <Link
                key={slug}
                href={withLang(`/posts/${slug}`, lang)}
                className="rounded-2xl border border-[var(--line)] bg-white/75 p-5 transition hover:-translate-y-0.5 hover:bg-[var(--accent-soft)]"
              >
                <div className="text-lg font-semibold">{slug.replace(/-/g, " ")}</div>
                <div className="mt-2 text-sm muted">{t.read} →</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
