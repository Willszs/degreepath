import { notFound } from "next/navigation";
import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "content", "posts", `${slug}.mdx`);

  let source: string;
  try {
    source = await fs.readFile(filePath, "utf8");
  } catch {
    return notFound();
  }

  const { content } = await compileMDX({
    source,
    options: { parseFrontmatter: false },
  });

  return (
    <main className="min-h-screen text-[var(--foreground)]">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <article className="paper cozy-prose rounded-3xl px-6 py-8 md:px-10 md:py-10">
          <Link href="/posts" className="text-sm muted hover:text-[var(--accent)] not-prose">
            ← 返回文章列表
          </Link>
          <div className="prose prose-stone mt-6 max-w-none">{content}</div>
        </article>
      </div>
    </main>
  );
}
