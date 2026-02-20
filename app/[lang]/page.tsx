import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostSummaries } from "@/lib/content-posts";
import { resolveLangParam, otherLang, withLang } from "@/lib/i18n";
import { timelineSteps } from "@/lib/timeline-steps";
import HomeMotion from "@/app/components/home-motion";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = resolveLangParam(rawLang);
  if (!lang) return {};

  const title =
    lang === "en" ? "DegreePath | Study Abroad Timeline and Resources" : "DegreePath | 留学流程与模板资源";
  const description =
    lang === "en"
      ? "Turn study abroad preparation into clear daily actions with timelines, templates, and real stories."
      : "用流程、模板和真实经历，把留学准备拆成可执行的日常动作。";

  return {
    title,
    description,
    alternates: {
      canonical: withLang("/", lang),
      languages: {
        "zh-CN": withLang("/", "zh"),
        "en-US": withLang("/", "en"),
      },
    },
    openGraph: {
      title,
      description,
      url: withLang("/", lang),
      siteName: "DegreePath",
      locale: lang === "en" ? "en_US" : "zh_CN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const posts = await getPostSummaries();
  const latestPosts = posts.slice(0, 3);
  const { lang: rawLang } = await params;
  const lang = resolveLangParam(rawLang);
  if (!lang) return notFound();
  const nextLang = otherLang(lang);

  const t =
    lang === "en"
      ? {
          navTimeline: "Timeline",
          navResources: "School Tool",
          navPosts: "Posts",
          navAbout: "About",
          navContact: "Contact",
          switchLabel: "中文",
          heroTag: "EN / CN · Germany-focused",
          heroLiveLabel: "Live Focus",
          heroLiveWords: ["Timeline", "Templates", "Stories", "Checklist"],
          heroSubtitle: "Turn study abroad prep into a steady rhythm",
          heroText:
            "This is not an information dump. It turns a complex process into small daily actions through timelines, templates, and real stories.",
          heroHint: "Use the section cards below to jump into your current stage.",
          s1Title: "Preparation Flow",
          s1Text: "Break the process into phases to avoid overwhelm and keep momentum.",
          s1Link: "Open timeline",
          s2Title: "School Shortlist",
          s2Text: "Answer key questions and get 8 suggested schools with reasoning.",
          s2Link: "Open tool",
          s3Title: "Real Stories",
          s3Text: "Lessons learned from exams, waiting periods, and life setup.",
          s3Link: "Read stories",
          timelineTitle: "Timeline",
          timelineText: "Pick your current stage and jump into concrete tasks.",
          timelineMeta: "Actionable path",
          timelineCta: "Open step",
          resourcesTitle: "School Shortlist Tool",
          resourcesText: "A guided questionnaire that generates 8 schools and next-step hints.",
          resourcesMeta: "AI-assisted",
          resourcesCta: "Start now",
          postsTitle: "Latest Posts",
          postsAll: "View all",
          postsText: `Recently updated ${posts.length} posts.`,
          postRead: "Read",
          aboutTitle: "About DegreePath",
          aboutText:
            "Think of this as an evolving study-abroad handbook. The goal is to turn information into action.",
          contactTitle: "Contact",
          contactText: "Reach out for feedback, topic requests, or collaboration.",
          contactEmailLabel: "Email",
          contactEmailValue: "hello@degreepath.site",
          contactReplyLabel: "Response Time",
          contactReplyValue: "Usually within 48 hours",
          contactSocialLabel: "Social",
          contactSocialValue: "xiaohongshu / Instagram: @degreepath",
          footer: "Cozy study-abroad notes",
        }
      : {
          navTimeline: "流程",
          navResources: "选校工具",
          navPosts: "文章",
          navAbout: "关于",
          navContact: "联系",
          switchLabel: "EN",
          heroTag: "CN / EN · Germany-focused",
          heroLiveLabel: "当前焦点",
          heroLiveWords: ["流程", "模板", "经验", "清单"],
          heroSubtitle: "把留学准备过成有节奏的日常",
          heroText:
            "这里不是“信息堆叠”，而是把复杂流程拆成每天能完成的一小步。你可以从流程、模板和真实经历三个入口开始，慢慢把不确定感变成可执行的清单。",
          heroHint: "从下方功能卡片进入你当前最需要的部分。",
          s1Title: "准备流程",
          s1Text: "把申请拆成阶段任务，避免“一次做太多”导致焦虑和中断。",
          s1Link: "打开时间线",
          s2Title: "学校初选",
          s2Text: "回答关键问题，自动给出 8 所学校和匹配理由。",
          s2Link: "进入工具",
          s3Title: "真实经历",
          s3Text: "把踩坑、等待和复盘写清楚，帮你少走弯路也少一点内耗。",
          s3Link: "读文章",
          timelineTitle: "准备流程",
          timelineText: "先选一个你现在所处的阶段，直接进入本周可执行任务。",
          timelineMeta: "可执行路径",
          timelineCta: "进入该步骤",
          resourcesTitle: "学校初选工具",
          resourcesText: "通过问卷快速生成 8 所建议学校，并附带下一步动作提示。",
          resourcesMeta: "AI 辅助",
          resourcesCta: "立即开始",
          postsTitle: "最新文章",
          postsAll: "查看全部",
          postsText: `最近更新 ${posts.length} 篇，先从最靠近你当下阶段的主题读起。`,
          postRead: "点击阅读",
          aboutTitle: "关于 DegreePath",
          aboutText:
            "你可以把这里当成一个会持续更新的留学知识手账。内容会覆盖考试、申请、签证和德国生活细节，目标是让信息不只是“看过”，而是能直接变成行动。",
          contactTitle: "联系我",
          contactText: "如果你想提建议、反馈问题或合作交流，可以通过下面方式联系。",
          contactEmailLabel: "邮箱",
          contactEmailValue: "hello@degreepath.site",
          contactReplyLabel: "回复时间",
          contactReplyValue: "通常 48 小时内",
          contactSocialLabel: "社交平台",
          contactSocialValue: "小红书 / Instagram: @degreepath",
          footer: "Cozy study-abroad notes",
        };

  return (
    <main className="min-h-screen text-[var(--foreground)]">
      <HomeMotion />
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="scroll-tint" />
          <div className="floating-blob blob-a" />
          <div className="floating-blob blob-b" />
          <div className="floating-blob blob-c" />
          <div className="orbit-ring orbit-1">
            <span className="orbit-dot orbit-dot-main" />
            <span className="orbit-dot orbit-dot-secondary" />
            <span className="orbit-dot orbit-dot-mini" />
          </div>
          <div className="orbit-ring orbit-2">
            <span className="orbit-dot orbit-dot-main" />
            <span className="orbit-dot orbit-dot-secondary" />
            <span className="orbit-dot orbit-dot-mini" />
          </div>
          <div className="pulse-core" />
        </div>
        <header className="paper sticky top-4 z-40 rounded-3xl px-6 py-5 backdrop-blur-md md:px-8">
          <div className="flex items-center justify-between">
            <div className="text-xl font-semibold tracking-tight">
              Degree<span className="accent">Path</span>
            </div>
            <div className="flex items-center gap-5">
              <nav className="hidden gap-6 text-sm muted md:flex">
                <a
                  className="nav-orbit-link hover:text-[var(--accent)] data-[active=true]:text-[var(--accent)]"
                  href="#timeline"
                  data-nav-link
                  data-target="timeline"
                >
                  {t.navTimeline}
                </a>
                <a
                  className="nav-orbit-link hover:text-[var(--accent)] data-[active=true]:text-[var(--accent)]"
                  href="#resources"
                  data-nav-link
                  data-target="resources"
                >
                  {t.navResources}
                </a>
                <a
                  className="nav-orbit-link hover:text-[var(--accent)] data-[active=true]:text-[var(--accent)]"
                  href="#posts"
                  data-nav-link
                  data-target="posts"
                >
                  {t.navPosts}
                </a>
                <a
                  className="nav-orbit-link hover:text-[var(--accent)] data-[active=true]:text-[var(--accent)]"
                  href="#about"
                  data-nav-link
                  data-target="about"
                >
                  {t.navAbout}
                </a>
                <a
                  className="nav-orbit-link hover:text-[var(--accent)] data-[active=true]:text-[var(--accent)]"
                  href="#contact"
                  data-nav-link
                  data-target="contact"
                >
                  {t.navContact}
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

        <section
          className="mt-8 rounded-3xl border border-[var(--line)] bg-[linear-gradient(135deg,#fff7ef_0%,#f8ebdc_100%)] px-6 py-10 md:px-10 md:py-12"
          data-reveal
        >
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-medium text-[var(--muted)]">{t.heroTag}</p>
            <div className="hero-cycle rounded-full border border-[var(--line)] bg-white/70 px-3 py-1 text-xs">
              <span className="muted">{t.heroLiveLabel}:</span>{" "}
              <span className="cycle-window">
                <span className="cycle-track">
                  {t.heroLiveWords.map((word) => (
                    <span key={word}>{word}</span>
                  ))}
                </span>
              </span>
            </div>
          </div>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            DegreePath
            <span className="block text-3xl text-[var(--accent)] md:text-5xl">{t.heroSubtitle}</span>
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-[var(--muted)]">{t.heroText}</p>
          <p className="mt-6 text-sm muted">{t.heroHint}</p>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3" data-reveal>
          <div className="paper rounded-2xl p-6">
            <div className="text-sm muted">Timeline</div>
            <h2 className="mt-2 text-xl font-semibold">{t.s1Title}</h2>
            <p className="mt-2 text-sm muted">{t.s1Text}</p>
            <a href="#timeline" className="mt-4 inline-block text-sm font-medium accent hover:underline">
              {t.s1Link} →
            </a>
          </div>

          <div className="paper rounded-2xl p-6">
            <div className="text-sm muted">{lang === "en" ? "School Tool" : "选校工具"}</div>
            <h2 className="mt-2 text-xl font-semibold">{t.s2Title}</h2>
            <p className="mt-2 text-sm muted">{t.s2Text}</p>
            <Link href={withLang("/school-shortlist", lang)} className="mt-4 inline-block text-sm font-medium accent hover:underline">
              {t.s2Link} →
            </Link>
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

        <section id="timeline" className="mt-16" data-reveal>
          <h3 className="text-2xl font-semibold">{t.timelineTitle}</h3>
          <p className="mt-2 text-sm muted">{t.timelineText}</p>

          <ol className="mt-6 grid gap-4 md:grid-cols-2">
            {timelineSteps.map((step, index) => (
              <li key={step.slug} data-reveal-item>
                <Link
                  href={withLang(`/timeline/${step.slug}`, lang)}
                  className="paper group block rounded-2xl p-5 text-sm transition hover:-translate-y-0.5 hover:bg-[var(--accent-soft)]"
                  data-tilt
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--paper)] text-xs font-semibold text-[var(--accent)]">
                        {index + 1}
                      </div>
                      <div className="text-xs uppercase tracking-wider muted">
                        {t.timelineMeta}
                      </div>
                    </div>
                    <div className="text-xs muted transition group-hover:text-[var(--accent)]">
                      {t.timelineCta} →
                    </div>
                  </div>
                  <div className="mt-3 text-lg font-semibold leading-snug">
                    {step.title[lang]}
                  </div>
                  <div className="mt-1 text-sm muted">{step.subtitle[lang]}</div>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section id="resources" className="mt-16" data-reveal>
          <h3 className="text-2xl font-semibold">{t.resourcesTitle}</h3>
          <p className="mt-2 text-sm muted">{t.resourcesText}</p>

          <Link
            href={withLang("/school-shortlist", lang)}
            data-reveal-item
            className="paper group mt-6 block rounded-3xl p-6 transition hover:-translate-y-0.5 hover:bg-[var(--accent-soft)]"
            data-tilt
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs uppercase tracking-wider muted">{t.resourcesMeta}</div>
              <div className="rounded-full border border-[var(--line)] px-2 py-0.5 text-[10px] font-semibold muted">
                7 blocks · 21 Qs
              </div>
            </div>
            <div className="mt-3 text-xl font-semibold">{t.resourcesTitle}</div>
            <div className="mt-2 text-sm muted">{t.resourcesText}</div>
            <div className="mt-4 inline-flex rounded-full border border-[var(--line)] bg-white/70 px-3 py-1 text-xs font-medium transition group-hover:text-[var(--accent)]">
              {t.resourcesCta} →
            </div>
          </Link>
        </section>

        <section id="posts" className="mt-16" data-reveal>
          <div className="flex items-end justify-between gap-4">
            <h3 className="text-2xl font-semibold">{t.postsTitle}</h3>
            <Link href={withLang("/posts", lang)} className="text-sm muted hover:text-[var(--accent)]">
              {t.postsAll} →
            </Link>
          </div>

          <p className="mt-3 text-sm muted">{t.postsText}</p>

          <div className="mt-6 grid gap-4">
            {latestPosts.map((post) => (
              <Link
                key={post.slug}
                href={withLang(`/posts/${post.slug}`, lang)}
                className="paper block rounded-2xl p-5 transition hover:-translate-y-0.5 hover:bg-[var(--accent-soft)]"
                data-tilt
              >
                <div className="text-xs muted">{post.date}</div>
                <div className="mt-1 text-lg font-semibold">{post.title}</div>
                {post.excerpt ? <div className="mt-2 text-sm muted">{post.excerpt}</div> : null}
                <div className="mt-2 text-sm muted">{t.postRead} →</div>
              </Link>
            ))}
          </div>
        </section>

        <section id="about" className="mt-16" data-reveal>
          <h3 className="text-2xl font-semibold">{t.aboutTitle}</h3>
          <p className="mt-4 max-w-3xl text-sm muted">{t.aboutText}</p>
        </section>

        <section id="contact" className="mt-16" data-reveal>
          <h3 className="text-2xl font-semibold">{t.contactTitle}</h3>
          <p className="mt-2 text-sm muted">{t.contactText}</p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="paper rounded-2xl p-6">
              <div className="text-sm muted">{t.contactEmailLabel}</div>
              <div className="mt-2 text-base font-medium">{t.contactEmailValue}</div>
            </div>
            <div className="paper rounded-2xl p-6">
              <div className="text-sm muted">{t.contactReplyLabel}</div>
              <div className="mt-2 text-base font-medium">{t.contactReplyValue}</div>
            </div>
            <div className="paper rounded-2xl p-6">
              <div className="text-sm muted">{t.contactSocialLabel}</div>
              <div className="mt-2 text-base font-medium">{t.contactSocialValue}</div>
            </div>
          </div>
        </section>

        <footer className="mt-16 border-t border-[var(--line)] py-8 text-sm muted">
          © {new Date().getFullYear()} DegreePath · {t.footer}
        </footer>
      </div>
    </main>
  );
}
