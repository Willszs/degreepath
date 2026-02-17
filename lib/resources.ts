import resourceItemsData from "@/content/resources.json";

export type ResourceItem = {
  slug: string;
  title: { zh: string; en: string };
  subtitle: { zh: string; en: string };
  highlights: { zh: string[]; en: string[] };
};

export const resourceItems = resourceItemsData.items as ResourceItem[];
