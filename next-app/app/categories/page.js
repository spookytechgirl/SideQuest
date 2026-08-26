import Link from "next/link";
import BrandLink from "@/components/brand-link";
import PageShell from "@/components/page-shell";
import { createPublicMetadata } from "@/lib/social-metadata";

export const metadata = createPublicMetadata({
  title: "Quest Categories",
  description:
    "Explore the six categories of small adventures you can discover with SideQuest.",
  path: "/categories",
});

const categories = [
  {
    symbol: "✎",
    title: "Creative",
    description:
      "Make, draw, photograph, write, or look at something familiar in a brand-new way.",
  },
  {
    symbol: "~",
    title: "Relaxing",
    description:
      "Slow things down with a calm reset, a cozy ritual, or a few quiet minutes.",
  },
  {
    symbol: "◌",
    title: "Food",
    description:
      "Try a flavor, make a tiny treat, or turn an everyday snack into an occasion.",
  },
  {
    symbol: "↑",
    title: "Outdoors",
    description:
      "Step into fresh air, notice the sky, move around, and see what is outside your door.",
  },
  {
    symbol: "↗",
    title: "Local Adventure",
    description:
      "Explore nearby, support a favorite spot, or discover something hiding in plain sight.",
  },
  {
    symbol: "✦",
    title: "Random",
    description:
      "A delightfully mixed bag for when the best plan is letting SideQuest surprise you.",
  },
];

export default function CategoriesPage() {
  return (
    <PageShell pageClassName="info-page categories-page">
      <BrandLink />

      <p className="eyebrow">Pick a path—or don&apos;t</p>
      <h1 id="page-title" className="info-page-title">
        Quest
        <br />
        <span>Categories.</span>
      </h1>
      <p className="intro info-page-intro">
        A quick field guide to the kinds of little adventures that might find you.
      </p>

      <section className="category-grid" aria-label="SideQuest categories">
        {categories.map((category) => (
          <article className="category-card" key={category.title}>
            <span className="category-symbol" aria-hidden="true">
              {category.symbol}
            </span>
            <h2>{category.title}</h2>
            <p>{category.description}</p>
          </article>
        ))}
      </section>

      <section className="content-next-step scroll-reveal" aria-labelledby="categories-next-title">
        <div>
          <p className="info-kicker">Choose your next step</p>
          <h2 id="categories-next-title">Use a category—or let SideQuest surprise you.</h2>
          <p>
            Browse idea collections when you want a little direction, or go straight
            to the generator for one unexpected prompt.
          </p>
        </div>
        <div className="content-next-actions">
          <Link className="quest-button" href="/">
            <span>Generate a SideQuest</span>
            <span className="button-arrow" aria-hidden="true">→</span>
          </Link>
          <Link className="admin-secondary-button" href="/ideas">
            Browse SideQuest Ideas
          </Link>
          <Link className="admin-secondary-button" href="/quiz">
            Find My Quest
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
