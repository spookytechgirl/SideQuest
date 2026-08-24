"use client";

import { useRef, useState } from "react";
import QuestCard from "./quest-card";
import { recordRecentQuest } from "@/lib/quest-storage";
import {
  getMatchedQuestIndex,
  getQuizExplanation,
  quests,
} from "@/lib/quests";

const energyOptions = [
  ["low", "Low"],
  ["medium", "Medium"],
  ["high", "High"],
];

const moodOptions = [
  ["outside", "Get Outside"],
  ["create", "Make Something"],
  ["treat", "Treat Myself"],
  ["explore", "Explore"],
  ["relax", "Relax"],
  ["surprise", "Surprise Me"],
];

const timeOptions = [
  ["short", "Under 15 Minutes"],
  ["medium", "15–30 Minutes"],
  ["long", "I've Got Time"],
];

function QuizOptions({ name, options, className = "" }) {
  return (
    <div className={`quiz-options ${className}`.trim()}>
      {options.map(([value, label], index) => (
        <label key={value}>
          <input
            type="radio"
            name={name}
            value={value}
            required={index === 0}
          />
          <span>{label}</span>
        </label>
      ))}
    </div>
  );
}

export default function QuizExperience() {
  const [currentQuest, setCurrentQuest] = useState(null);
  const [currentAnswers, setCurrentAnswers] = useState(null);
  const previousQuestIndex = useRef(-1);
  const resultCard = useRef(null);

  const showMatchedQuest = (answers) => {
    const nextIndex = getMatchedQuestIndex(answers, previousQuestIndex.current);
    const nextQuest = quests[nextIndex];

    previousQuestIndex.current = nextIndex;
    setCurrentQuest(nextQuest);
    recordRecentQuest(nextQuest);

    window.requestAnimationFrame(() => {
      resultCard.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!event.currentTarget.reportValidity()) {
      return;
    }

    const answers = Object.fromEntries(new FormData(event.currentTarget));
    setCurrentAnswers(answers);
    showMatchedQuest(answers);
  };

  const handleTryAnother = () => {
    if (currentAnswers) {
      showMatchedQuest(currentAnswers);
    }
  };

  return (
    <>
      <form className="sidequest-quiz" onSubmit={handleSubmit}>
        <fieldset>
          <legend>
            <span>1</span> Energy level
          </legend>
          <QuizOptions
            name="energy"
            options={energyOptions}
            className="quiz-options-three"
          />
        </fieldset>

        <fieldset>
          <legend>
            <span>2</span> What sounds good right now?
          </legend>
          <QuizOptions name="mood" options={moodOptions} />
        </fieldset>

        <fieldset>
          <legend>
            <span>3</span> How much time do you have?
          </legend>
          <QuizOptions
            name="time"
            options={timeOptions}
            className="quiz-options-three"
          />
        </fieldset>

        <button className="quiz-submit" type="submit">
          Find My SideQuest <span aria-hidden="true">→</span>
        </button>
      </form>

      {currentQuest ? (
        <QuestCard
          key={currentQuest.title}
          quest={currentQuest}
          explanation={getQuizExplanation(currentAnswers)}
          showTryAnother
          onTryAnother={handleTryAnother}
          cardRef={resultCard}
        />
      ) : null}
    </>
  );
}
