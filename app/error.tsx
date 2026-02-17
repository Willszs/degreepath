"use client";

import Link from "next/link";

export default function GlobalErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen text-[var(--foreground)]">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <section className="paper rounded-3xl px-8 py-10 text-center">
          <p className="text-sm muted">Unexpected error</p>
          <h1 className="mt-3 text-3xl font-semibold">Something went wrong / 页面出错了</h1>
          <p className="mt-4 text-sm muted">
            You can retry now or go back to the homepage. 你可以重试，或返回首页。
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 py-2 text-sm font-medium"
            >
              Retry
            </button>
            <Link
              href="/zh"
              className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 py-2 text-sm font-medium"
            >
              中文首页
            </Link>
            <Link
              href="/en"
              className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 py-2 text-sm font-medium"
            >
              English Home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
