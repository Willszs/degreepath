import Link from "next/link";
import { getPostSlugs } from "@/lib/content-posts";

export default async function Home() {
  const posts = await getPostSlugs();

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
