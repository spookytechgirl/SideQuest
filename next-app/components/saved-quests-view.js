"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import useQuestCollection from "@/hooks/use-quest-collection";
import { SAVED_QUESTS_KEY, writeQuestCollection } from "@/lib/quest-storage";
import EmptyState from "./empty-state";
import SearchField from "./search-field";

function questsMatch(firstQuest, secondQuest) {
  return (
    firstQuest.title === secondQuest.title &&
    firstQuest.category === secondQuest.category &&
    firstQuest.effort === secondQuest.effort
  );
}

export default function SavedQuestsView() {
  const savedQuests = useQuestCollection(SAVED_QUESTS_KEY);
  const [searchQuery, setSearchQuery] = useState("");
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
  const matchingQuests = useMemo(() => {
    if (!normalizedQuery) {
      return savedQuests;
    }

    return savedQuests.filter((quest) =>
      [quest.title, quest.category, quest.effort].some((value) =>
        value.toLocaleLowerCase().includes(normalizedQuery),
      ),
    );
  }, [normalizedQuery, savedQuests]);
  const statusId = "saved-quests-search-status";
  const hasSavedQuests = savedQuests.length > 0;
  const hasMatches = matchingQuests.length > 0;

  const removeSavedQuest = (questToRemove) => {
    const updatedQuests = savedQuests.filter(
      (savedQuest) => !questsMatch(savedQuest, questToRemove),
    );
    writeQuestCollection(SAVED_QUESTS_KEY, updatedQuests);
  };

  return (
    <section className="saved-quests" aria-labelledby="saved-quests-title">
      <h2 className="visually-hidden" id="saved-quests-title">
        Saved SideQuests
      </h2>
      <SearchField
        value={searchQuery}
        onChange={setSearchQuery}
        statusId={statusId}
        hideStatus={!normalizedQuery || !hasSavedQuests}
        statusText={
          normalizedQuery && hasSavedQuests
            ? `Showing ${matchingQuests.length} of ${savedQuests.length} saved ${savedQuests.length === 1 ? "quest" : "quests"}.`
            : ""
        }
      />

      {!hasSavedQuests ? (
        <EmptyState className="saved-quests-empty">
          No saved quests yet. <Link href="/">Generate a SideQuest</Link>, then
          heart the ones you want to keep.
        </EmptyState>
      ) : null}

      {hasSavedQuests && normalizedQuery && !hasMatches ? (
        <EmptyState className="saved-quests-no-results">
          No saved quests match your search.
        </EmptyState>
      ) : null}

      {hasMatches ? (
        <ul className="saved-quests-list">
          {matchingQuests.map((quest, index) => (
            <li key={`${quest.title}-${quest.category}-${quest.effort}-${index}`}>
              <div className="saved-quest-content">
                <p className="saved-quest-meta">
                  {quest.category} • {quest.effort}
                </p>
                <p className="saved-quest-title">{quest.title}</p>
              </div>
              <button
                className="saved-quest-remove"
                type="button"
                aria-label={`Unsave quest: ${quest.title}`}
                title="Unsave quest"
                onClick={() => removeSavedQuest(quest)}
              >
                <span aria-hidden="true">♥</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
