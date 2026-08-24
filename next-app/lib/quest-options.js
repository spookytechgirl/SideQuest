export const QUEST_CATEGORIES = [
  "Outdoors",
  "Creative",
  "Food",
  "Local Adventure",
  "Relaxing",
  "Random",
];

export const QUEST_EFFORTS = [
  "Quick",
  "Easy",
  "A Little Effort",
  "Adventure",
];

export const MAX_QUEST_LENGTH = 240;

export function validateQuestValues({ quest_text, category, effort }) {
  if (!quest_text?.trim() || !category || !effort) {
    return "Complete all quest fields before saving.";
  }

  if (quest_text.trim().length > MAX_QUEST_LENGTH) {
    return `Keep the quest idea to ${MAX_QUEST_LENGTH} characters or fewer.`;
  }

  if (!QUEST_CATEGORIES.includes(category)) {
    return "Choose a valid SideQuest category.";
  }

  if (!QUEST_EFFORTS.includes(effort)) {
    return "Choose a valid SideQuest effort level.";
  }

  return "";
}
