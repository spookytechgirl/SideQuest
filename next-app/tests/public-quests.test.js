import { describe, expect, it } from "vitest";
import {
  getQuestPath,
  getQuestRouteSegment,
  parseQuestRouteSegment,
  slugifyQuestText,
} from "@/lib/public-quests";

describe("database quest route helpers", () => {
  const quest = {
    id: 17,
    quest_text: "Sketch café signs & tiny details!",
  };

  it("creates readable ASCII slugs", () => {
    expect(slugifyQuestText(quest.quest_text)).toBe(
      "sketch-cafe-signs-tiny-details",
    );
  });

  it("creates stable ID-prefixed route paths", () => {
    expect(getQuestRouteSegment(quest)).toBe(
      "17-sketch-cafe-signs-tiny-details",
    );
    expect(getQuestPath(quest)).toBe(
      "/quests/17-sketch-cafe-signs-tiny-details",
    );
  });

  it("parses valid canonical and ID-only segments", () => {
    expect(parseQuestRouteSegment("17-sketch-cafe-signs")).toEqual({
      id: 17,
      slug: "sketch-cafe-signs",
    });
    expect(parseQuestRouteSegment("17")).toEqual({ id: 17, slug: "" });
  });

  it.each(["", "not-an-id", "0-zero", "-1-negative", "1-bad_slug"])(
    "rejects invalid route segment %s",
    (segment) => {
      expect(parseQuestRouteSegment(segment)).toBeNull();
    },
  );
});
