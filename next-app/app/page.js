import Link from "next/link";
import PageShell from "@/components/page-shell";
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

      <button
        className="quest-button"
        type="button"
        disabled
        aria-describedby="home-phase-note"
      >
        <span>Generate a SideQuest</span>
        <span className="button-arrow" aria-hidden="true">
          →
        </span>
      </button>

      <div className="home-cta-links" aria-label="More ways to explore SideQuest">
        <Link className="quiz-page-link" href="/quiz">
          <span aria-hidden="true">✦</span>
          Find My Perfect Quest
          <span aria-hidden="true">→</span>
        </Link>
        <span className="quiz-page-link is-disabled" aria-disabled="true">
          <span aria-hidden="true">↗</span>
          Explore My Adventure Log
          <span aria-hidden="true">→</span>
        </span>
      </div>

      <p className="phase-note" id="home-phase-note">
        Quest generation and Adventure Log access arrive in a later migration phase.
      </p>
      <p className="hint">No planning. No pressure. Just try something new.</p>
    </PageShell>
  );
}
