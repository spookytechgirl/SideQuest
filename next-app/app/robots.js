import { SITE_URL } from "@/lib/social-metadata";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/profile",
        "/my-quests",
        "/saved-quests",
        "/adventure-log",
        "/login",
        "/auth/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
