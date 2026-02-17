import fs from "fs/promises";
import path from "path";

const postsDir = path.join(process.cwd(), "content", "posts");

export type PostTag = "Exam" | "Application" | "Life";

export type PostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tag: PostTag;
  mtimeMs: number;
};

export type PostDetail = PostSummary & {
  source: string;
};

function normalizeTag(value: string | undefined): PostTag {
  if (value === "Exam" || value === "Application" || value === "Life") {
    return value;
  }
  return "Life";
}

function slugToTitle(slug: string): string {
  return slug.replace(/-/g, " ");
}

function parseFrontmatter(rawSource: string): Record<string, string> {
  const match = rawSource.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return {};

  const entries: Record<string, string> = {};
  const lines = match[1].split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separatorIndex = trimmed.indexOf(":");
    if (separatorIndex < 0) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    entries[key] = value;
  }

  return entries;
}

function stripFrontmatter(rawSource: string): string {
  return rawSource.replace(/^---\n[\s\S]*?\n---\n?/, "");
}

function sortByDateDesc(posts: PostSummary[]): PostSummary[] {
  return posts.sort((a, b) => {
    const aTime = Date.parse(a.date);
    const bTime = Date.parse(b.date);
    const aScore = Number.isNaN(aTime) ? a.mtimeMs : aTime;
    const bScore = Number.isNaN(bTime) ? b.mtimeMs : bTime;
    return bScore - aScore;
  });
}

export async function getPostSummaries(): Promise<PostSummary[]> {
  const files = await fs.readdir(postsDir);
  const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

  const posts = await Promise.all(
    mdxFiles.map(async (file) => {
      const slug = file.replace(/\.mdx$/, "");
      const fullPath = path.join(postsDir, file);
      const rawSource = await fs.readFile(fullPath, "utf8");
      const stat = await fs.stat(fullPath);
      const frontmatter = parseFrontmatter(rawSource);

      return {
        slug,
        title: frontmatter.title ?? slugToTitle(slug),
        excerpt: frontmatter.excerpt ?? "",
        date: frontmatter.date ?? new Date(stat.mtimeMs).toISOString().slice(0, 10),
        tag: normalizeTag(frontmatter.tag),
        mtimeMs: stat.mtimeMs,
      };
    }),
  );

  return sortByDateDesc(posts);
}

export async function getPostSlugs(): Promise<string[]> {
  const posts = await getPostSummaries();
  return posts.map((item) => item.slug);
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const fullPath = path.join(postsDir, `${slug}.mdx`);

  try {
    const [rawSource, stat] = await Promise.all([
      fs.readFile(fullPath, "utf8"),
      fs.stat(fullPath),
    ]);
    const frontmatter = parseFrontmatter(rawSource);

    return {
      slug,
      title: frontmatter.title ?? slugToTitle(slug),
      excerpt: frontmatter.excerpt ?? "",
      date: frontmatter.date ?? new Date(stat.mtimeMs).toISOString().slice(0, 10),
      tag: normalizeTag(frontmatter.tag),
      mtimeMs: stat.mtimeMs,
      source: stripFrontmatter(rawSource),
    };
  } catch {
    return null;
  }
}
