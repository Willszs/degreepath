import Link from "next/link";
import { getPostSlugs } from "@/lib/content-posts";
import { resourceItems } from "@/lib/resources";
import { timelineSteps } from "@/lib/timeline-steps";

export default async function Home() {
  const posts = await getPostSlugs();
  const latestPosts: string[] = posts.slice(0, 3);

  return (
    <main className="min-h-screen text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <header className="paper rounded-3xl px-6 py-5 md:px-8">
          <div className="flex items-center justify-between">
            <div className="text-xl font-semibold tracking-tight">
              Degree<span className="accent">Path</span>
            </div>
            <nav className="hidden gap-6 text-sm muted md:flex">
              <a className="hover:text-[var(--accent)]" href="#timeline">
                流程
              </a>
              <a className="hover:text-[var(--accent)]" href="#resources">
                资源
              </a>
              <a className="hover:text-[var(--accent)]" href="#posts">
                文章
              </a>
              <a className="hover:text-[var(--accent)]" href="#about">
                关于
              </a>
            </nav>
          </div>
        </header>

        <section className="mt-8 rounded-3xl border border-[var(--line)] bg-[linear-gradient(135deg,#fff7ef_0%,#f8ebdc_100%)] px-6 py-10 md:px-10 md:py-12">
          <p className="text-sm font-medium text-[var(--muted)]">CN / EN · Germany-focused</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            DegreePath
            <span className="block text-3xl text-[var(--accent)] md:text-5xl">把留学准备过成有节奏的日常</span>
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-[var(--muted)]">
            这里不是“信息堆叠”，而是把复杂流程拆成每天能完成的一小步。你可以从流程、模板和真实经历三个入口开始，慢慢把不确定感变成可执行的清单。
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#timeline"
              className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:brightness-95"
            >
              从流程开始
            </a>
            <a
              href="#posts"
              className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--accent-soft)]"
            >
              看最新文章
            </a>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="paper rounded-2xl p-6">
            <div className="text-sm muted">Timeline</div>
            <h2 className="mt-2 text-xl font-semibold">准备流程</h2>
            <p className="mt-2 text-sm muted">把申请拆成阶段任务，避免“一次做太多”导致焦虑和中断。</p>
            <a href="#timeline" className="mt-4 inline-block text-sm font-medium accent hover:underline">
              打开时间线 →
            </a>
          </div>

          <div className="paper rounded-2xl p-6">
            <div className="text-sm muted">Toolkit</div>
            <h2 className="mt-2 text-xl font-semibold">模板资源</h2>
            <p className="mt-2 text-sm muted">给你能直接改、直接用的版本，而不是只能参考的空框架。</p>
            <a href="#resources" className="mt-4 inline-block text-sm font-medium accent hover:underline">
              查看资源 →
            </a>
          </div>

          <div className="paper rounded-2xl p-6">
            <div className="text-sm muted">Stories</div>
            <h2 className="mt-2 text-xl font-semibold">真实经历</h2>
            <p className="mt-2 text-sm muted">把踩坑、等待和复盘写清楚，帮你少走弯路也少一点内耗。</p>
            <a href="#posts" className="mt-4 inline-block text-sm font-medium accent hover:underline">
              读文章 →
            </a>
          </div>
        </section>

        <section id="timeline" className="mt-16">
          <h3 className="text-2xl font-semibold">准备流程</h3>
          <p className="mt-2 text-sm muted">先选一个你现在所处的阶段，直接进入本周可执行任务。</p>

          <ol className="mt-6 grid gap-3 md:grid-cols-2">
            {timelineSteps.map((step, index) => (
              <li key={step.slug}>
                <Link
                  href={`/timeline/${step.slug}`}
                  className="paper block rounded-2xl p-4 text-sm transition hover:-translate-y-0.5 hover:bg-[var(--accent-soft)]"
                >
                  {`Step ${index + 1}：${step.title}（${step.subtitle}）`}
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section id="resources" className="mt-16">
          <h3 className="text-2xl font-semibold">模板资源</h3>
          <p className="mt-2 text-sm muted">每个模板都配了用途说明和使用要点，减少“知道但不会用”。</p>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {resourceItems.map((item) => (
              <Link
                key={item.slug}
                href={`/resources/${item.slug}`}
                className="paper rounded-2xl p-4 text-sm transition hover:-translate-y-0.5 hover:bg-[var(--accent-soft)]"
              >
                <div className="font-medium">{item.title}</div>
                <div className="mt-1 text-xs muted">{item.subtitle}</div>
              </Link>
            ))}
          </div>
        </section>

        <section id="posts" className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <h3 className="text-2xl font-semibold">最新文章</h3>
            <Link href="/posts" className="text-sm muted hover:text-[var(--accent)]">
              查看全部 →
            </Link>
          </div>

          <p className="mt-3 text-sm muted">最近更新 {posts.length} 篇，先从最靠近你当下阶段的主题读起。</p>

          <div className="mt-6 grid gap-4">
            {latestPosts.map((slug: string) => (
              <Link
                key={slug}
                href={`/posts/${slug}`}
                className="paper block rounded-2xl p-5 transition hover:-translate-y-0.5 hover:bg-[var(--accent-soft)]"
              >
                <div className="text-xs muted">Post</div>
                <div className="mt-1 text-lg font-semibold">{slug.replace(/-/g, " ")}</div>
                <div className="mt-2 text-sm muted">点击阅读 →</div>
              </Link>
            ))}
          </div>
        </section>

        <section id="about" className="mt-16">
          <h3 className="text-2xl font-semibold">关于 DegreePath</h3>
          <p className="mt-4 max-w-3xl text-sm muted">
            你可以把这里当成一个会持续更新的留学知识手账。内容会覆盖考试、申请、签证和德国生活细节，目标是让信息不只是“看过”，而是能直接变成行动。
          </p>
        </section>

        <footer className="mt-16 border-t border-[var(--line)] py-8 text-sm muted">
          © {new Date().getFullYear()} DegreePath · Cozy study-abroad notes
        </footer>
      </div>
    </main>
  );
}
