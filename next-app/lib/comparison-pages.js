export const comparisonPages = {
  "indoor-vs-outdoor-side-quests": {
    slug: "indoor-vs-outdoor-side-quests",
    title: "Indoor vs. Outdoor SideQuests",
    description:
      "Compare indoor and outdoor SideQuests by setup, energy, flexibility, and the kind of change of scenery you want today.",
    eyebrow: "Choose your setting",
    heading: { lead: "Indoor vs. Outdoor", accent: "SideQuests." },
    intro:
      "Both paths can interrupt the routine. The better choice is the one that fits today’s weather, energy, space, and appetite for a change of scenery.",
    left: {
      title: "Indoor SideQuests",
      symbol: "⌂",
      summary:
        "Use familiar rooms, everyday objects, food, books, music, or creative supplies in a slightly different way.",
      dimensions: [
        { label: "Best for", value: "Stay-in days, limited travel time, or weather-proof plans" },
        { label: "Typical setup", value: "Household items and a small, comfortable workspace" },
        { label: "Energy", value: "Easy to scale down for quiet or low-energy moments" },
        { label: "Flexibility", value: "Simple to pause, shorten, or repeat without travel" },
      ],
      exampleCategories: ["Creative", "Food", "Relaxing"],
    },
    right: {
      title: "Outdoor SideQuests",
      symbol: "↑",
      summary:
        "Step outside for fresh air, movement, observation, or a nearby destination that changes the day’s scenery.",
      dimensions: [
        { label: "Best for", value: "Fresh air, movement, noticing, or a local change of scene" },
        { label: "Typical setup", value: "Comfortable conditions and a realistic route or destination" },
        { label: "Energy", value: "Ranges from five quiet minutes to a longer local outing" },
        { label: "Flexibility", value: "Easy to adjust by distance, pace, weather, and daylight" },
      ],
      exampleCategories: ["Outdoors", "Local Adventure"],
    },
    guidance: [
      "Choose indoors when convenience, comfort, or a dependable stopping point matters most.",
      "Choose outdoors when changing the scenery is the part that sounds energizing or restorative.",
      "Keep a backup path: an outdoor observation quest can become a window-view challenge, and an indoor photo prompt can move outside.",
    ],
    relatedLinks: [
      { href: "/indoor-side-quests", label: "Browse Indoor Side Quests" },
      { href: "/weekend-side-quests", label: "Explore Weekend Side Quests" },
      { href: "/categories", label: "See all quest categories" },
    ],
  },
  "creative-vs-relaxing-side-quests": {
    slug: "creative-vs-relaxing-side-quests",
    title: "Creative vs. Relaxing SideQuests",
    description:
      "Compare creative and relaxing SideQuests by focus, energy, outcomes, and the kind of reset you want from a small activity.",
    eyebrow: "Choose your kind of reset",
    heading: { lead: "Creative vs. Relaxing", accent: "SideQuests." },
    intro:
      "One path gives your attention something playful to make; the other gives it room to soften. Neither needs to be impressive or productive.",
    left: {
      title: "Creative SideQuests",
      symbol: "✎",
      summary:
        "Use a small prompt or constraint to draw, write, photograph, arrange, invent, or experiment without pressure to polish the result.",
      dimensions: [
        { label: "Best for", value: "Curiosity, playful focus, or making one small thing" },
        { label: "Typical setup", value: "A simple material, tool, or rule that creates a starting point" },
        { label: "Energy", value: "Often a little active, but easy to contain with a timer" },
        { label: "Finish line", value: "A sketch, photo, list, story, arrangement, or useful experiment" },
      ],
      exampleCategories: ["Creative"],
    },
    right: {
      title: "Relaxing SideQuests",
      symbol: "~",
      summary:
        "Slow the pace with a calm ritual, a quiet observation, a favorite book or song, or one gentle reset in your space.",
      dimensions: [
        { label: "Best for", value: "Unwinding, grounding attention, or creating a softer pause" },
        { label: "Typical setup", value: "A comfortable spot and very few decisions or supplies" },
        { label: "Energy", value: "Usually low or easy to adapt when energy is limited" },
        { label: "Finish line", value: "A few intentional minutes that feel different from autopilot" },
      ],
      exampleCategories: ["Relaxing"],
    },
    guidance: [
      "Choose Creative when a small constraint sounds more inviting than an open-ended break.",
      "Choose Relaxing when reducing decisions and stimulation is the more useful change.",
      "Combine them gently: sketch while listening to one song, arrange a reading corner, or photograph a calming detail.",
    ],
    relatedLinks: [
      { href: "/creative-side-quests", label: "Browse Creative Side Quests" },
      { href: "/low-energy-side-quests", label: "Explore Low-Energy Side Quests" },
      { href: "/categories", label: "See all quest categories" },
    ],
  },
};

export function getComparisonExamples(quests, side, limit = 3) {
  return quests
    .filter((quest) => side.exampleCategories.includes(quest.category))
    .slice(0, limit);
}

