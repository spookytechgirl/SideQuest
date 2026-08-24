export const SAVED_QUESTS_KEY = "sidequest-saved-quests";
export const RECENT_QUESTS_KEY = "sidequest-recent-quests";

const storageEventName = "sidequest-storage-change";
const emptyCollection = "[]";

export function isValidStoredQuest(quest) {
  return (
    quest &&
    typeof quest.title === "string" &&
    typeof quest.category === "string" &&
    typeof quest.effort === "string"
  );
}

export function parseStoredQuests(serialized, maximum = Number.POSITIVE_INFINITY) {
  try {
    const parsed = JSON.parse(serialized || emptyCollection);
    return Array.isArray(parsed)
      ? parsed.filter(isValidStoredQuest).slice(0, maximum)
      : [];
  } catch {
    return [];
  }
}

export function readQuestCollectionSnapshot(key) {
  if (typeof window === "undefined") {
    return emptyCollection;
  }

  try {
    return window.localStorage.getItem(key) || emptyCollection;
  } catch {
    return emptyCollection;
  }
}

export function getServerQuestCollectionSnapshot() {
  return emptyCollection;
}

export function subscribeToQuestCollection(key, onStoreChange) {
  const handleStorage = (event) => {
    if (event.key === key) {
      onStoreChange();
    }
  };

  const handleLocalChange = (event) => {
    if (event.detail?.key === key) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(storageEventName, handleLocalChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(storageEventName, handleLocalChange);
  };
}

export function writeQuestCollection(key, questsToStore) {
  try {
    window.localStorage.setItem(key, JSON.stringify(questsToStore));
    window.dispatchEvent(
      new CustomEvent(storageEventName, {
        detail: { key },
      }),
    );
    return true;
  } catch {
    return false;
  }
}

export function recordRecentQuest(quest) {
  const recentQuests = parseStoredQuests(
    readQuestCollectionSnapshot(RECENT_QUESTS_KEY),
    5,
  );
  const storedQuest = {
    title: quest.title,
    category: quest.category,
    effort: quest.effort,
  };

  return writeQuestCollection(
    RECENT_QUESTS_KEY,
    [storedQuest, ...recentQuests].slice(0, 5),
  );
}
