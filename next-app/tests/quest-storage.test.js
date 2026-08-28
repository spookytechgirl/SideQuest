import { describe, expect, it } from "vitest";
import { parseStoredQuests } from "@/lib/quest-storage";

const validQuest = {
  title: "Take a short walk.",
  category: "Outdoors",
  effort: "Easy",
};

describe("browser quest storage parsing", () => {
  it("loads valid stored quests without changing their data shape", () => {
    expect(parseStoredQuests(JSON.stringify([validQuest]))).toEqual([validQuest]);
  });

  it("returns an empty collection for malformed or non-array JSON", () => {
    expect(parseStoredQuests("{")).toEqual([]);
    expect(parseStoredQuests('{"quest":"not-an-array"}')).toEqual([]);
  });

  it("filters entries with invalid field types", () => {
    const invalidQuest = { ...validQuest, title: 42 };

    expect(parseStoredQuests(JSON.stringify([invalidQuest, validQuest]))).toEqual([
      validQuest,
    ]);
  });

  it("honors the Adventure Log maximum", () => {
    const quests = Array.from({ length: 7 }, (_, index) => ({
      ...validQuest,
      title: `Quest ${index + 1}`,
    }));

    expect(parseStoredQuests(JSON.stringify(quests), 5)).toHaveLength(5);
  });
});
