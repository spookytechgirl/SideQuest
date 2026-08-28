import { describe, expect, it } from "vitest";
import {
  MAX_FEEDBACK_MESSAGE_LENGTH,
  normalizeFeedbackPagePath,
  validateFeedback,
} from "@/lib/feedback-validation";

describe("feedback validation", () => {
  it("normalizes a valid feedback submission", () => {
    expect(
      validateFeedback({
        feedbackType: "idea",
        rating: 5,
        message: "  Add more rainy-day quests.  ",
        pagePath: "/ideas",
      }),
    ).toEqual({
      value: {
        feedback_type: "idea",
        rating: 5,
        message: "Add more rainy-day quests.",
        page_path: "/ideas",
      },
    });
  });

  it("rejects unsupported fields such as a forged user ID", () => {
    expect(
      validateFeedback({
        feedbackType: "idea",
        message: "Hello",
        user_id: "forged",
      }),
    ).toHaveProperty("error");
  });

  it.each([0, 6, 2.5, "5"])("rejects invalid rating %s", (rating) => {
    expect(
      validateFeedback({ feedbackType: "idea", rating, message: "Hello" }),
    ).toHaveProperty("error");
  });

  it("rejects invalid type, whitespace, and excessive content", () => {
    expect(
      validateFeedback({ feedbackType: "unknown", message: "Hello" }),
    ).toHaveProperty("error");
    expect(
      validateFeedback({ feedbackType: "idea", message: "   " }),
    ).toHaveProperty("error");
    expect(
      validateFeedback({
        feedbackType: "idea",
        message: "x".repeat(MAX_FEEDBACK_MESSAGE_LENGTH + 1),
      }),
    ).toHaveProperty("error");
  });

  it.each([
    "https://evil.example",
    "//evil.example",
    "/path?query=1",
    "/path#fragment",
    "/path with spaces",
    "/\\evil.example",
  ])("rejects unsafe page path %s", (path) => {
    expect(normalizeFeedbackPagePath(path)).toHaveProperty("error");
  });

  it("allows a missing optional page path", () => {
    expect(normalizeFeedbackPagePath(undefined)).toEqual({ value: null });
  });
});
