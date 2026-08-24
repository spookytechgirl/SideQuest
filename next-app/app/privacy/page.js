import Link from "next/link";
import BrandLink from "@/components/brand-link";
import PageShell from "@/components/page-shell";
import { createPublicMetadata } from "@/lib/social-metadata";

export const metadata = createPublicMetadata({
  title: "Privacy",
  description:
    "Learn how SideQuest handles sign-in information and browser-saved quests.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <PageShell pageClassName="info-page privacy-page">
      <BrandLink />

      <p className="eyebrow">A simple privacy note</p>
      <h1 id="page-title" className="info-page-title">
        Your
        <br />
        <span>Privacy.</span>
      </h1>
      <p className="intro info-page-intro">
        A quick explanation of the information SideQuest may use and where your
        saved quests currently live.
      </p>

      <section className="info-surface" aria-labelledby="privacy-details-title">
        <p className="info-kicker">Privacy, kept simple</p>
        <h2 id="privacy-details-title">
          Small adventures should not come with big surprises.
        </h2>
        <p>
          <strong>Signing in.</strong> SideQuest may use Google OAuth and Supabase
          Auth for account sign-in. If you choose to sign in, the authentication
          provider may give SideQuest basic account information such as your name and
          email address so your session can be identified.
        </p>
        <p>
          <strong>Saved quests.</strong> Saved Quests currently use localStorage in
          your browser. They remain associated with that browser and device and may
          be removed if you clear your browser data.
        </p>
        <p>
          <strong>No selling.</strong> SideQuest does not sell your personal
          information.
        </p>
      </section>

      <p className="intro">
        <Link className="admin-home-link" href="/">
          <span aria-hidden="true">←</span> Back to SideQuest home
        </Link>
      </p>
    </PageShell>
  );
}
