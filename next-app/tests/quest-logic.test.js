import { describe, expect, it } from "vitest";
import {
  MAX_QUEST_LENGTH,
  QUEST_CATEGORIES,
  QUEST_EFFORTS,
  validateQuestValues,
} from "@/lib/quest-options";
import {
  getMatchedQuestIndex,
  getQuizExplanation,
  quests,
} from "@/lib/quests";

const energyValues = ["low", "medium", "high"];
const moodValues = ["outside", "create", "treat", "explore", "relax", "surprise"];
const timeValues = ["short", "medium", "long"];

describe("SideQuest dataset", () => {
  it("contains a meaningful catalog with unique quest text", () => {
    expect(quests.length).toBeGreaterThanOrEqual(10);
    expect(new Set(quests.map((quest) => quest.title)).size).toBe(quests.length);
  });

  it("uses valid categories, efforts, and quiz values", () => {
    for (const quest of quests) {
      expect(quest.title.trim().length).toBeGreaterThan(0);
      expect(quest.title.length).toBeLessThanOrEqual(MAX_QUEST_LENGTH);
      expect(QUEST_CATEGORIES).toContain(quest.category);
      expect(QUEST_EFFORTS).toContain(quest.effort);
      expect(quest.energy.every((value) => energyValues.includes(value))).toBe(true);
      expect(quest.moods.every((value) => moodValues.includes(value))).toBe(true);
      expect(quest.times.every((value) => timeValues.includes(value))).toBe(true);
    }
  });
});

describe("quiz matching", () => {
  it("returns a valid quest for every supported answer combination", () => {
    for (const energy of energyValues) {
      for (const mood of moodValues) {
        for (const time of timeValues) {
          const index = getMatchedQuestIndex({ energy, mood, time });
          expect(Number.isInteger(index)).toBe(true);
          expect(index).toBeGreaterThanOrEqual(0);
          expect(index).toBeLessThan(quests.length);
        }
      }
    }
  });

  it("does not immediately repeat an excluded quest", () => {
    const index = getMatchedQuestIndex(
      { energy: "low", mood: "relax", time: "short" },
      0,
    );

    expect(index).not.toBe(0);
  });

  it("creates an explanation without undefined values", () => {
    const explanation = getQuizExplanation({
      energy: "medium",
      mood: "create",
      time: "long",
    });

    expect(explanation).not.toContain("undefined");
    expect(explanation).toContain("make something");
  });
});

describe("database quest field validation", () => {
  it("accepts a valid quest", () => {
    expect(
      validateQuestValues({
        quest_text: "Sketch one object nearby.",
        category: "Creative",
        effort: "Easy",
      }),
    ).toBe("");
  });

  it("rejects missing fields, invalid enums, and excessive text", () => {
    expect(
      validateQuestValues({ quest_text: "   ", category: "Creative", effort: "Easy" }),
    ).not.toBe("");
    expect(
      validateQuestValues({ quest_text: "Try this", category: "Invalid", effort: "Easy" }),
    ).not.toBe("");
    expect(
      validateQuestValues({ quest_text: "Try this", category: "Creative", effort: "Invalid" }),
    ).not.toBe("");
    expect(
      validateQuestValues({
        quest_text: "x".repeat(MAX_QUEST_LENGTH + 1),
        category: "Creative",
        effort: "Easy",
      }),
    ).not.toBe("");
  });
});
