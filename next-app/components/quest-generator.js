"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import QuestCard from "./quest-card";
import { recordRecentQuest } from "@/lib/quest-storage";
import { getRandomQuestIndex, quests } from "@/lib/quests";

export default function QuestGenerator() {
  const [currentQuest, setCurrentQuest] = useState(null);
  const previousQuestIndex = useRef(-1);

  const generateQuest = () => {
    const nextIndex = getRandomQuestIndex(previousQuestIndex.current);
    const nextQuest = quests[nextIndex];

    previousQuestIndex.current = nextIndex;
    setCurrentQuest(nextQuest);
    recordRecentQuest(nextQuest);
  };

  return (
    <>
      <button className="quest-button" type="button" onClick={generateQuest}>
        <span>{currentQuest ? "Generate Another" : "Generate a SideQuest"}</span>
        <span className="button-arrow" aria-hidden="true">
          →
        </span>
      </button>

      <div className="home-cta-links" aria-label="More ways to explore SideQuest">
        <Link className="quiz-page-link" href="/quiz">
          <span aria-hidden="true">✦</span>
          Find My Perfect Quest
          <span aria-hidden="true">→</span>
        </Link>
        <Link className="quiz-page-link" href="/adventure-log">
          <span aria-hidden="true">↗</span>
          Explore My Adventure Log
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      {currentQuest ? (
        <QuestCard key={currentQuest.title} quest={currentQuest} />
      ) : null}
    </>
  );
}
