import { SITE_URL } from "@/lib/social-metadata";

const publicRoutes = [
  { path: "/", priority: 1 },
  { path: "/quiz", priority: 0.9 },
  { path: "/chat", priority: 0.8 },
  { path: "/about", priority: 0.7 },
  { path: "/categories", priority: 0.7 },
  { path: "/how-it-works", priority: 0.7 },
  { path: "/privacy", priority: 0.4 },
];

export default function sitemap() {
  return publicRoutes.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date("2026-08-25"),
    changeFrequency:
      path === "/" || path === "/quiz" || path === "/chat"
        ? "weekly"
        : "monthly",
    priority,
  }));
}
