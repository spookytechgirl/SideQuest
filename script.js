const quests = [
  { title: "Take a 15-minute walk without your phone.", category: "Outdoors" },
  { title: "Try a snack or drink you have never had before.", category: "Food" },
  { title: "Write and send a kind note to someone you appreciate.", category: "Random" },
  { title: "Visit a nearby park and find the best view.", category: "Local Adventure" },
  { title: "Learn how to say hello in three new languages.", category: "Random" },
  { title: "Sketch something in the room using your non-dominant hand.", category: "Creative" },
  { title: "Put on one song and dance until it ends.", category: "Random" },
  { title: "Take five photos of things that share the same color.", category: "Creative" },
  { title: "Read ten pages of a book you have been meaning to start.", category: "Relaxing" },
  { title: "Make a tiny meal using only ingredients you already have.", category: "Food" },
  { title: "Step outside and watch the sky for five quiet minutes.", category: "Outdoors" },
  { title: "Rearrange one small corner of your space.", category: "Relaxing" },
  { title: "Learn one simple magic trick.", category: "Creative" },
  { title: "Leave a positive review for a local place you enjoy.", category: "Local Adventure" },
  { title: "Make a three-song playlist for your current mood.", category: "Relaxing" }
];

const generateButton = document.querySelector("#generate-quest");
const questCard = document.querySelector("#quest-card");
const questCategory = document.querySelector("#quest-category");
const questIdea = document.querySelector("#quest-idea");

let previousQuestIndex = -1;

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
  questCategory.textContent = nextQuest.category;
  questIdea.textContent = nextQuest.title;

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
