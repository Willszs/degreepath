import Link from "next/link";
import { getPostSlugs } from "@/lib/content-posts";

export default async function PostsPage() {
  const posts = await getPostSlugs();

  return (
    <main className="min-h-screen text-[var(--foreground)]">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="paper rounded-3xl px-6 py-8">
          <Link href="/" className="text-sm muted hover:text-[var(--accent)]">
            ← 返回首页
          </Link>

          <h1 className="mt-5 text-4xl font-semibold">全部文章</h1>
          <p className="mt-2 muted">慢慢读，按你当下最需要解决的问题开始。</p>

          <p className="mt-6 text-sm muted">Found: {posts.length} posts</p>

          <div className="mt-6 grid gap-4">
            {posts.map((slug) => (
              <Link
                key={slug}
                href={`/posts/${slug}`}
                className="rounded-2xl border border-[var(--line)] bg-white/75 p-5 transition hover:-translate-y-0.5 hover:bg-[var(--accent-soft)]"
              >
                <div className="text-lg font-semibold">{slug.replace(/-/g, " ")}</div>
                <div className="mt-2 text-sm muted">点击阅读 →</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
