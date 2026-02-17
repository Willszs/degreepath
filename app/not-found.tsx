import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen text-[var(--foreground)]">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <section className="paper rounded-3xl px-8 py-10 text-center">
          <p className="text-sm muted">404</p>
          <h1 className="mt-3 text-3xl font-semibold">Page not found / 页面不存在</h1>
          <p className="mt-4 text-sm muted">
            The page might have moved or the link is outdated. 这个页面可能已移动，或链接已失效。
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/zh"
              className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 py-2 text-sm font-medium"
            >
              返回中文首页
            </Link>
            <Link
              href="/en"
              className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 py-2 text-sm font-medium"
            >
              Go to English Home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
