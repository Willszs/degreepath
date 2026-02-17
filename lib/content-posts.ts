import fs from "fs/promises";
import path from "path";
import { VFile } from "vfile";
import { matter } from "vfile-matter";

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

type ParsedFrontmatter = {
  title: string;
  excerpt: string;
  date: string;
  tag: PostTag;
};

function parseAndValidateFrontmatter(rawSource: string, slug: string): ParsedFrontmatter {
  const file = new VFile({ value: rawSource, path: `${slug}.mdx` });
  matter(file);
  const data = (file.data.matter ?? {}) as Record<string, unknown>;

  const title = data.title;
  const excerpt = data.excerpt;
  const date = data.date;
  const tag = data.tag;

  if (typeof title !== "string" || title.trim().length === 0) {
    throw new Error(`[content/posts/${slug}.mdx] Missing or invalid frontmatter: title`);
  }
  if (typeof excerpt !== "string" || excerpt.trim().length === 0) {
    throw new Error(`[content/posts/${slug}.mdx] Missing or invalid frontmatter: excerpt`);
  }
  if (typeof date !== "string" || Number.isNaN(Date.parse(date))) {
    throw new Error(`[content/posts/${slug}.mdx] Missing or invalid frontmatter: date (expected YYYY-MM-DD)`);
  }
  if (tag !== "Exam" && tag !== "Application" && tag !== "Life") {
    throw new Error(`[content/posts/${slug}.mdx] Missing or invalid frontmatter: tag`);
  }

  return { title, excerpt, date, tag };
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
      const frontmatter = parseAndValidateFrontmatter(rawSource, slug);

      return {
        slug,
        title: frontmatter.title,
        excerpt: frontmatter.excerpt,
        date: frontmatter.date,
        tag: frontmatter.tag,
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
    const frontmatter = parseAndValidateFrontmatter(rawSource, slug);

    return {
      slug,
      title: frontmatter.title,
      excerpt: frontmatter.excerpt,
      date: frontmatter.date,
      tag: frontmatter.tag,
      mtimeMs: stat.mtimeMs,
      source: stripFrontmatter(rawSource),
    };
  } catch {
    return null;
  }
}
