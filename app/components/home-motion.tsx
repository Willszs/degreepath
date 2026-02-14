"use client";

import { useEffect, useState } from "react";

export default function HomeMotion() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.documentElement.dataset.motion = "on";

    const sections = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));
    const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]"));
    const revealSections = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    revealSections.forEach((section, sectionIndex) => {
      section.style.transitionDelay = `${Math.min(sectionIndex * 40, 220)}ms`;
      const revealItems = Array.from(section.querySelectorAll<HTMLElement>("[data-reveal-item]"));
      revealItems.forEach((item, itemIndex) => {
        item.style.transitionDelay = `${80 + itemIndex * 55}ms`;
      });
    });

    const updateScrollState = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progressRatio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      const nextProgress = progressRatio * 100;
      setProgress(nextProgress);
      document.documentElement.style.setProperty("--scroll-progress", `${progressRatio}`);
      document.documentElement.style.setProperty("--parallax-offset", `${window.scrollY * 0.08}px`);

      let currentSectionId = sections[0]?.id;
      for (const section of sections) {
        if (window.scrollY + 180 >= section.offsetTop) {
          currentSectionId = section.id;
        }
      }

      navLinks.forEach((link) => {
        const target = link.dataset.target;
        if (target && target === currentSectionId) {
          link.dataset.active = "true";
        } else {
          link.dataset.active = "false";
        }
      });
    };

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -10% 0px" },
    );

    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      revealObserver.observe(el);
    });

    const tiltCards = Array.from(document.querySelectorAll<HTMLElement>("[data-tilt]"));
    const handleMouseMove = (event: Event) => {
      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const mouseEvent = event as MouseEvent;
      const x = mouseEvent.clientX - rect.left;
      const y = mouseEvent.clientY - rect.top;
      const px = x / rect.width;
      const py = y / rect.height;
      const rotateY = (px - 0.5) * 8;
      const rotateX = (0.5 - py) * 8;

      target.style.setProperty("--tilt-x", `${rotateX}deg`);
      target.style.setProperty("--tilt-y", `${rotateY}deg`);
      target.style.setProperty("--spot-x", `${px * 100}%`);
      target.style.setProperty("--spot-y", `${py * 100}%`);
    };

    const handleMouseLeave = (event: Event) => {
      const target = event.currentTarget as HTMLElement;
      target.style.setProperty("--tilt-x", "0deg");
      target.style.setProperty("--tilt-y", "0deg");
      target.style.setProperty("--spot-x", "50%");
      target.style.setProperty("--spot-y", "50%");
    };

    tiltCards.forEach((card) => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
      card.style.setProperty("--spot-x", "50%");
      card.style.setProperty("--spot-y", "50%");
      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);
    });

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    window.addEventListener("hashchange", updateScrollState);

    return () => {
      revealObserver.disconnect();
      delete document.documentElement.dataset.motion;
      window.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      window.removeEventListener("hashchange", updateScrollState);
      tiltCards.forEach((card) => {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed left-0 right-0 top-0 z-50 h-1 origin-left bg-[var(--accent)]/80"
      style={{ transform: `scaleX(${progress / 100})` }}
    />
  );
}
