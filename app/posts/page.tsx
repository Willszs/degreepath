import fs from "fs/promises";
import path from "path";
import Link from "next/link";

export default async function Home() {
  // 读取 content/posts 文件夹
  const dir = path.join(process.cwd(), "content", "posts");
  const files = await fs.readdir(dir);

  // 生成 slug 列表
  const posts = files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""))
    .sort();

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto max-w-4xl px-6 py-14">
        
        <h1 className="text-4xl font-semibold">DegreePath</h1>
        <p className="mt-2 text-neutral-600">
          自动读取 content/posts
        </p>

        <p className="mt-6 text-sm text-neutral-500">
          Found: {posts.length} posts
        </p>

        <div className="mt-8 grid gap-4">
          {posts.map((slug) => (
            <Link
              key={slug}
              href={`/posts/${slug}`}
              className="block rounded-2xl border border-neutral-200 p-5 hover:bg-neutral-50"
            >
              <div className="text-lg font-semibold">
                {slug}
              </div>
              <div className="mt-2 text-sm text-neutral-600">
                点击阅读 →
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}