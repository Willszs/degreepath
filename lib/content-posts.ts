import fs from "fs/promises";
import path from "path";

const postsDir = path.join(process.cwd(), "content", "posts");

export async function getPostSlugs(): Promise<string[]> {
  const files = await fs.readdir(postsDir);

  const mdxFiles = files.filter((file) => file.endsWith(".mdx"));
  const withMtime = await Promise.all(
    mdxFiles.map(async (file) => {
      const fullPath = path.join(postsDir, file);
      const stat = await fs.stat(fullPath);
      return {
        slug: file.replace(/\.mdx$/, ""),
        mtimeMs: stat.mtimeMs,
      };
    }),
  );

  return withMtime.sort((a, b) => b.mtimeMs - a.mtimeMs).map((item) => item.slug);
}
