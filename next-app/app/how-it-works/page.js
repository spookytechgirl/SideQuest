import Link from "next/link";
import BrandLink from "@/components/brand-link";
import PageShell from "@/components/page-shell";
import { createPublicMetadata } from "@/lib/social-metadata";

export const metadata = createPublicMetadata({
  title: "How It Works",
  description: "See how to generate, match, save, and revisit SideQuests.",
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  return (
    <PageShell pageClassName="info-page how-page">
      <BrandLink />

      <p className="eyebrow">Your quest, your pace</p>
      <h1 id="page-title" className="info-page-title">
        How It
        <br />
        <span>Works.</span>
      </h1>
      <p className="intro info-page-intro">
        Five simple ways to find, keep, and revisit your next small adventure.
      </p>

      <ol className="steps-list">
        <li>
          <span className="step-number" aria-hidden="true">01</span>
          <div>
            <h2>Generate a random quest</h2>
            <p>
              Start on <Link href="/">Home</Link> and let SideQuest hand you one
              simple idea.
            </p>
          </div>
        </li>
        <li>
          <span className="step-number" aria-hidden="true">02</span>
          <div>
            <h2>Match the moment</h2>
            <p>
              Use <Link href="/quiz">Find My Quest</Link> for an idea matched to
              your mood, energy, and available time.
            </p>
          </div>
        </li>
        <li>
          <span className="step-number" aria-hidden="true">03</span>
          <div>
            <h2>Heart the keepers</h2>
            <p>Save any quest you want to remember by tapping the heart on its card.</p>
          </div>
        </li>
        <li>
          <span className="step-number" aria-hidden="true">04</span>
          <div>
            <h2>Follow the trail</h2>
            <p>
              Visit the <Link href="/adventure-log">Adventure Log</Link> to see the
              quests that recently found you.
            </p>
          </div>
        </li>
        <li>
          <span className="step-number" aria-hidden="true">05</span>
          <div>
            <h2>Revisit your favorites</h2>
            <p>
              Return to <Link href="/saved-quests">Saved Quests</Link> whenever you
              are ready for an encore.
            </p>
          </div>
        </li>
      </ol>
    </PageShell>
  );
}
