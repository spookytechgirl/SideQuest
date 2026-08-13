const quests = [
  { title: "Take a 15-minute walk without your phone.", category: "Outdoors", effort: "Easy", energy: ["low", "medium"], moods: ["outside", "relax"], times: ["medium"] },
  { title: "Try a snack or drink you have never had before.", category: "Food", effort: "Quick", energy: ["low", "medium"], moods: ["treat", "explore"], times: ["short"] },
  { title: "Write and send a kind note to someone you appreciate.", category: "Random", effort: "Quick", energy: ["low", "medium"], moods: ["relax"], times: ["short"] },
  { title: "Visit a nearby park and find the best view.", category: "Local Adventure", effort: "Adventure", energy: ["medium", "high"], moods: ["outside", "explore"], times: ["long"] },
  { title: "Learn how to say hello in three new languages.", category: "Random", effort: "Quick", energy: ["low", "medium"], moods: ["explore", "create"], times: ["short"] },
  { title: "Sketch something in the room using your non-dominant hand.", category: "Creative", effort: "A Little Effort", energy: ["low", "medium"], moods: ["create", "relax"], times: ["short", "medium"] },
  { title: "Put on one song and dance until it ends.", category: "Random", effort: "Quick", energy: ["medium", "high"], moods: ["treat"], times: ["short"] },
  { title: "Take five photos of things that share the same color.", category: "Creative", effort: "A Little Effort", energy: ["medium", "high"], moods: ["create", "explore", "outside"], times: ["medium"] },
  { title: "Read ten pages of a book you have been meaning to start.", category: "Relaxing", effort: "Easy", energy: ["low"], moods: ["relax", "treat"], times: ["medium", "long"] },
  { title: "Make a tiny meal using only ingredients you already have.", category: "Food", effort: "A Little Effort", energy: ["medium", "high"], moods: ["create", "treat"], times: ["medium", "long"] },
  { title: "Step outside and watch the sky for five quiet minutes.", category: "Outdoors", effort: "Easy", energy: ["low"], moods: ["outside", "relax"], times: ["short"] },
  { title: "Rearrange one small corner of your space.", category: "Relaxing", effort: "A Little Effort", energy: ["medium", "high"], moods: ["create", "relax"], times: ["medium"] },
  { title: "Learn one simple magic trick.", category: "Creative", effort: "A Little Effort", energy: ["medium"], moods: ["create", "explore"], times: ["medium", "long"] },
  { title: "Leave a positive review for a local place you enjoy.", category: "Local Adventure", effort: "Quick", energy: ["low"], moods: ["treat", "explore"], times: ["short"] },
  { title: "Make a three-song playlist for your current mood.", category: "Relaxing", effort: "Easy", energy: ["low", "medium"], moods: ["create", "relax", "treat"], times: ["short", "medium"] }
];

const SAVED_QUESTS_KEY = "sidequest-saved-quests";
const RECENT_QUESTS_KEY = "sidequest-recent-quests";
const QUIZ_EXPLANATION_PHRASES = {
  energy: {
    low: "keep it low-energy",
    medium: "use a medium amount of energy",
    high: "go high-energy"
  },
  mood: {
    outside: "get outside",
    create: "make something",
    treat: "treat yourself",
    explore: "explore",
    relax: "relax",
    surprise: "be surprised"
  },
  time: {
    short: "keep it under 15 minutes",
    medium: "spend 15–30 minutes",
    long: "take your time"
  }
};

const generateButton = document.querySelector("#generate-quest");
const questCard = document.querySelector("#quest-card");
const questCategory = document.querySelector("#quest-category");
const questEffort = document.querySelector("#quest-effort");
const questIdea = document.querySelector("#quest-idea");
const questExplanation = document.querySelector("#quest-explanation");
const questExplanationText = document.querySelector("#quest-explanation-text");
const tryAnotherButton = document.querySelector("#try-another-quest");
const saveQuestButton = document.querySelector("#save-quest");
const saveQuestIcon = document.querySelector("#save-quest-icon");
const quiz = document.querySelector("#sidequest-quiz");
const recentQuestsSection = document.querySelector("#recent-quests");
const recentQuestsList = document.querySelector("#recent-quests-list");
const recentQuestsEmpty = document.querySelector("#recent-quests-empty");

let previousQuestIndex = -1;
let currentQuest = null;
let currentQuizAnswers = null;
let savedQuests = loadSavedQuests();
let recentQuests = loadRecentQuests();

function isValidSavedQuest(quest) {
  return quest
    && typeof quest.title === "string"
    && typeof quest.category === "string"
    && typeof quest.effort === "string";
}

function loadSavedQuests() {
  try {
    const storedQuests = JSON.parse(localStorage.getItem(SAVED_QUESTS_KEY) || "[]");
    return Array.isArray(storedQuests) ? storedQuests.filter(isValidSavedQuest) : [];
  } catch {
    return [];
  }
}

function loadRecentQuests() {
  try {
    const storedQuests = JSON.parse(localStorage.getItem(RECENT_QUESTS_KEY) || "[]");
    return Array.isArray(storedQuests) ? storedQuests.filter(isValidSavedQuest).slice(0, 5) : [];
  } catch {
    return [];
  }
}

