export const ideaCollections = [
  {
    href: "/side-quests-for-boredom",
    symbol: "↺",
    kicker: "Break the routine",
    title: "Side Quests for Boredom",
    description:
      "Quick, curious prompts for open afternoons, quiet evenings, and moments when the usual options feel stale.",
  },
  {
    href: "/creative-side-quests",
    symbol: "✎",
    kicker: "Make something small",
    title: "Creative Side Quests",
    description:
      "Low-pressure ideas for drawing, writing, photography, making, and playful experiments.",
  },
  {
    href: "/low-energy-side-quests",
    symbol: "☁",
    kicker: "Keep it gentle",
    title: "Low-Energy Side Quests",
    description:
      "Quiet, achievable activities with little setup and an easy stopping point.",
  },
  {
    href: "/indoor-side-quests",
    symbol: "⌂",
    kicker: "Adventure inside",
    title: "Indoor Side Quests",
    description:
      "Turn familiar rooms, everyday objects, and supplies you already have into a new experience.",
  },
  {
    href: "/weekend-side-quests",
    symbol: "☀",
    kicker: "Give the day a story",
    title: "Weekend Side Quests",
    description:
      "Approachable local adventures and creative projects for an open hour or afternoon.",
  },
];

export const exploreCollectionLinks = ideaCollections.filter(({ href }) =>
  [
    "/weekend-side-quests",
    "/creative-side-quests",
    "/indoor-side-quests",
  ].includes(href),
);
