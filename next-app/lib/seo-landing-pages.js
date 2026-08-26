import { createPublicMetadata } from "@/lib/social-metadata";

export const seoLandingPages = {
  "side-quests-for-boredom": {
    slug: "side-quests-for-boredom",
    title: "Side Quests for Boredom",
    description:
      "Find small, interesting things to do when you are bored, from quick observation games to low-pressure local adventures.",
    eyebrow: "Trade the scroll for a plot twist",
    heading: { lead: "Side Quests", accent: "for Boredom." },
    intro:
      "Boredom does not always need a grand plan. Sometimes it only needs one specific, slightly unexpected thing to do next.",
    audience: {
      kicker: "For the in-between moments",
      heading: "When you want novelty without a whole itinerary.",
      paragraphs: [
        "These boredom-breakers are for quiet afternoons, open evenings, and those moments when every usual option feels a little too familiar. Each idea gives your attention somewhere concrete to go without turning free time into another assignment.",
        "Pick the quest that creates the smallest spark of curiosity. You are allowed to try it for ten minutes, change the rules, or stop once the moment feels more interesting than it did before.",
      ],
    },
    ideas: [
      {
        symbol: "↺",
        tag: "15 minutes",
        title: "Walk your usual route backward",
        description:
          "Start at the familiar finish and notice three details you have never paid attention to from the other direction.",
      },
      {
        symbol: "◌",
        tag: "At home",
        title: "Build a one-shelf museum",
        description:
          "Choose five ordinary objects, arrange them like exhibits, and write a tiny museum label for the strangest one.",
      },
      {
        symbol: "▣",
        tag: "Photo quest",
        title: "Photograph five hidden circles",
        description:
          "Look for round shapes in signs, shadows, dishes, or architecture and turn them into a miniature photo collection.",
      },
      {
        symbol: "≈",
        tag: "Quick skill",
        title: "Learn one satisfying flourish",
        description:
          "Practice a simple card shuffle, paper fold, knot, or handwriting flourish until you can do it once smoothly.",
      },
      {
        symbol: "✦",
        tag: "Tiny taste test",
        title: "Give a familiar snack one twist",
        description:
          "Add a spice, texture, temperature change, or unexpected pairing and decide whether the remix deserves an encore.",
      },
      {
        symbol: "?",
        tag: "Curiosity",
        title: "Answer one neighborhood question",
        description:
          "Pick something nearby you have always wondered about, then take a short walk or do a focused search to find the answer.",
      },
    ],
    guide: {
      kicker: "Choose without overthinking",
      heading: "Use boredom as a clue, not a command.",
      intro:
        "The best quest depends on what kind of change you want from the next few minutes.",
      tips: [
        {
          title: "Change the setting",
          description:
            "If the room feels stale, choose a quest that gets you to a window, hallway, porch, or nearby block.",
        },
        {
          title: "Match the clock",
          description:
            "Pick something that fits the time you actually have. A finished ten-minute quest beats an imaginary two-hour plan.",
        },
        {
          title: "Follow the odd detail",
          description:
            "When two ideas seem equal, choose the one that makes you say, “Huh, I have never tried that.”",
        },
      ],
    },
    cta: {
      kicker: "Let chance choose",
      heading: "Ready for a less predictable next ten minutes?",
      description:
        "Generate one SideQuest now, or use the quick quiz when you want an idea matched to your energy and available time.",
      primary: "Generate a boredom-breaker",
      secondary: "Match a quest to my mood",
    },
    related: [
      {
        href: "/indoor-side-quests",
        title: "Indoor Side Quests",
        description: "Interesting ideas that stay comfortably inside.",
      },
      {
        href: "/creative-side-quests",
        title: "Creative Side Quests",
        description: "Make something small without waiting for inspiration.",
      },
      {
        href: "/weekend-side-quests",
        title: "Weekend Side Quests",
        description: "Use a wider pocket of free time for a nearby adventure.",
      },
    ],
    resourceLinks: [
      { href: "/categories", label: "Browse every quest category" },
      { href: "/how-it-works", label: "See how SideQuest works" },
      { href: "/pricing", label: "Compare free and optional plans" },
    ],
    faqs: [
      {
        question: "What can I do when I am bored at home?",
        answer:
          "Choose a quest that changes how you look at your space: make a tiny display, photograph a visual pattern, try one small recipe twist, or learn a skill that needs only what you already have.",
      },
      {
        question: "How do I choose when none of the ideas jump out?",
        answer:
          "Use a simple filter: how much time do you have, do you want to move or stay put, and would you rather make, notice, taste, or explore? The SideQuest quiz can make that choice for you.",
      },
      {
        question: "Do boredom side quests need to cost money?",
        answer:
          "No. Observation games, short walks, creative constraints, and mini skill challenges can all use your surroundings and supplies you already own.",
      },
    ],
  },

  "creative-side-quests": {
    slug: "creative-side-quests",
    title: "Creative Side Quests",
    description:
      "Try approachable creative side quests for drawing, writing, photography, making, and playful experimentation.",
    eyebrow: "Make first, judge never",
    heading: { lead: "Creative", accent: "Side Quests." },
    intro:
      "Creativity gets easier when the assignment is tiny, specific, and allowed to be wonderfully imperfect.",
    audience: {
      kicker: "For curious hands and unfinished ideas",
      heading: "A small prompt can be enough to begin.",
      paragraphs: [
        "These quests are for experienced makers, total beginners, and anyone who wants to use imagination without producing a masterpiece. The goal is to explore one constraint, material, image, or sentence and see where it leads.",
        "Keep the result private if that makes starting easier. A rough sketch, strange photo, crooked paper model, or fifty-word story still counts as a complete creative detour.",
      ],
    },
    ideas: [
      {
        symbol: "✎",
        tag: "Drawing",
        title: "Draw a six-frame ordinary-object comic",
        description:
          "Give a mug, sock, key, or houseplant a tiny problem and let it solve the problem in six simple boxes.",
      },
      {
        symbol: "Aa",
        tag: "Writing",
        title: "Write a story in exactly fifty words",
        description:
          "Include one place you know, one surprising sound, and a final sentence that changes the meaning of the first.",
      },
      {
        symbol: "▤",
        tag: "Color",
        title: "Collect a palette from one room",
        description:
          "Choose five colors already around you, name the palette, and use it for a quick doodle, collage, or digital swatch.",
      },
      {
        symbol: "▣",
        tag: "Photography",
        title: "Shoot a texture-only photo series",
        description:
          "Take five close-up photos that could belong to the same mysterious place, without showing the full objects.",
      },
      {
        symbol: "◇",
        tag: "Paper craft",
        title: "Prototype a pocket-sized invention",
        description:
          "Use scrap paper and tape to model a tool for an extremely specific problem, useful or completely ridiculous.",
      },
      {
        symbol: "☰",
        tag: "Design",
        title: "Create a menu for an imaginary café",
        description:
          "Choose a theme, invent three items, set playful prices, and add one house rule that gives the café personality.",
      },
    ],
    guide: {
      kicker: "Protect the playful part",
      heading: "Make the creative decision smaller.",
      intro:
        "A useful constraint removes the pressure to invent everything at once.",
      tips: [
        {
          title: "Choose one material",
          description:
            "Use only a pen, phone camera, notes app, or sheet of paper so gathering supplies does not become the project.",
        },
        {
          title: "Set a finish line",
          description:
            "Decide on six frames, five photos, fifty words, or fifteen minutes. A clear edge makes experimenting safer.",
        },
        {
          title: "Keep the first draft",
          description:
            "Resist polishing long enough to notice the interesting accident, odd phrase, or unexpected shape that appeared.",
        },
      ],
    },
    cta: {
      kicker: "Start before inspiration",
      heading: "Give your imagination one small assignment.",
      description:
        "Generate a fresh SideQuest for a surprise prompt, or take the quiz and choose Creative when you want a closer match.",
      primary: "Generate a creative quest",
      secondary: "Find my creative match",
    },
    related: [
      {
        href: "/indoor-side-quests",
        title: "Indoor Side Quests",
        description: "Turn familiar rooms and supplies into a new setting.",
      },
      {
        href: "/side-quests-for-boredom",
        title: "Side Quests for Boredom",
        description: "Swap passive scrolling for one curious experiment.",
      },
      {
        href: "/low-energy-side-quests",
        title: "Low-Energy Side Quests",
        description: "Try a gentler prompt with a very small finish line.",
      },
    ],
    resourceLinks: [
      { href: "/categories", label: "Explore the Creative category" },
      { href: "/how-it-works", label: "Learn how to save a good prompt" },
      { href: "/pricing", label: "See SideQuest options" },
    ],
    faqs: [
      {
        question: "Do I need to be artistic to try a creative side quest?",
        answer:
          "Not at all. These activities reward curiosity, constraints, and experimentation—not technical skill. The result can be rough, private, and made just for the experience of making it.",
      },
      {
        question: "What is a creative activity I can finish in ten minutes?",
        answer:
          "Try a fifty-word story, a three-color doodle, one unusual photograph, or a tiny paper prototype. Give the activity a clear limit and stop when the limit is reached.",
      },
      {
        question: "What if I dislike what I make?",
        answer:
          "The quest still worked: you tested an idea and learned what did not interest you. Keep one detail you enjoyed, then try a different medium or constraint next time.",
      },
    ],
  },

  "low-energy-side-quests": {
    slug: "low-energy-side-quests",
    title: "Low-Energy Side Quests",
    description:
      "Discover gentle, low-energy things to do when you want a small activity without a demanding plan or long commitment.",
    eyebrow: "A tiny quest still counts",
    heading: { lead: "Low-Energy", accent: "Side Quests." },
    intro:
      "When your available energy is limited, the right adventure can be seated, quiet, brief, and still pleasantly different.",
    audience: {
      kicker: "For slower pockets of time",
      heading: "Do something small without asking too much of yourself.",
      paragraphs: [
        "These ideas are designed for moments when you want an activity but not a production. They use short time limits, familiar spaces, and easy stopping points so you can participate at the pace you actually have.",
        "This is not medical guidance, and there is nothing to prove. Choose the gentlest interesting option, adapt it freely, and let completion mean simply noticing, arranging, listening, or making one small thing.",
      ],
    },
    ideas: [
      {
        symbol: "♫",
        tag: "Listen",
        title: "Notice one new detail in a favorite song",
        description:
          "Play one track without multitasking and listen for a background sound, lyric, rhythm, or instrument you missed before.",
      },
      {
        symbol: "☕",
        tag: "Cozy ritual",
        title: "Make an ordinary drink ceremonial",
        description:
          "Choose a favorite cup, add one thoughtful detail, and enjoy the first few sips somewhere you do not usually sit.",
      },
      {
        symbol: "▭",
        tag: "Five minutes",
        title: "Reset one postcard-sized space",
        description:
          "Clear and arrange only the area beneath a book, lamp, bedside item, or small tray—then declare the quest finished.",
      },
      {
        symbol: "☁",
        tag: "Observe",
        title: "Write a three-line weather report",
        description:
          "Describe the light, movement, and mood outside one window without checking an app or trying to sound poetic.",
      },
      {
        symbol: "▣",
        tag: "Memory",
        title: "Give one old photo a better caption",
        description:
          "Choose a photo you like and write one sentence about the detail future-you should remember.",
      },
      {
        symbol: "●",
        tag: "Color hunt",
        title: "Find five shades of one color",
        description:
          "Pick a color and locate five versions of it from where you are, noticing which one feels most unexpected.",
      },
    ],
    guide: {
      kicker: "Keep the effort honest",
      heading: "Choose for the energy you have, not the energy you wish you had.",
      intro:
        "A low-energy quest works best when the starting step is obvious and the stopping point is close.",
      tips: [
        {
          title: "Stay within reach",
          description:
            "Favor ideas that use the chair, window, shelf, phone, paper, or drink already nearby.",
        },
        {
          title: "Cap the commitment",
          description:
            "Set a five- or ten-minute boundary before you begin. Continuing is optional, and stopping on time is success.",
        },
        {
          title: "Pick one sense",
          description:
            "Listening, looking, tasting, or touching gives the quest a clear focus without requiring many steps.",
        },
      ],
    },
    cta: {
      kicker: "Keep it gentle",
      heading: "Find one doable thing for this exact moment.",
      description:
        "Generate a simple quest, or tell the quiz your energy and available time so it can narrow the options for you.",
      primary: "Generate a gentle quest",
      secondary: "Match my current energy",
    },
    related: [
      {
        href: "/indoor-side-quests",
        title: "Indoor Side Quests",
        description: "Stay in and find a small change of scenery nearby.",
      },
      {
        href: "/creative-side-quests",
        title: "Creative Side Quests",
        description: "Choose a tiny prompt with no pressure to polish it.",
      },
      {
        href: "/side-quests-for-boredom",
        title: "Side Quests for Boredom",
        description: "Try a low-commitment interruption to the usual routine.",
      },
    ],
    resourceLinks: [
      { href: "/categories", label: "Browse Relaxing quests" },
      { href: "/how-it-works", label: "See how quest matching works" },
      { href: "/pricing", label: "Review free SideQuest features" },
    ],
    faqs: [
      {
        question: "How long should a low-energy activity take?",
        answer:
          "Five to fifteen minutes is a useful starting range. Choose an activity with a natural stopping point, and treat any extra time as optional rather than required.",
      },
      {
        question: "Do low-energy side quests have to be relaxing?",
        answer:
          "No. They can be curious, creative, funny, or practical. “Low energy” describes the amount of effort and setup, not the mood the activity has to create.",
      },
      {
        question: "Can I adapt a quest to make it easier?",
        answer:
          "Yes. Shorten the timer, stay seated, use fewer items, or complete only the first step. A SideQuest is a prompt, not a rulebook.",
      },
    ],
  },

  "indoor-side-quests": {
    slug: "indoor-side-quests",
    title: "Indoor Side Quests",
    description:
      "Explore fun things to do indoors, including small creative challenges, home discoveries, and no-pressure mini adventures.",
    eyebrow: "The adventure can stay inside",
    heading: { lead: "Indoor", accent: "Side Quests." },
    intro:
      "A familiar room can become a studio, test kitchen, gallery, game board, or tiny research station with one good prompt.",
    audience: {
      kicker: "For weather days and stay-in days",
      heading: "Use the space you already have in a different way.",
      paragraphs: [
        "These indoor activities work when going out is inconvenient, unappealing, or simply not part of the plan. Most use common household items and can fit into a bedroom, kitchen, apartment, office, library, or other indoor space.",
        "Choose a quest that changes the purpose of one corner for a little while. You do not need a dedicated craft room, a large group, or a shopping trip to make indoors feel less routine.",
      ],
    },
    ideas: [
      {
        symbol: "✦",
        tag: "Kitchen",
        title: "Run a three-ingredient flavor experiment",
        description:
          "Choose one familiar base and compare three tiny toppings, seasonings, or pairings like a very small test kitchen.",
      },
      {
        symbol: "▣",
        tag: "Gallery",
        title: "Curate art for one hallway",
        description:
          "Arrange postcards, sketches, packaging, photos, or found colors into a temporary exhibition with a title.",
      },
      {
        symbol: "?",
        tag: "Object detective",
        title: "Research the oldest object in the room",
        description:
          "Find a maker mark, material clue, memory, or design detail and write a short origin card for the object.",
      },
      {
        symbol: "♫",
        tag: "Sound map",
        title: "Map the sounds of your space",
        description:
          "Sit quietly for five minutes, list every sound by direction, then give the room's soundscape a name.",
      },
      {
        symbol: "⌂",
        tag: "Cozy reset",
        title: "Build a twenty-minute reading nook",
        description:
          "Move one light, cushion, and book into a temporary corner designed only for a single reading session.",
      },
      {
        symbol: "→",
        tag: "Mini game",
        title: "Hold a paper-airplane accuracy trial",
        description:
          "Fold one simple plane, choose a safe indoor target, and improve the design over three careful throws.",
      },
    ],
    guide: {
      kicker: "Adventure within the walls",
      heading: "Let the room set useful boundaries.",
      intro:
        "Indoor quests feel better when they suit the space instead of fighting it.",
      tips: [
        {
          title: "Choose a safe footprint",
          description:
            "Match the activity to the room: tabletop making, seated noticing, or a small clear area for movement.",
        },
        {
          title: "Start with what is visible",
          description:
            "Use the books, ingredients, paper, sounds, and objects already around you before hunting for supplies.",
        },
        {
          title: "Change one role",
          description:
            "A table can become a lab, a wall can become a gallery, and a hallway can become a careful game lane.",
        },
      ],
    },
    cta: {
      kicker: "Stay in, switch it up",
      heading: "Turn the room you know into somewhere slightly new.",
      description:
        "Generate a SideQuest and adapt it to your space, or use the quiz to choose a mood, energy level, and time limit first.",
      primary: "Generate an indoor quest",
      secondary: "Find an indoor-friendly match",
    },
    related: [
      {
        href: "/low-energy-side-quests",
        title: "Low-Energy Side Quests",
        description: "Choose an indoor activity with even less setup.",
      },
      {
        href: "/creative-side-quests",
        title: "Creative Side Quests",
        description: "Use paper, a camera, or household objects to make.",
      },
      {
        href: "/side-quests-for-boredom",
        title: "Side Quests for Boredom",
        description: "Find a quick interruption when the room feels too familiar.",
      },
    ],
    resourceLinks: [
      { href: "/categories", label: "Explore Creative and Relaxing categories" },
      { href: "/how-it-works", label: "Learn how to keep favorite quests" },
      { href: "/pricing", label: "Compare SideQuest options" },
    ],
    faqs: [
      {
        question: "What indoor activities need no special supplies?",
        answer:
          "Try a sound map, object-origin investigation, color hunt, short writing prompt, room photography challenge, or temporary rearrangement using items already nearby.",
      },
      {
        question: "Can indoor side quests work in a small apartment?",
        answer:
          "Yes. Favor tabletop, seated, photo, food, observation, and one-corner activities. The useful limit is the space you can comfortably use, not the size of the adventure.",
      },
      {
        question: "Can I do these indoor quests with someone else?",
        answer:
          "Most can be adapted for two or more people by comparing results, taking turns choosing constraints, or collaborating on one small finished piece.",
      },
    ],
  },

  "weekend-side-quests": {
    slug: "weekend-side-quests",
    title: "Weekend Side Quests",
    description:
      "Find approachable weekend activities, from local mini adventures to creative projects that fit real free time.",
    eyebrow: "Give the weekend one good story",
    heading: { lead: "Weekend", accent: "Side Quests." },
    intro:
      "A memorable weekend does not require a packed schedule. One well-chosen detour can give the day a shape of its own.",
    audience: {
      kicker: "For an open hour or an open afternoon",
      heading: "Plan just enough to leave room for discovery.",
      paragraphs: [
        "These weekend ideas sit between doing nothing and organizing a major outing. They are designed for a free morning, a quiet Saturday afternoon, or the last few useful hours before the week begins again.",
        "Choose one anchor activity, keep the travel radius realistic, and leave some margin around it. The best part might be the unexpected shop, view, snack, or conversation you find along the way.",
      ],
    },
    ideas: [
      {
        symbol: "↗",
        tag: "Local adventure",
        title: "Take a three-stop neighborhood sampler",
        description:
          "Choose one drink, one small bite, and one interesting place within a walkable or short-transit route.",
      },
      {
        symbol: "☀",
        tag: "Fresh air",
        title: "Pair a sky moment with a favorite snack",
        description:
          "Pick sunrise, golden hour, or sunset, bring something simple to eat, and stay long enough to notice the light change.",
      },
      {
        symbol: "⌂",
        tag: "Explore nearby",
        title: "Photograph five storefront personalities",
        description:
          "Walk one commercial block and capture signs, windows, colors, or details that make each storefront distinct.",
      },
      {
        symbol: "?",
        tag: "Wildcard",
        title: "Let one shelf choose your afternoon",
        description:
          "Visit a library, bookstore, market, or thrift shop and follow one surprising find into a related activity.",
      },
      {
        symbol: "◇",
        tag: "Theme quest",
        title: "Design a ninety-minute mini theme day",
        description:
          "Choose a color, decade, country, or fictional mood and connect one place, snack, song, and photo to it.",
      },
      {
        symbol: "✎",
        tag: "Souvenir",
        title: "Make a postcard from your own town",
        description:
          "Photograph or sketch one local scene, add a short note about the day, and keep or send the finished postcard.",
      },
    ],
    guide: {
      kicker: "Keep free time feeling free",
      heading: "Build around one anchor, not a packed checklist.",
      intro:
        "A little structure helps a weekend quest happen without consuming the whole day.",
      tips: [
        {
          title: "Choose the time box first",
          description:
            "Decide whether this is a one-hour, half-day, or evening quest before you start adding stops.",
        },
        {
          title: "Set a small radius",
          description:
            "Explore one neighborhood or direct route so more time goes to noticing and less to complicated logistics.",
        },
        {
          title: "Keep a weather backup",
          description:
            "Pair an outdoor idea with an indoor alternative, such as a market, library, café sketch, or home theme quest.",
        },
      ],
    },
    cta: {
      kicker: "Find the weekend's anchor",
      heading: "Pick one adventure and leave the rest of the day breathable.",
      description:
        "Generate a spontaneous SideQuest, or use the quiz when you want the suggestion to fit your time, mood, and energy.",
      primary: "Generate a weekend quest",
      secondary: "Plan my weekend match",
    },
    related: [
      {
        href: "/side-quests-for-boredom",
        title: "Side Quests for Boredom",
        description: "Fill an unplanned hour with one interesting direction.",
      },
      {
        href: "/indoor-side-quests",
        title: "Indoor Side Quests",
        description: "Keep a useful backup for weather or a stay-home day.",
      },
      {
        href: "/creative-side-quests",
        title: "Creative Side Quests",
        description: "Use a longer weekend pocket to make something playful.",
      },
    ],
    resourceLinks: [
      { href: "/categories", label: "Browse Local Adventure and Outdoors quests" },
      { href: "/how-it-works", label: "See how the Adventure Log works" },
      { href: "/pricing", label: "Review SideQuest plans" },
    ],
    faqs: [
      {
        question: "What is a good weekend activity when I have only an hour?",
        answer:
          "Choose one nearby destination or constraint: a photo walk, one new snack, a library browse, a sunset stop, or a small creative project with a firm finish time.",
      },
      {
        question: "Do weekend side quests need advance planning?",
        answer:
          "Usually only a quick check of opening hours, weather, travel time, and budget. Keep the plan to one anchor activity so spontaneity still has room.",
      },
      {
        question: "Can I do a weekend side quest alone?",
        answer:
          "Yes. Observation, photography, browsing, tasting, walking, and making quests all work solo. Many can also become shared activities by inviting someone to compare discoveries.",
      },
    ],
  },
};

export const seoLandingSlugs = Object.keys(seoLandingPages);

export function getSeoLandingPage(slug) {
  return seoLandingPages[slug];
}

export function createSeoLandingMetadata(slug) {
  const page = getSeoLandingPage(slug);

  return createPublicMetadata({
    title: page.title,
    description: page.description,
    path: `/${page.slug}`,
  });
}
