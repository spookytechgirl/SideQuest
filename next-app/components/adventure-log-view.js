"use client";

import Link from "next/link";
import useQuestCollection from "@/hooks/use-quest-collection";
import { RECENT_QUESTS_KEY } from "@/lib/quest-storage";
import EmptyState from "./empty-state";

export default function AdventureLogView() {
  const recentQuests = useQuestCollection(RECENT_QUESTS_KEY, 5);

  return (
    <section
      className="recent-quests adventure-log-list"
      aria-labelledby="recent-quests-title"
    >
      <h2 className="visually-hidden" id="recent-quests-title">
        Recent SideQuests
      </h2>
      {recentQuests.length === 0 ? (
        <EmptyState className="recent-quests-empty">
          No adventures logged yet. <Link href="/">Generate your first SideQuest</Link>
          {" "}to start the trail.
        </EmptyState>
      ) : (
        <ol className="recent-quests-list">
          {recentQuests.map((quest, index) => (
            <li key={`${quest.title}-${quest.category}-${quest.effort}-${index}`}>
              <p className="recent-quest-meta">
                {quest.category} • {quest.effort}
              </p>
              <p className="recent-quest-title">{quest.title}</p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
