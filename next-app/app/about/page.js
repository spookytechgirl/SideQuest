import BrandLink from "@/components/brand-link";
import PageShell from "@/components/page-shell";
import { openGraphImage, twitterImage } from "@/lib/social-metadata";

export const metadata = {
  title: "About SideQuest",
  description:
    "Learn why SideQuest turns ordinary days into small, low-pressure adventures.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About SideQuest | SideQuest",
    description:
      "Learn why SideQuest turns ordinary days into small, low-pressure adventures.",
    url: "/about",
    images: [openGraphImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "About SideQuest | SideQuest",
    description:
      "Learn why SideQuest turns ordinary days into small, low-pressure adventures.",
    images: [twitterImage],
  },
};

export default function AboutPage() {
  return (
    <PageShell pageClassName="info-page about-page">
      <BrandLink />

      <p className="eyebrow">The story behind the spark</p>
      <h1 id="page-title" className="info-page-title">
        About
        <br />
        <span>SideQuest.</span>
      </h1>
      <p className="intro info-page-intro">
        A small nudge toward something different, delightful, or unexpectedly fun.
      </p>

      <section className="info-surface about-story" aria-labelledby="about-story-title">
        <p className="info-kicker">Why it exists</p>
        <h2 id="about-story-title">Make an ordinary day feel less ordinary.</h2>
        <p>
          SideQuest is for the moments when your routine needs a tiny plot twist. It
          offers simple ideas for something fun, creative, relaxing, or
          spontaneous—without turning your day into a project.
        </p>
        <p>
          Every quest is intentionally low-pressure. Try one, skip one, save one for
          later. The point is not to accomplish more; it is to notice how one small
          experience can make the day a little more interesting.
        </p>

        <div className="about-values">
          <article>
            <span aria-hidden="true">01</span>
            <h3>Small by design</h3>
            <p>Easy ideas that fit into real days.</p>
          </article>
          <article>
            <span aria-hidden="true">02</span>
            <h3>Plenty of variety</h3>
            <p>Make, wander, taste, rest, or be surprised.</p>
          </article>
          <article>
            <span aria-hidden="true">03</span>
            <h3>Zero pressure</h3>
            <p>A suggestion, never another obligation.</p>
          </article>
        </div>
      </section>

      <section className="info-surface suggestion-section" aria-labelledby="suggestion-title">
        <p className="info-kicker">Add to the adventure</p>
        <h2 id="suggestion-title">Suggest a SideQuest</h2>
        <p>
          Have a small adventure worth sharing? Send it our way—it might inspire
          someone&apos;s next delightful detour.
        </p>

        <form className="suggestion-form" aria-describedby="suggestion-phase-note">
          <div className="suggestion-form-grid">
            <div className="suggestion-field">
              <label htmlFor="suggestion-name">
                Name or nickname <span>(optional)</span>
              </label>
              <input
                id="suggestion-name"
                name="name"
                type="text"
                autoComplete="nickname"
                maxLength="60"
                disabled
              />
            </div>

            <div className="suggestion-field">
              <label htmlFor="suggestion-category">
                Category <span>(optional)</span>
              </label>
              <select id="suggestion-category" name="category" disabled defaultValue="">
                <option value="">Choose a category</option>
                <option value="Creative">Creative</option>
                <option value="Relaxing">Relaxing</option>
                <option value="Food">Food</option>
                <option value="Outdoors">Outdoors</option>
                <option value="Local Adventure">Local Adventure</option>
                <option value="Random">Random</option>
              </select>
            </div>
          </div>

          <div className="suggestion-field">
            <label htmlFor="suggestion-idea">
              SideQuest idea <span>(required)</span>
            </label>
            <textarea
              id="suggestion-idea"
              name="idea"
              rows="4"
              maxLength="240"
              required
              disabled
            />
          </div>

          <button className="quiz-submit suggestion-submit" type="submit" disabled>
            Submit SideQuest Idea <span aria-hidden="true">→</span>
          </button>
        </form>

        <p className="phase-note phase-note-left" id="suggestion-phase-note">
          Quest suggestions will be reconnected in a later migration phase.
        </p>
      </section>
    </PageShell>
  );
}
