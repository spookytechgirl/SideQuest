const quests = [
  "Take a 15-minute walk without your phone.",
  "Try a snack or drink you have never had before.",
  "Write and send a kind note to someone you appreciate.",
  "Visit a nearby park and find the best view.",
  "Learn how to say hello in three new languages.",
  "Sketch something in the room using your non-dominant hand.",
  "Put on one song and dance until it ends.",
  "Take five photos of things that share the same color.",
  "Read ten pages of a book you have been meaning to start.",
  "Make a tiny meal using only ingredients you already have.",
  "Step outside and watch the sky for five quiet minutes.",
  "Rearrange one small corner of your space.",
  "Learn one simple magic trick.",
  "Leave a positive review for a local place you enjoy.",
  "Make a three-song playlist for your current mood."
];

const generateButton = document.querySelector("#generate-quest");
const questCard = document.querySelector("#quest-card");
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
  previousQuestIndex = nextQuestIndex;
  questIdea.textContent = quests[nextQuestIndex];

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
