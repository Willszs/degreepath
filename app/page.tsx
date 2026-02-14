import Link from "next/link";
import { getPostSlugs } from "@/lib/content-posts";
import { resolveLang, otherLang, withLang, type SearchParams } from "@/lib/i18n";
import { resourceItems } from "@/lib/resources";
import { timelineSteps } from "@/lib/timeline-steps";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const posts = await getPostSlugs();
  const latestPosts = posts.slice(0, 3);
  const lang = resolveLang(await searchParams);
  const nextLang = otherLang(lang);

  const t =
    lang === "en"
      ? {
          navTimeline: "Timeline",
          navResources: "Resources",
          navPosts: "Posts",
          navAbout: "About",
          switchLabel: "中文",
          heroTag: "EN / CN · Germany-focused",
          heroSubtitle: "Turn study abroad prep into a steady rhythm",
          heroText:
            "This is not an information dump. It turns a complex process into small daily actions through timelines, templates, and real stories.",
          cta1: "Start with timeline",
          cta2: "Read latest posts",
          s1Title: "Preparation Flow",
          s1Text: "Break the process into phases to avoid overwhelm and keep momentum.",
          s1Link: "Open timeline",
          s2Title: "Template Toolkit",
          s2Text: "Practical templates you can copy, edit, and use right away.",
          s2Link: "Browse resources",
          s3Title: "Real Stories",
          s3Text: "Lessons learned from exams, waiting periods, and life setup.",
          s3Link: "Read stories",
          timelineTitle: "Timeline",
          timelineText: "Pick your current stage and jump into concrete tasks.",
          resourcesTitle: "Resources",
          resourcesText: "Each template includes context and usage tips.",
          postsTitle: "Latest Posts",
          postsAll: "View all",
          postsText: `Recently updated ${posts.length} posts.`,
          postRead: "Read",
          aboutTitle: "About DegreePath",
          aboutText:
            "Think of this as an evolving study-abroad handbook. The goal is to turn information into action.",
          footer: "Cozy study-abroad notes",
        }
      : {
          navTimeline: "流程",
          navResources: "资源",
          navPosts: "文章",
          navAbout: "关于",
          switchLabel: "EN",
          heroTag: "CN / EN · Germany-focused",
          heroSubtitle: "把留学准备过成有节奏的日常",
          heroText:
            "这里不是“信息堆叠”，而是把复杂流程拆成每天能完成的一小步。你可以从流程、模板和真实经历三个入口开始，慢慢把不确定感变成可执行的清单。",
          cta1: "从流程开始",
          cta2: "看最新文章",
          s1Title: "准备流程",
          s1Text: "把申请拆成阶段任务，避免“一次做太多”导致焦虑和中断。",
          s1Link: "打开时间线",
          s2Title: "模板资源",
          s2Text: "给你能直接改、直接用的版本，而不是只能参考的空框架。",
          s2Link: "查看资源",
          s3Title: "真实经历",
          s3Text: "把踩坑、等待和复盘写清楚，帮你少走弯路也少一点内耗。",
          s3Link: "读文章",
          timelineTitle: "准备流程",
          timelineText: "先选一个你现在所处的阶段，直接进入本周可执行任务。",
          resourcesTitle: "模板资源",
          resourcesText: "每个模板都配了用途说明和使用要点，减少“知道但不会用”。",
          postsTitle: "最新文章",
          postsAll: "查看全部",
          postsText: `最近更新 ${posts.length} 篇，先从最靠近你当下阶段的主题读起。`,
          postRead: "点击阅读",
          aboutTitle: "关于 DegreePath",
          aboutText:
            "你可以把这里当成一个会持续更新的留学知识手账。内容会覆盖考试、申请、签证和德国生活细节，目标是让信息不只是“看过”，而是能直接变成行动。",
          footer: "Cozy study-abroad notes",
        };

  return (
    <main className="min-h-screen text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <header className="paper rounded-3xl px-6 py-5 md:px-8">
          <div className="flex items-center justify-between">
            <div className="text-xl font-semibold tracking-tight">
              Degree<span className="accent">Path</span>
            </div>
            <div className="flex items-center gap-5">
              <nav className="hidden gap-6 text-sm muted md:flex">
                <a className="hover:text-[var(--accent)]" href="#timeline">
                  {t.navTimeline}
                </a>
                <a className="hover:text-[var(--accent)]" href="#resources">
                  {t.navResources}
                </a>
                <a className="hover:text-[var(--accent)]" href="#posts">
                  {t.navPosts}
                </a>
                <a className="hover:text-[var(--accent)]" href="#about">
                  {t.navAbout}
                </a>
              </nav>
              <Link
                href={withLang("/", nextLang)}
                className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-3 py-1 text-xs font-semibold"
              >
                {t.switchLabel}
              </Link>
            </div>
          </div>
        </header>

        <section className="mt-8 rounded-3xl border border-[var(--line)] bg-[linear-gradient(135deg,#fff7ef_0%,#f8ebdc_100%)] px-6 py-10 md:px-10 md:py-12">
          <p className="text-sm font-medium text-[var(--muted)]">{t.heroTag}</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            DegreePath
            <span className="block text-3xl text-[var(--accent)] md:text-5xl">{t.heroSubtitle}</span>
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-[var(--muted)]">{t.heroText}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#timeline"
              className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:brightness-95"
            >
              {t.cta1}
            </a>
            <a
              href="#posts"
              className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--accent-soft)]"
            >
              {t.cta2}
            </a>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="paper rounded-2xl p-6">
            <div className="text-sm muted">Timeline</div>
            <h2 className="mt-2 text-xl font-semibold">{t.s1Title}</h2>
            <p className="mt-2 text-sm muted">{t.s1Text}</p>
            <a href="#timeline" className="mt-4 inline-block text-sm font-medium accent hover:underline">
              {t.s1Link} →
            </a>
          </div>

          <div className="paper rounded-2xl p-6">
            <div className="text-sm muted">Toolkit</div>
            <h2 className="mt-2 text-xl font-semibold">{t.s2Title}</h2>
            <p className="mt-2 text-sm muted">{t.s2Text}</p>
            <a href="#resources" className="mt-4 inline-block text-sm font-medium accent hover:underline">
              {t.s2Link} →
            </a>
          </div>

          <div className="paper rounded-2xl p-6">
            <div className="text-sm muted">Stories</div>
            <h2 className="mt-2 text-xl font-semibold">{t.s3Title}</h2>
            <p className="mt-2 text-sm muted">{t.s3Text}</p>
            <a href="#posts" className="mt-4 inline-block text-sm font-medium accent hover:underline">
              {t.s3Link} →
            </a>
          </div>
        </section>

        <section id="timeline" className="mt-16">
          <h3 className="text-2xl font-semibold">{t.timelineTitle}</h3>
          <p className="mt-2 text-sm muted">{t.timelineText}</p>

          <ol className="mt-6 grid gap-3 md:grid-cols-2">
            {timelineSteps.map((step, index) => (
              <li key={step.slug}>
                <Link
                  href={withLang(`/timeline/${step.slug}`, lang)}
                  className="paper block rounded-2xl p-4 text-sm transition hover:-translate-y-0.5 hover:bg-[var(--accent-soft)]"
                >
                  {`Step ${index + 1}: ${step.title[lang]} (${step.subtitle[lang]})`}
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section id="resources" className="mt-16">
          <h3 className="text-2xl font-semibold">{t.resourcesTitle}</h3>
          <p className="mt-2 text-sm muted">{t.resourcesText}</p>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {resourceItems.map((item) => (
              <Link
                key={item.slug}
                href={withLang(`/resources/${item.slug}`, lang)}
                className="paper rounded-2xl p-4 text-sm transition hover:-translate-y-0.5 hover:bg-[var(--accent-soft)]"
              >
                <div className="font-medium">{item.title[lang]}</div>
                <div className="mt-1 text-xs muted">{item.subtitle[lang]}</div>
              </Link>
            ))}
          </div>
        </section>

        <section id="posts" className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <h3 className="text-2xl font-semibold">{t.postsTitle}</h3>
            <Link href={withLang("/posts", lang)} className="text-sm muted hover:text-[var(--accent)]">
              {t.postsAll} →
            </Link>
          </div>

          <p className="mt-3 text-sm muted">{t.postsText}</p>

          <div className="mt-6 grid gap-4">
            {latestPosts.map((slug) => (
              <Link
                key={slug}
                href={withLang(`/posts/${slug}`, lang)}
                className="paper block rounded-2xl p-5 transition hover:-translate-y-0.5 hover:bg-[var(--accent-soft)]"
              >
                <div className="text-xs muted">Post</div>
                <div className="mt-1 text-lg font-semibold">{slug.replace(/-/g, " ")}</div>
                <div className="mt-2 text-sm muted">{t.postRead} →</div>
              </Link>
            ))}
          </div>
        </section>

        <section id="about" className="mt-16">
          <h3 className="text-2xl font-semibold">{t.aboutTitle}</h3>
          <p className="mt-4 max-w-3xl text-sm muted">{t.aboutText}</p>
        </section>

        <footer className="mt-16 border-t border-[var(--line)] py-8 text-sm muted">
          © {new Date().getFullYear()} DegreePath · {t.footer}
        </footer>
      </div>
    </main>
  );
}
