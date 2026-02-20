"use client";

import { useEffect } from "react";

export default function TimelineAccordionEnhancer() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-timeline-accordion]");
    if (!root) return;

    const items = Array.from(root.querySelectorAll<HTMLDetailsElement>("[data-accordion-item]"));
    if (items.length === 0) return;

    const handleToggle = (event: Event) => {
      const target = event.currentTarget as HTMLDetailsElement;
      if (!target.open) return;

      items.forEach((item) => {
        if (item !== target) item.open = false;
      });

      requestAnimationFrame(() => {
        const summary = target.querySelector<HTMLElement>("summary");
        summary?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };

    items.forEach((item) => {
      item.addEventListener("toggle", handleToggle);
    });

    return () => {
      items.forEach((item) => {
        item.removeEventListener("toggle", handleToggle);
      });
    };
  }, []);

  return null;
}
