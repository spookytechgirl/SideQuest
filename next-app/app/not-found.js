import Link from "next/link";
import BrandLink from "@/components/brand-link";
import PageShell from "@/components/page-shell";

export const metadata = {
  title: "Page Not Found",
  description:
    "This SideQuest page could not be found. Return home to discover your next small adventure.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <PageShell
      pageClassName="info-page error-page"
      footerNote="Every detour can lead somewhere interesting."
    >
      <BrandLink />

      <p className="eyebrow">Quest 404</p>
      <h1 id="page-title" className="info-page-title">
        Trail
        <br />
        <span>Not Found.</span>
      </h1>
      <p className="intro info-page-intro">
        This path wandered off the map, but your next small adventure is still
        close by.
      </p>

      <section className="info-surface" aria-labelledby="error-details-title">
        <p className="info-kicker">A harmless detour</p>
        <h2 id="error-details-title">The page you requested could not be found.</h2>
        <p>
          It may have moved, or the address may have taken a wrong turn. Head back
          to SideQuest and choose a fresh direction.
        </p>
        <Link className="quiz-submit error-home-link" href="/">
          Return to SideQuest <span aria-hidden="true">→</span>
        </Link>
      </section>
    </PageShell>
  );
}
