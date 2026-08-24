import PageShell from "@/components/page-shell";
import QuestGenerator from "@/components/quest-generator";
import { openGraphImage, twitterImage } from "@/lib/social-metadata";

export const metadata = {
  title: { absolute: "SideQuest | Find Your Next Adventure" },
  description:
    "SideQuest generates quick, simple activities whenever you want to shake up your day.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "SideQuest | Find Your Next Adventure",
    description:
      "SideQuest generates quick, simple activities whenever you want to shake up your day.",
    url: "/",
    images: [openGraphImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "SideQuest | Find Your Next Adventure",
    description:
      "SideQuest generates quick, simple activities whenever you want to shake up your day.",
    images: [twitterImage],
  },
};

export default function Home() {
  return (
    <PageShell shellClassName="home-shell" pageClassName="home-hero">
      <div className="brand-mark" aria-hidden="true">
        <span>↗</span>
      </div>

      <p className="eyebrow">A little spark for your day</p>
      <h1 id="page-title">
        Side<span>Quest.</span>
      </h1>
      <p className="intro">
        Break the routine with one simple idea. Your next small adventure is
        only a click away.
      </p>

      <QuestGenerator />

      <p className="hint">No planning. No pressure. Just try something new.</p>
    </PageShell>
  );
}
