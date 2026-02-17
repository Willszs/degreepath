import type { MetadataRoute } from "next";
import { getPostSummaries } from "@/lib/content-posts";
import { supportedLangs, withLang } from "@/lib/i18n";
import { resourceItems } from "@/lib/resources";
import { timelineSteps } from "@/lib/timeline-steps";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

function toAbsolute(path: string): string {
  return new URL(path, baseUrl).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPostSummaries();
  const now = new Date();

  const staticPaths = ["/", "/posts"];
  const timelinePaths = timelineSteps.map((step) => `/timeline/${step.slug}`);
  const resourcePaths = resourceItems.map((item) => `/resources/${item.slug}`);
  const postPaths = posts.map((post) => `/posts/${post.slug}`);

  const allPaths = [...staticPaths, ...timelinePaths, ...resourcePaths, ...postPaths];

  return supportedLangs.flatMap((lang) =>
    allPaths.map((path) => ({
      url: toAbsolute(withLang(path, lang)),
      lastModified: now,
      changeFrequency: path.startsWith("/posts/") ? "weekly" : "monthly",
      priority: path === "/" ? 1 : 0.7,
    })),
  );
}
