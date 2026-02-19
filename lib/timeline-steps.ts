import timelineStepsData from "@/content/timeline-steps.json";

export type TimelineTask = {
  title: string;
  content: string;
};

export type TimelineStep = {
  slug: string;
  title: { zh: string; en: string };
  subtitle: { zh: string; en: string };
  items: { zh: TimelineTask[]; en: TimelineTask[] };
};

export const timelineSteps = timelineStepsData.steps as TimelineStep[];
