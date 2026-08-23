const revealTargets = document.querySelectorAll(
  ".info-surface, .category-card, .steps-list > li, .sidequest-quiz, .recent-quests, .saved-quests"
);
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (!("IntersectionObserver" in window) || prefersReducedMotion.matches) {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -8%"
  });

  revealTargets.forEach((target, index) => {
    target.classList.add("scroll-reveal");
    target.style.setProperty("--reveal-delay", `${(index % 3) * 60}ms`);
    revealObserver.observe(target);
  });
}
