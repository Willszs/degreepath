import fs from "fs/promises";
import path from "path";
import Link from "next/link";

export default async function Home() {
  // Read all mdx slugs from content/posts
  const dir = path.join(process.cwd(), "content", "posts");
  const files = await fs.readdir(dir);

  const posts: string[] = files
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""))
    .sort();

  // Show only the latest 3 posts on homepage
  const latestPosts: string[] = posts.slice(0, 3);

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto max-w-5xl px-6 py-14">
        {/* Top bar */}
        <header className="flex items-center justify-between">
          <div className="text-xl font-semibold tracking-tight">
            Degree<span className="text-neutral-500">Path</span>
          </div>
          <nav className="hidden gap-6 text-sm text-neutral-600 md:flex">
            <a className="hover:text-neutral-900" href="#timeline">
              流程
            </a>
            <a className="hover:text-neutral-900" href="#resources">
              资源
            </a>
            <a className="hover:text-neutral-900" href="#posts">
              文章
            </a>
            <a className="hover:text-neutral-900" href="#about">
              关于
            </a>
          </nav>
        </header>

        {/* Hero */}
        <section className="mt-14">
          <p className="text-sm font-medium text-neutral-600">
            CN / EN · Germany-focused
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            DegreePath
            <span className="block text-neutral-500">
              留学清单、时间线与踩坑笔记
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-700">
            这是一个面向中文用户的留学信息站：把复杂的准备过程拆成可执行的步骤，
            用清单、模板和真实经历，帮你少走弯路。
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#timeline"
              className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
            >
              先看准备流程
            </a>
            <a
              href="#posts"
              className="rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
            >
              看最新文章
            </a>
          </div>
        </section>

        {/* Cards */}
        <section className="mt-14 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 p-6">
            <div className="text-sm font-medium text-neutral-600">Timeline</div>
            <h2 className="mt-2 text-xl font-semibold">准备流程</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">
              选校、语言、材料、申请、签证、行前。用时间线把每一步落到可做的任务。
            </p>
            <a
              href="#timeline"
              className="mt-4 inline-block text-sm font-medium text-neutral-900 hover:underline"
            >
              打开时间线 →
            </a>
          </div>

          <div className="rounded-2xl border border-neutral-200 p-6">
            <div className="text-sm font-medium text-neutral-600">Toolkit</div>
            <h2 className="mt-2 text-xl font-semibold">模板资源</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">
              动机信、CV、邮件模板、材料清单。先给你“能直接套用”的版本。
            </p>
            <a
              href="#resources"
              className="mt-4 inline-block text-sm font-medium text-neutral-900 hover:underline"
            >
              查看资源 →
            </a>
          </div>

          <div className="rounded-2xl border border-neutral-200 p-6">
            <div className="text-sm font-medium text-neutral-600">Stories</div>
            <h2 className="mt-2 text-xl font-semibold">真实经历</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">
              IELTS、APS、申请和德国生活碎片。更像朋友的“避坑笔记”。
            </p>
            <a
              href="#posts"
              className="mt-4 inline-block text-sm font-medium text-neutral-900 hover:underline"
            >
              读文章 →
            </a>
          </div>
        </section>

        {/* Sections */}
        <section id="timeline" className="mt-16">
          <h3 className="text-2xl font-semibold">准备流程</h3>

          {/** 先定义步骤数组 */}
          {(() => {
            const timelineSteps = [
              { slug: "step-1", text: "Step 1：定位与选校（目标/预算/专业）" },
              { slug: "step-2", text: "Step 2：语言与考试（IELTS / TestDaF 等）" },
              { slug: "step-3", text: "Step 3：材料准备（CV/动机信/推荐信）" },
              { slug: "step-4", text: "Step 4：申请提交与跟进（邮件/系统）" },
              { slug: "step-5", text: "Step 5：签证与资金证明（清单化）" },
              { slug: "step-6", text: "Step 6：行前与落地（住宿/保险/开户）" },
            ];

            return (
              <ol className="mt-6 grid gap-3 md:grid-cols-2">
                {timelineSteps.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/timeline/${s.slug}`}
                      className="block rounded-2xl border border-neutral-200 p-4 text-sm text-neutral-800 hover:bg-neutral-50"
                    >
                      {s.text}
                    </Link>
                  </li>
                ))}
              </ol>
            );
          })()}
        </section>

        <section id="resources" className="mt-16">
          <h3 className="text-2xl font-semibold">模板资源</h3>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {["CV 模板", "动机信模板", "申请邮件模板", "签证材料清单", "行前清单", "德生活工具箱"].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-neutral-200 p-4 text-sm text-neutral-800"
                >
                  {item}
                </div>
              )
            )}
          </div>
        </section>

        {/* POSTS: latest 3 on homepage */}
        <section id="posts" className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <h3 className="text-2xl font-semibold">最新文章</h3>
            <Link
              href="/posts"
              className="text-sm text-neutral-600 hover:text-neutral-900"
            >
              查看全部 →
            </Link>
          </div>

          <p className="mt-3 text-sm text-neutral-500">
            Found: {posts.length} posts
          </p>

          <div className="mt-6 grid gap-4">
            {latestPosts.map((slug: string) => (
              <Link
                key={slug}
                href={`/posts/${slug}`}
                className="block rounded-2xl border border-neutral-200 p-5 hover:bg-neutral-50"
              >
                <div className="text-xs text-neutral-500">Post</div>
                <div className="mt-1 text-lg font-semibold">
                  {slug.replace(/-/g, " ")}
                </div>
                <div className="mt-2 text-sm text-neutral-700">
                  点击阅读 →
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="about" className="mt-16">
          <h3 className="text-2xl font-semibold">关于 DegreePath</h3>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-700">
            你可以把这里当成一个不断更新的留学备忘录。内容会覆盖：考试、申请、签证、以及德国生活的真实细节。
            后续我们会加入双语切换、文章系统、搜索和下载中心。
          </p>
        </section>

        <footer className="mt-16 border-t border-neutral-200 py-8 text-sm text-neutral-500">
          © {new Date().getFullYear()} DegreePath · Built with Next.js
        </footer>
      </div>
    </main>
  );
}