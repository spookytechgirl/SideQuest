"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const revealSelector =
  ".info-surface, .category-card, .steps-list > li, .sidequest-quiz, .recent-quests, .saved-quests";

export default function RevealEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = document.querySelectorAll(revealSelector);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!("IntersectionObserver" in window) || reducedMotion) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8%" },
    );

    targets.forEach((target, index) => {
      target.classList.add("scroll-reveal");
      target.style.setProperty("--reveal-delay", `${(index % 3) * 60}ms`);
      observer.observe(target);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
