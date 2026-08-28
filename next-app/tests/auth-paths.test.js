import { describe, expect, it } from "vitest";
import { getLoginPath, getSafeReturnPath } from "@/lib/auth-paths";

describe("safe authentication return paths", () => {
  it("accepts an internal path with a query and fragment", () => {
    expect(getSafeReturnPath("/saved-quests?view=all#results", "/login")).toBe(
      "/saved-quests?view=all#results",
    );
  });

  it.each([
    "https://evil.example/account",
    "//evil.example/account",
    "javascript:alert(1)",
    "/\\evil.example/account",
  ])("rejects unsafe destination %s", (destination) => {
    expect(getSafeReturnPath(destination, "/login")).toBe("/login");
  });

  it("rejects non-string destinations", () => {
    expect(getSafeReturnPath({ path: "/profile" }, "/login")).toBe("/login");
  });

  it("encodes the validated destination in the login URL", () => {
    expect(getLoginPath("/profile?tab=avatar")).toBe(
      "/login?next=%2Fprofile%3Ftab%3Davatar",
    );
  });
});
