export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tag: "Exam" | "Application" | "Life";
  content: string;
};

export const posts: Post[] = [
  {
    slug: "ielts-7",
    title: "IELTS：我怎么从焦虑到稳定 7.0",
    excerpt: "从拖延、恐慌到系统准备，我是怎么把备考拆成每日任务的。",
    date: "2026-02-13",
    tag: "Exam",
    content: `
这是正文占位。

我后来意识到：
焦虑来自模糊。
清单能消除模糊。
`,
  },
  {
    slug: "aps-waiting",
    title: "APS：最折磨的等待期",
    excerpt: "等待期比考试更焦虑。你控制不了进度，但能控制节奏。",
    date: "2026-02-13",
    tag: "Application",
    content: `
等待期比考试更焦虑。

你不能控制审核，
但你能控制准备。
`,
  },
  {
    slug: "germany-life",
    title: "德国生活：落地第一周的生存清单",
    excerpt: "注册、开户、保险、交通卡。落地七天内必须完成的事情。",
    date: "2026-02-13",
    tag: "Life",
    content: `
这里会分享一些实用的建议和资源，帮助你顺利适应德国生活。

第一周建议完成：
1. Anmeldung 注册
2. 开银行账户
3. 办健康保险
4. 购买交通票
`,
  },
];

export function getPostBySlug(slug: string) {
  return posts.find((p) => p.slug === slug);
}
