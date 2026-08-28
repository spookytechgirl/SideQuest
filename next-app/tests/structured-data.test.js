import { describe, expect, it } from "vitest";
import {
  appendFaqStructuredData,
  createPageStructuredData,
  createWebsiteStructuredData,
  toAbsoluteUrl,
} from "@/lib/structured-data";

describe("structured data helpers", () => {
  it("creates production absolute URLs", () => {
    expect(toAbsoluteUrl("/")).toBe("https://sidequest-next-preview.vercel.app");
    expect(toAbsoluteUrl("/quiz")).toBe(
      "https://sidequest-next-preview.vercel.app/quiz",
    );
  });

  it("creates website and breadcrumb schema", () => {
    const website = createWebsiteStructuredData();
    const page = createPageStructuredData({
      path: "/quiz",
      title: "Find My Quest",
      description: "Match a small adventure to the moment.",
      breadcrumbs: [
        { name: "Home", path: "/" },
        { name: "Quiz", path: "/quiz" },
      ],
    });

    expect(website["@type"]).toBe("WebSite");
    expect(page["@graph"][1]["@type"]).toBe("BreadcrumbList");
    expect(page["@graph"][1].itemListElement).toHaveLength(2);
  });

  it("appends FAQ data without removing page data", () => {
    const page = createPageStructuredData({
      path: "/about",
      title: "About",
      description: "About SideQuest.",
    });
    const result = appendFaqStructuredData(page, [
      { question: "What is SideQuest?", answer: "A small-adventure generator." },
    ]);

    expect(result["@graph"][0]["@type"]).toBe("WebPage");
    expect(result["@graph"][1]["@type"]).toBe("FAQPage");
  });
});
