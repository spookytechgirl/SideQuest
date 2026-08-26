import Link from "next/link";
import BrandLink from "@/components/brand-link";
import PageShell from "@/components/page-shell";
import { exploreCollectionLinks } from "@/lib/content-paths";
import { createPublicMetadata } from "@/lib/social-metadata";

export const metadata = createPublicMetadata({
  title: "Explore SideQuest Inspiration",
  description:
    "Watch a quick try-something-new talk and explore a public Tampa map for ideas that can spark your next small adventure.",
  path: "/explore",
});

export default function ExplorePage() {
  return (
    <PageShell pageClassName="info-page explore-page">
      <BrandLink />

      <p className="eyebrow">Inspiration beyond the generator</p>
      <h1 id="page-title" className="info-page-title explore-page-title">
        Explore Your Next
        <br />
        <span>SideQuest.</span>
      </h1>
      <p className="intro info-page-intro explore-page-intro">
        Borrow a spark from a short video, then scan a public map for the park,
        museum, café, or curious corner that could become your next small story.
      </p>

      <aside className="explore-provider-note" aria-label="Third-party content note">
        <span aria-hidden="true">↗</span>
        <p>
          These embeds load content from YouTube and Google Maps. Their privacy
          policies and data practices apply when the embedded content loads.
        </p>
      </aside>

      <div className="explore-embed-grid">
        <section
          className="explore-embed-card scroll-reveal"
          aria-labelledby="video-inspiration-title"
        >
          <div className="explore-embed-copy">
            <p className="info-kicker">Video inspiration</p>
            <h2 id="video-inspiration-title">Try one small thing for 30 days.</h2>
            <p>
              Matt Cutts shares a short, practical reminder that trying something
              new can begin with a manageable experiment—not a dramatic life plan.
            </p>
          </div>
          <div className="explore-embed-frame explore-video-frame">
            <iframe
              src="https://www.youtube-nocookie.com/embed/UNP03fDSj1U"
              title="Try something new for 30 days by Matt Cutts"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="explore-embed-source">Video from TED-Ed on YouTube.</p>
        </section>

        <section
          className="explore-embed-card scroll-reveal"
          aria-labelledby="map-inspiration-title"
        >
          <div className="explore-embed-copy">
            <p className="info-kicker">Map inspiration</p>
            <h2 id="map-inspiration-title">Turn a public city map into a prompt.</h2>
            <p>
              Browse Tampa at a broad city level and look for one public place that
              makes you curious. SideQuest never requests or shares your location.
            </p>
          </div>
          <div className="explore-embed-frame explore-map-frame">
            <iframe
              src="https://www.google.com/maps?q=Tampa%2C%20Florida&output=embed"
              title="Public map of Tampa, Florida for SideQuest inspiration"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
          <p className="explore-embed-source">Public city-level map from Google Maps.</p>
        </section>
      </div>

      <section className="explore-collections" aria-labelledby="explore-collections-title">
        <div className="explore-collections-heading scroll-reveal">
          <p className="info-kicker">Follow the spark</p>
          <h2 id="explore-collections-title">Choose an idea collection next.</h2>
          <p>
            Use the inspiration above as a starting point, then browse a path that
            fits your setting or available time.
          </p>
        </div>
        <div className="explore-collection-grid">
          {exploreCollectionLinks.map((collection) => (
            <article className="explore-collection-card scroll-reveal" key={collection.href}>
              <span aria-hidden="true">{collection.symbol}</span>
              <h3>{collection.title}</h3>
              <p>{collection.description}</p>
              <Link className="ideas-card-link" href={collection.href}>
                Explore {collection.title} <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
        <Link className="explore-ideas-link" href="/ideas">
          Browse all SideQuest Ideas <span aria-hidden="true">→</span>
        </Link>
      </section>

      <section className="explore-next-step scroll-reveal" aria-labelledby="explore-next-title">
        <div>
          <p className="info-kicker">Bring the spark back</p>
          <h2 id="explore-next-title">Ready to turn inspiration into action?</h2>
          <p>
            Let the generator choose a quest, or use the quick quiz to match one to
            your energy and available time.
          </p>
        </div>
        <div className="explore-actions">
          <Link className="quest-button" href="/">
            <span>Generate a SideQuest</span>
            <span className="button-arrow" aria-hidden="true">→</span>
          </Link>
          <Link className="admin-secondary-button" href="/quiz">
            Find My Quest
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
