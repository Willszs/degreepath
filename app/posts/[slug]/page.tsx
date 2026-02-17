import { notFound } from "next/navigation";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import { resolveLang, otherLang, withLang, type SearchParams } from "@/lib/i18n";
import { getPostBySlug } from "@/lib/content-posts";

export default async function PostPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const lang = resolveLang(await searchParams);
  const nextLang = otherLang(lang);
  const post = await getPostBySlug(slug);
  if (!post) return notFound();

  const { content } = await compileMDX({
    source: post.source,
    options: { parseFrontmatter: false },
  });

  const t =
    lang === "en"
      ? {
          back: "Back to post list",
          switchLabel: "中文",
          note: "Article content may still be Chinese if no English version is available yet.",
        }
      : {
          back: "返回文章列表",
          switchLabel: "EN",
          note: "如果这篇文章还没有英文稿，正文会暂时保持中文。",
        };

  return (
    <main className="min-h-screen text-[var(--foreground)]">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <article className="paper cozy-prose rounded-3xl px-6 py-8 md:px-10 md:py-10">
          <div className="not-prose flex items-center justify-between gap-4">
            <Link href={withLang("/posts", lang)} className="text-sm muted hover:text-[var(--accent)]">
              ← {t.back}
            </Link>
            <Link
              href={withLang(`/posts/${slug}`, nextLang)}
              className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-3 py-1 text-xs font-semibold"
            >
              {t.switchLabel}
            </Link>
          </div>
          <h1 className="not-prose mt-6 text-3xl font-semibold md:text-4xl">{post.title}</h1>
          <p className="not-prose mt-3 text-xs muted">
            {post.date} · {post.tag}
          </p>
          <p className="not-prose mt-2 text-xs muted">{t.note}</p>
          <div className="prose prose-stone mt-6 max-w-none">{content}</div>
        </article>
      </div>
    </main>
  );
}
