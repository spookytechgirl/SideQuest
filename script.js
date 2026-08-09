const quests = [
  { title: "Take a 15-minute walk without your phone.", category: "Outdoors", effort: "Easy" },
  { title: "Try a snack or drink you have never had before.", category: "Food", effort: "Quick" },
  { title: "Write and send a kind note to someone you appreciate.", category: "Random", effort: "Quick" },
  { title: "Visit a nearby park and find the best view.", category: "Local Adventure", effort: "Adventure" },
  { title: "Learn how to say hello in three new languages.", category: "Random", effort: "Quick" },
  { title: "Sketch something in the room using your non-dominant hand.", category: "Creative", effort: "A Little Effort" },
  { title: "Put on one song and dance until it ends.", category: "Random", effort: "Quick" },
  { title: "Take five photos of things that share the same color.", category: "Creative", effort: "A Little Effort" },
  { title: "Read ten pages of a book you have been meaning to start.", category: "Relaxing", effort: "Easy" },
  { title: "Make a tiny meal using only ingredients you already have.", category: "Food", effort: "A Little Effort" },
  { title: "Step outside and watch the sky for five quiet minutes.", category: "Outdoors", effort: "Easy" },
  { title: "Rearrange one small corner of your space.", category: "Relaxing", effort: "A Little Effort" },
  { title: "Learn one simple magic trick.", category: "Creative", effort: "A Little Effort" },
  { title: "Leave a positive review for a local place you enjoy.", category: "Local Adventure", effort: "Quick" },
  { title: "Make a three-song playlist for your current mood.", category: "Relaxing", effort: "Easy" }
];

const SAVED_QUESTS_KEY = "sidequest-saved-quests";

const generateButton = document.querySelector("#generate-quest");
const questCard = document.querySelector("#quest-card");
const questCategory = document.querySelector("#quest-category");
const questEffort = document.querySelector("#quest-effort");
const questIdea = document.querySelector("#quest-idea");
const saveQuestButton = document.querySelector("#save-quest");
const saveQuestIcon = document.querySelector("#save-quest-icon");

let previousQuestIndex = -1;
let currentQuest = null;
let savedQuests = loadSavedQuests();

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

function isQuestSaved(quest) {
  return savedQuests.some((savedQuest) => (
    savedQuest.title === quest.title
    && savedQuest.category === quest.category
    && savedQuest.effort === quest.effort
  ));
}

function updateSaveButton() {
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

function generateQuest() {
  const nextQuestIndex = getRandomQuestIndex();
  const nextQuest = quests[nextQuestIndex];
  previousQuestIndex = nextQuestIndex;
  currentQuest = nextQuest;
  questCategory.textContent = nextQuest.category;
  questEffort.textContent = nextQuest.effort;
  questIdea.textContent = nextQuest.title;
  updateSaveButton();

  if (questCard.hidden) {
    questCard.hidden = false;
  } else {
    questCard.style.animation = "none";
    requestAnimationFrame(() => {
      questCard.style.animation = "";
    });
  }

  generateButton.querySelector("span:first-child").textContent = "Generate Another";
}

generateButton.addEventListener("click", generateQuest);
saveQuestButton.addEventListener("click", toggleSavedQuest);
