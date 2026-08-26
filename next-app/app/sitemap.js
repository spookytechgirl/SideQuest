import { SITE_URL } from "@/lib/social-metadata";
import { getPublicQuests, getQuestPath } from "@/lib/public-quests";

const publicRoutes = [
  { path: "/", priority: 1 },
  { path: "/quiz", priority: 0.9 },
  { path: "/chat", priority: 0.8 },
  { path: "/pricing", priority: 0.8 },
  { path: "/ideas", priority: 0.9 },
  { path: "/quests", priority: 0.9 },
  { path: "/explore", priority: 0.8 },
  { path: "/compare/indoor-vs-outdoor-side-quests", priority: 0.7 },
  { path: "/compare/creative-vs-relaxing-side-quests", priority: 0.7 },
  { path: "/side-quests-for-boredom", priority: 0.8 },
  { path: "/creative-side-quests", priority: 0.8 },
  { path: "/low-energy-side-quests", priority: 0.8 },
  { path: "/indoor-side-quests", priority: 0.8 },
  { path: "/weekend-side-quests", priority: 0.8 },
  { path: "/about", priority: 0.7 },
  { path: "/categories", priority: 0.7 },
  { path: "/how-it-works", priority: 0.7 },
  { path: "/terms", priority: 0.4 },
  { path: "/privacy", priority: 0.4 },
];

export const revalidate = 3600;

export default async function sitemap() {
  const staticEntries = publicRoutes.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date("2026-08-26"),
    changeFrequency:
      path === "/" || path === "/quiz" || path === "/chat"
        ? "weekly"
        : "monthly",
    priority,
  }));

  let questEntries = [];

  try {
    const quests = await getPublicQuests();
    questEntries = quests.map((quest) => ({
      url: `${SITE_URL}${getQuestPath(quest)}`,
      lastModified: quest.created_at
        ? new Date(quest.created_at)
        : new Date("2026-08-26"),
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch {
    // Keep the static sitemap available if Supabase is temporarily unreachable.
  }

  return Array.from(
    new Map(
      [...staticEntries, ...questEntries].map((entry) => [entry.url, entry]),
    ).values(),
  );
}
