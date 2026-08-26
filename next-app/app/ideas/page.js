import Link from "next/link";
import BrandLink from "@/components/brand-link";
import PageShell from "@/components/page-shell";
import PublicPageJsonLd from "@/components/public-page-json-ld";
import { ideaCollections } from "@/lib/content-paths";
import { createPublicMetadata } from "@/lib/social-metadata";

export const metadata = createPublicMetadata({
  title: "SideQuest Ideas",
  description:
    "Browse SideQuest ideas by mood, energy, setting, and available time, then generate or match a small adventure that fits your day.",
  path: "/ideas",
});

export default function IdeasPage() {
  return (
    <PageShell pageClassName="info-page ideas-page">
      <PublicPageJsonLd
        type="CollectionPage"
        path="/ideas"
        title="SideQuest Ideas | SideQuest"
        description="Browse SideQuest ideas by mood, energy, setting, and available time, then generate or match a small adventure that fits your day."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "SideQuest Ideas", path: "/ideas" },
        ]}
      />
      <BrandLink />

      <p className="eyebrow">A trail map for small adventures</p>
      <h1 id="page-title" className="info-page-title ideas-page-title">
        SideQuest
        <br />
        <span>Ideas.</span>
      </h1>
      <p className="intro info-page-intro ideas-page-intro">
        Start with the kind of moment you are in. Browse a collection for a few
        concrete ideas, then let SideQuest help you choose what to do next.
      </p>

      <section className="ideas-section" aria-labelledby="idea-collections-title">
        <div className="ideas-section-heading scroll-reveal">
          <p className="info-kicker">Discover by moment</p>
          <h2 id="idea-collections-title">Find the path that fits today.</h2>
          <p>
            Each collection offers practical starting points—not a list of things
            you have to finish.
          </p>
        </div>

        <div className="ideas-collection-grid">
          {ideaCollections.map((collection, index) => (
            <article
              className="ideas-collection-card scroll-reveal"
              style={{ "--reveal-delay": `${Math.min(index * 55, 220)}ms` }}
              key={collection.href}
            >
              <div className="ideas-card-heading">
                <span aria-hidden="true">{collection.symbol}</span>
                <p>{collection.kicker}</p>
              </div>
              <h3>{collection.title}</h3>
              <p>{collection.description}</p>
              <Link className="ideas-card-link" href={collection.href}>
                Explore this collection <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section
        className="ideas-explore-card scroll-reveal"
        aria-labelledby="ideas-catalog-title"
      >
        <div>
          <p className="info-kicker">Browse the live catalog</p>
          <h2 id="ideas-catalog-title">Open a quest and make it your own.</h2>
          <p>
            The Quest Directory turns the current database catalog into useful,
            shareable guides with category, effort, and practical adaptation ideas.
          </p>
        </div>
        <Link className="admin-secondary-button" href="/quests">
          Browse Quest Directory
        </Link>
      </section>

      <section className="ideas-section" aria-labelledby="idea-comparisons-title">
        <div className="ideas-section-heading scroll-reveal">
          <p className="info-kicker">Compare two paths</p>
          <h2 id="idea-comparisons-title">Choose by setting or by the kind of reset you need.</h2>
          <p>Use a side-by-side guide when two kinds of small adventure both sound possible.</p>
        </div>
        <div className="ideas-collection-grid ideas-comparison-grid">
          <article className="ideas-collection-card scroll-reveal">
            <div className="ideas-card-heading">
              <span aria-hidden="true">⌂</span>
              <p>Setting</p>
            </div>
            <h3>Indoor vs. Outdoor SideQuests</h3>
            <p>Compare setup, energy, flexibility, and real catalog examples.</p>
            <Link className="ideas-card-link" href="/compare/indoor-vs-outdoor-side-quests">
              Compare settings <span aria-hidden="true">→</span>
            </Link>
          </article>
          <article className="ideas-collection-card scroll-reveal">
            <div className="ideas-card-heading">
              <span aria-hidden="true">✎</span>
              <p>Focus</p>
            </div>
            <h3>Creative vs. Relaxing SideQuests</h3>
            <p>Compare playful focus with a gentler, quieter kind of reset.</p>
            <Link className="ideas-card-link" href="/compare/creative-vs-relaxing-side-quests">
              Compare quest styles <span aria-hidden="true">→</span>
            </Link>
          </article>
        </div>
      </section>

      <section
        className="ideas-explore-card scroll-reveal"
        aria-labelledby="ideas-explore-title"
      >
        <div>
          <p className="info-kicker">Borrow a spark</p>
          <h2 id="ideas-explore-title">See where curiosity takes you.</h2>
          <p>
            Watch one short try-something-new talk, then browse a public city map
            for a place that could become your next small story.
          </p>
        </div>
        <Link className="admin-secondary-button" href="/explore">
          Explore SideQuest inspiration
        </Link>
      </section>

      <section
        className="ideas-next-step scroll-reveal"
        aria-labelledby="ideas-next-step-title"
      >
        <div>
          <p className="info-kicker">Turn an idea into action</p>
          <h2 id="ideas-next-step-title">Ready for one doable next step?</h2>
          <p>
            Let chance choose, match a quest to your mood, or talk it through with
            the SideQuest Guide.
          </p>
        </div>
        <div className="ideas-actions">
          <Link className="quest-button" href="/">
            <span>Generate a SideQuest</span>
            <span className="button-arrow" aria-hidden="true">→</span>
          </Link>
          <Link className="admin-secondary-button" href="/quiz">
            Find My Quest
          </Link>
          <Link className="admin-secondary-button" href="/chat">
            Ask the SideQuest Guide
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
