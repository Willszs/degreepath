import { notFound } from "next/navigation";
import fs from "fs/promises";
import path from "path";
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
    <main className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto max-w-3xl px-6 py-16 prose prose-neutral">
        {content}
      </div>
    </main>
  );
}

