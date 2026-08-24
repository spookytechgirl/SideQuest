"use client";

import useQuestCollection from "@/hooks/use-quest-collection";
import { SAVED_QUESTS_KEY, writeQuestCollection } from "@/lib/quest-storage";
import { toStoredQuest } from "@/lib/quests";
import QuestMetadata from "./quest-metadata";
import SaveQuestButton from "./save-quest-button";

function questsMatch(firstQuest, secondQuest) {
  return (
    firstQuest.title === secondQuest.title &&
    firstQuest.category === secondQuest.category &&
    firstQuest.effort === secondQuest.effort
  );
}

export default function QuestCard({
  quest,
  explanation = "",
  showTryAnother = false,
  onTryAnother,
  cardRef,
}) {
  const savedQuests = useQuestCollection(SAVED_QUESTS_KEY);
  const isSaved = savedQuests.some((savedQuest) => questsMatch(savedQuest, quest));

  const handleSaveToggle = () => {
    const updatedQuests = isSaved
      ? savedQuests.filter((savedQuest) => savedQuest.title !== quest.title)
      : [...savedQuests, toStoredQuest(quest)];

    writeQuestCollection(SAVED_QUESTS_KEY, updatedQuests);
  };

  return (
    <div
      className="quest-card"
      ref={cardRef}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="quest-meta">
        <QuestMetadata category={quest.category} effort={quest.effort} />
        <SaveQuestButton
          questTitle={quest.title}
          isSaved={isSaved}
          onToggle={handleSaveToggle}
        />
      </div>
      <p className="quest-idea">{quest.title}</p>
      {explanation ? (
        <p className="quest-explanation">
          <strong>Why this quest?</strong>
          <span>{explanation}</span>
        </p>
      ) : null}
      {showTryAnother ? (
        <button className="try-another-button" type="button" onClick={onTryAnother}>
          Not feeling it? Try another <span aria-hidden="true">↻</span>
        </button>
      ) : null}
    </div>
  );
}
