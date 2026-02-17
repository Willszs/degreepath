import timelineStepsData from "@/content/timeline-steps.json";

export type TimelineStep = {
  slug: string;
  title: { zh: string; en: string };
  subtitle: { zh: string; en: string };
  items: { zh: string[]; en: string[] };
};

export const timelineSteps = timelineStepsData.steps as TimelineStep[];