function renderRecentQuests() {
  if (!recentQuestsSection || !recentQuestsList) {
    return;
  }

  recentQuestsList.replaceChildren();

  recentQuests.forEach((quest) => {
    const item = document.createElement("li");
    const meta = document.createElement("p");
    const title = document.createElement("p");

    meta.className = "recent-quest-meta";
    meta.textContent = `${quest.category} • ${quest.effort}`;
    title.className = "recent-quest-title";
    title.textContent = quest.title;
    item.append(meta, title);
    recentQuestsList.append(item);
  });

  recentQuestsList.hidden = recentQuests.length === 0;
  if (recentQuestsEmpty) {
    recentQuestsEmpty.hidden = recentQuests.length > 0;
  }
}

function addRecentQuest(quest) {
  recentQuests = [{
    title: quest.title,
    category: quest.category,
    effort: quest.effort
  }, ...recentQuests].slice(0, 5);

  try {
    localStorage.setItem(RECENT_QUESTS_KEY, JSON.stringify(recentQuests));
  } catch {
    // The current session can still show recent quests if storage is unavailable.
  }

  renderRecentQuests();
}

function isQuestSaved(quest) {
  return savedQuests.some((savedQuest) => (
    savedQuest.title === quest.title
    && savedQuest.category === quest.category
    && savedQuest.effort === quest.effort
  ));
}

function updateSaveButton() {
  if (!saveQuestButton) {
    return;
  }

  const isSaved = isQuestSaved(currentQuest);
  const action = isSaved ? "Unsave" : "Save";

  saveQuestButton.setAttribute("aria-pressed", String(isSaved));
  saveQuestButton.setAttribute("aria-label", `${action} quest: ${currentQuest.title}`);
  saveQuestButton.title = `${action} quest`;
  saveQuestIcon.textContent = isSaved ? "\u2665" : "\u2661";
}

function toggleSavedQuest() {
  if (!currentQuest) {
    return;
  }

  const updatedQuests = isQuestSaved(currentQuest)
    ? savedQuests.filter((savedQuest) => savedQuest.title !== currentQuest.title)
    : [...savedQuests, {
      title: currentQuest.title,
      category: currentQuest.category,
      effort: currentQuest.effort
    }];

  try {
    localStorage.setItem(SAVED_QUESTS_KEY, JSON.stringify(updatedQuests));
    savedQuests = updatedQuests;
    updateSaveButton();
  } catch {
    // Keep the current UI state if browser storage is unavailable.
  }
}

function getRandomQuestIndex() {
  if (quests.length === 1) {
    return 0;
  }

  let nextIndex;

  do {
    nextIndex = Math.floor(Math.random() * quests.length);
  } while (nextIndex === previousQuestIndex);

  return nextIndex;
}

function getMatchedQuestIndex({ energy, mood, time }, excludedIndex = -1) {
  const scoredQuests = quests.map((quest, index) => {
    let score = 0;
    score += quest.energy.includes(energy) ? 3 : 0;
    score += mood === "surprise" ? 0 : (quest.moods.includes(mood) ? 4 : 0);
    score += quest.times.includes(time) ? 3 : 0;
    return { index, score };
  }).filter(({ index }) => quests.length === 1 || index !== excludedIndex);
  const highestScore = Math.max(...scoredQuests.map(({ score }) => score));
  const bestMatches = scoredQuests.filter(({ score }) => score === highestScore);

  return bestMatches[Math.floor(Math.random() * bestMatches.length)].index;
}

function getQuizExplanation({ energy, mood, time }) {
  return `You wanted to ${QUIZ_EXPLANATION_PHRASES.mood[mood]}, ${QUIZ_EXPLANATION_PHRASES.energy[energy]}, and ${QUIZ_EXPLANATION_PHRASES.time[time]}.`;
}

function showQuest(nextQuestIndex, explanation = "", isQuizQuest = false) {
  const nextQuest = quests[nextQuestIndex];
  previousQuestIndex = nextQuestIndex;
  currentQuest = nextQuest;
  questCategory.textContent = nextQuest.category;
  questEffort.textContent = nextQuest.effort;
  questIdea.textContent = nextQuest.title;
  if (questExplanation && questExplanationText) {
    questExplanationText.textContent = explanation;
    questExplanation.hidden = !explanation;
  }
  if (tryAnotherButton) {
    tryAnotherButton.hidden = !isQuizQuest;
  }
  updateSaveButton();
  addRecentQuest(nextQuest);

  if (questCard.hidden) {
    questCard.hidden = false;
  } else {
    questCard.style.animation = "none";
    requestAnimationFrame(() => {
      questCard.style.animation = "";
    });
  }

  if (generateButton) {
    generateButton.querySelector("span:first-child").textContent = "Generate Another";
  }
}

function generateQuest() {
  currentQuizAnswers = null;
  showQuest(getRandomQuestIndex());
}

function generateMatchedQuest(event) {
  event.preventDefault();

  if (!quiz.reportValidity()) {
    return;
  }

  currentQuizAnswers = Object.fromEntries(new FormData(quiz));
  showQuest(
    getMatchedQuestIndex(currentQuizAnswers, previousQuestIndex),
    getQuizExplanation(currentQuizAnswers),
    true
  );
  questCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function generateAnotherMatchedQuest() {
  if (!currentQuizAnswers) {
    return;
  }

  showQuest(
    getMatchedQuestIndex(currentQuizAnswers, previousQuestIndex),
    getQuizExplanation(currentQuizAnswers),
    true
  );
}

generateButton?.addEventListener("click", generateQuest);
quiz?.addEventListener("submit", generateMatchedQuest);
tryAnotherButton?.addEventListener("click", generateAnotherMatchedQuest);
saveQuestButton?.addEventListener("click", toggleSavedQuest);
renderRecentQuests();
