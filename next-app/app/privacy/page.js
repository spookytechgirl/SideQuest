import Link from "next/link";
import BrandLink from "@/components/brand-link";
import PageShell from "@/components/page-shell";
import PublicPageJsonLd from "@/components/public-page-json-ld";
import { createPublicMetadata } from "@/lib/social-metadata";

export const metadata = createPublicMetadata({
  title: "Privacy Policy",
  description:
    "Learn how SideQuest handles account data, quests, AI requests, payments, analytics, and browser storage.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <PageShell pageClassName="info-page privacy-page">
      <PublicPageJsonLd
        path="/privacy"
        title="Privacy Policy | SideQuest"
        description="Learn how SideQuest handles account, profile, quest, AI, payment, analytics, and browser-storage data."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy" },
        ]}
      />
      <BrandLink />

      <p className="eyebrow">A plain-language privacy guide</p>
      <h1 id="page-title" className="info-page-title">
        Your
        <br />
        <span>Privacy.</span>
      </h1>
      <p className="intro info-page-intro">
        What SideQuest uses to keep your account, quests, AI tools, and test
        purchases working—and the choices you have along the way.
      </p>

      <section className="info-surface legal-surface" aria-labelledby="privacy-details-title">
        <p className="info-kicker">Last updated August 25, 2026</p>
        <h2 id="privacy-details-title">
          Small adventures should not come with big surprises.
        </h2>

        <div className="legal-stack">
          <section className="legal-section" aria-labelledby="privacy-collect-title">
            <h3 id="privacy-collect-title">Information SideQuest may handle</h3>
            <p>
              SideQuest handles information you provide, information needed to run
              your account, and limited technical information produced while you use
              the app. This can include your email address, display name, bio,
              avatar, custom quests, authentication identifiers, AI prompts, payment
              status, subscription status, device or browser details, and error or
              usage data.
            </p>
          </section>

          <section className="legal-section" aria-labelledby="privacy-account-title">
            <h3 id="privacy-account-title">Authentication and account information</h3>
            <p>
              SideQuest uses Supabase Auth and may offer Google OAuth or
              email-and-password sign-in. Supabase or Google may provide basic
              account details such as your email address, name, provider identifier,
              and profile image. Supabase also maintains the session information
              needed to keep you signed in and enforce protected routes and roles.
            </p>
          </section>

          <section className="legal-section" aria-labelledby="privacy-content-title">
            <h3 id="privacy-content-title">Profiles and user-created content</h3>
            <p>
              Profile details, avatar references, custom quests, account roles,
              payment entitlements, and subscription records are stored in Supabase.
              Row Level Security is used so ordinary users can access only the data
              allowed for their account. Administrators may manage the shared quest
              catalog through protected tools.
            </p>
          </section>

          <section className="legal-section" aria-labelledby="privacy-browser-title">
            <h3 id="privacy-browser-title">Browser storage and sessions</h3>
            <p>
              Saved Quests and the five-item Adventure Log are stored in your
              browser&apos;s localStorage, along with your light or dark theme choice.
              They stay with that browser and device and can disappear if you clear
              browser data. Supabase uses browser cookies or equivalent session
              storage to maintain authentication. SideQuest does not move Saved
              Quests or Adventure Log entries into Supabase.
            </p>
          </section>

          <section className="legal-section" aria-labelledby="privacy-ai-title">
            <h3 id="privacy-ai-title">AI features</h3>
            <p>
              Text submitted to SideQuest Guide and AI Quest Remix, together with
              relevant conversation or quest context, is sent through SideQuest&apos;s
              server to the OpenAI API to generate a response. The app does not need
              your password or payment-card details for these requests, and you
              should not include sensitive personal information in an AI prompt.
              Chat history is kept in the current chat session rather than saved as
              a permanent SideQuest conversation record.
            </p>
          </section>

          <section className="legal-section" aria-labelledby="privacy-infrastructure-title">
            <h3 id="privacy-infrastructure-title">Rate limiting and infrastructure</h3>
            <p>
              SideQuest uses Upstash Redis to rate-limit AI requests. A limited
              network identifier, such as an IP address derived from trusted proxy
              headers, may be processed for a short window to prevent abuse and
              protect API capacity. Hosting and delivery infrastructure may also
              process routine request information needed to serve the site.
            </p>
          </section>

          <section className="legal-section" aria-labelledby="privacy-payments-title">
            <h3 id="privacy-payments-title">Stripe Sandbox payments and subscriptions</h3>
            <p>
              The current project uses Stripe in test or Sandbox mode for the
              SideQuest Support Pack and SideQuest Plus demonstration flows. Stripe
              handles the Checkout page and test payment details. SideQuest stores
              limited records needed to verify access, such as Stripe customer,
              Checkout Session, and subscription identifiers, product or entitlement
              keys, payment or subscription status, and cancellation timing. The app
              does not receive or store full payment-card numbers.
            </p>
          </section>

          <section className="legal-section" aria-labelledby="privacy-observability-title">
            <h3 id="privacy-observability-title">Analytics and error monitoring</h3>
            <p>
              Vercel Web Analytics helps SideQuest understand broad site usage.
              Sentry receives technical error information so failures can be found
              and fixed. The Sentry setup disables default personal-information
              collection, replay, and unnecessary tracing, but technical events can
              still include details about the page, browser, request, or failure.
            </p>
          </section>

          <section className="legal-section" aria-labelledby="privacy-providers-title">
            <h3 id="privacy-providers-title">Service providers</h3>
            <p>
              SideQuest relies on Supabase, Google, OpenAI, Upstash, Stripe, Vercel,
              and Sentry for the functions described above. These providers process
              information under their own terms and privacy policies. SideQuest does
              not sell personal information, but information is shared with these
              providers when needed to operate the requested feature.
            </p>
          </section>

          <section className="legal-section" aria-labelledby="privacy-retention-title">
            <h3 id="privacy-retention-title">Retention and your choices</h3>
            <p>
              Browser-stored data remains until you remove it or clear browser data.
              Supabase account and content records remain while needed to provide the
              app, honor your settings, meet security needs, or until they are
              removed through available controls. Provider records may follow each
              provider&apos;s retention practices. You can edit your profile, delete
              your custom quests, unsave browser-stored quests, clear localStorage,
              sign out, and schedule cancellation of a test subscription through the
              available controls.
            </p>
          </section>

          <section className="legal-section" aria-labelledby="privacy-security-title">
            <h3 id="privacy-security-title">Security and its limits</h3>
            <p>
              SideQuest uses measures such as authenticated server routes, Row Level
              Security, server-only credentials, and payment verification. No online
              system is perfectly secure, so SideQuest cannot guarantee that loss,
              misuse, or unauthorized access will never occur. Keep your account
              credentials private and avoid placing sensitive information in quests
              or AI prompts.
            </p>
          </section>

          <section className="legal-section" aria-labelledby="privacy-children-title">
            <h3 id="privacy-children-title">Children&apos;s privacy</h3>
            <p>
              SideQuest is not directed to children under 13, and the project does
              not knowingly seek personal information from children under 13. A
              parent or guardian who believes a child has provided information
              should use the contact method below.
            </p>
          </section>

          <section className="legal-section" aria-labelledby="privacy-changes-title">
            <h3 id="privacy-changes-title">Policy changes and contact</h3>
            <p>
              This notice may change as SideQuest&apos;s features or providers change.
              The updated date at the top will identify the current version.
            </p>
            <p className="legal-contact">
              Contact: <span>[Add a production support email before launch]</span>
            </p>
          </section>
        </div>
      </section>

      <p className="intro legal-home-link">
        <Link className="admin-home-link" href="/">
          <span aria-hidden="true">←</span> Back to SideQuest home
        </Link>
      </p>
    </PageShell>
  );
}
