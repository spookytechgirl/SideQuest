export const quests = [
  {
    title: "Take a 15-minute walk without your phone.",
    category: "Outdoors",
    effort: "Easy",
    energy: ["low", "medium"],
    moods: ["outside", "relax"],
    times: ["medium"],
  },
  {
    title: "Try a snack or drink you have never had before.",
    category: "Food",
    effort: "Quick",
    energy: ["low", "medium"],
    moods: ["treat", "explore"],
    times: ["short"],
  },
  {
    title: "Write and send a kind note to someone you appreciate.",
    category: "Random",
    effort: "Quick",
    energy: ["low", "medium"],
    moods: ["relax"],
    times: ["short"],
  },
  {
    title: "Visit a nearby park and find the best view.",
    category: "Local Adventure",
    effort: "Adventure",
    energy: ["medium", "high"],
    moods: ["outside", "explore"],
    times: ["long"],
  },
  {
    title: "Learn how to say hello in three new languages.",
    category: "Random",
    effort: "Quick",
    energy: ["low", "medium"],
    moods: ["explore", "create"],
    times: ["short"],
  },
  {
    title: "Sketch something in the room using your non-dominant hand.",
    category: "Creative",
    effort: "A Little Effort",
    energy: ["low", "medium"],
    moods: ["create", "relax"],
    times: ["short", "medium"],
  },
  {
    title: "Put on one song and dance until it ends.",
    category: "Random",
    effort: "Quick",
    energy: ["medium", "high"],
    moods: ["treat"],
    times: ["short"],
  },
  {
    title: "Take five photos of things that share the same color.",
    category: "Creative",
    effort: "A Little Effort",
    energy: ["medium", "high"],
    moods: ["create", "explore", "outside"],
    times: ["medium"],
  },
  {
    title: "Read ten pages of a book you have been meaning to start.",
    category: "Relaxing",
    effort: "Easy",
    energy: ["low"],
    moods: ["relax", "treat"],
    times: ["medium", "long"],
  },
  {
    title: "Make a tiny meal using only ingredients you already have.",
    category: "Food",
    effort: "A Little Effort",
    energy: ["medium", "high"],
    moods: ["create", "treat"],
    times: ["medium", "long"],
  },
  {
    title: "Step outside and watch the sky for five quiet minutes.",
    category: "Outdoors",
    effort: "Easy",
    energy: ["low"],
    moods: ["outside", "relax"],
    times: ["short"],
  },
  {
    title: "Rearrange one small corner of your space.",
    category: "Relaxing",
    effort: "A Little Effort",
    energy: ["medium", "high"],
    moods: ["create", "relax"],
    times: ["medium"],
  },
  {
    title: "Learn one simple magic trick.",
    category: "Creative",
    effort: "A Little Effort",
    energy: ["medium"],
    moods: ["create", "explore"],
    times: ["medium", "long"],
  },
  {
    title: "Leave a positive review for a local place you enjoy.",
    category: "Local Adventure",
    effort: "Quick",
    energy: ["low"],
    moods: ["treat", "explore"],
    times: ["short"],
  },
  {
    title: "Make a three-song playlist for your current mood.",
    category: "Relaxing",
    effort: "Easy",
    energy: ["low", "medium"],
    moods: ["create", "relax", "treat"],
    times: ["short", "medium"],
  },
];

const quizExplanationPhrases = {
  energy: {
    low: "keep it low-energy",
    medium: "use a medium amount of energy",
    high: "go high-energy",
  },
  mood: {
    outside: "get outside",
    create: "make something",
    treat: "treat yourself",
    explore: "explore",
    relax: "relax",
    surprise: "be surprised",
  },
  time: {
    short: "keep it under 15 minutes",
    medium: "spend 15–30 minutes",
    long: "take your time",
  },
};

export function getRandomQuestIndex(previousIndex = -1) {
  if (quests.length === 1) {
    return 0;
  }

  let nextIndex;

  do {
    nextIndex = Math.floor(Math.random() * quests.length);
  } while (nextIndex === previousIndex);

  return nextIndex;
}

export function getMatchedQuestIndex({ energy, mood, time }, excludedIndex = -1) {
  const scoredQuests = quests
    .map((quest, index) => {
      let score = 0;
      score += quest.energy.includes(energy) ? 3 : 0;
      score += mood === "surprise" ? 0 : quest.moods.includes(mood) ? 4 : 0;
      score += quest.times.includes(time) ? 3 : 0;
      return { index, score };
    })
    .filter(({ index }) => quests.length === 1 || index !== excludedIndex);
  const highestScore = Math.max(...scoredQuests.map(({ score }) => score));
  const bestMatches = scoredQuests.filter(({ score }) => score === highestScore);

  return bestMatches[Math.floor(Math.random() * bestMatches.length)].index;
}

export function getQuizExplanation({ energy, mood, time }) {
  return `You wanted to ${quizExplanationPhrases.mood[mood]}, ${quizExplanationPhrases.energy[energy]}, and ${quizExplanationPhrases.time[time]}.`;
}

export function toStoredQuest(quest) {
  return {
    title: quest.title,
    category: quest.category,
    effort: quest.effort,
  };
}
