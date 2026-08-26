import Link from "next/link";
import BrandLink from "@/components/brand-link";
import PageShell from "@/components/page-shell";
import { createPublicMetadata } from "@/lib/social-metadata";

export const metadata = createPublicMetadata({
  title: "Terms of Use",
  description:
    "Read the plain-language terms for accounts, quests, AI features, and Stripe Sandbox flows in SideQuest.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <PageShell pageClassName="info-page terms-page">
      <BrandLink />

      <p className="eyebrow">Rules for the trail</p>
      <h1 id="page-title" className="info-page-title">
        Terms
        <br />
        <span>of Use.</span>
      </h1>
      <p className="intro info-page-intro">
        A plain-language guide to using SideQuest thoughtfully, safely, and with
        realistic expectations.
      </p>

      <section className="info-surface legal-surface" aria-labelledby="terms-details-title">
        <p className="info-kicker">Last updated August 25, 2026</p>
        <h2 id="terms-details-title">A few ground rules before the next quest.</h2>

        <div className="legal-stack">
          <section className="legal-section" aria-labelledby="terms-acceptance-title">
            <h3 id="terms-acceptance-title">Acceptance of these terms</h3>
            <p>
              By accessing or using SideQuest, you agree to follow these terms. If
              you do not agree, do not use the service. These terms describe the
              current project in general language and are not legal advice.
            </p>
          </section>

          <section className="legal-section" aria-labelledby="terms-service-title">
            <h3 id="terms-service-title">What SideQuest provides</h3>
            <p>
              SideQuest is a playful planning app for discovering, generating,
              saving, and creating small activities. It includes a personalized
              quiz, browser-saved quests, an Adventure Log, account profiles,
              user-created quests, AI-assisted suggestions, and test-mode purchase
              and subscription demonstrations.
            </p>
          </section>

          <section className="legal-section" aria-labelledby="terms-account-title">
            <h3 id="terms-account-title">Account responsibilities</h3>
            <p>
              Some features require a Supabase account. Provide accurate information
              where requested, keep your sign-in credentials secure, and use only
              accounts you are authorized to use. You are responsible for activity
              performed through your account and should sign out on shared devices.
            </p>
          </section>

          <section className="legal-section" aria-labelledby="terms-content-title">
            <h3 id="terms-content-title">Your content</h3>
            <p>
              You remain responsible for profile text, avatars, custom quests, AI
              prompts, and other content you submit. You give SideQuest the limited
              permission needed to store, process, display, and transmit that content
              so the requested feature can work. Do not submit content you do not
              have the right to use, or content containing unnecessary sensitive
              personal information.
            </p>
          </section>

          <section className="legal-section" aria-labelledby="terms-use-title">
            <h3 id="terms-use-title">Acceptable use</h3>
            <p>You may not use SideQuest to:</p>
            <ul>
              <li>break laws, infringe rights, harass people, or promote harm;</li>
              <li>probe, bypass, or interfere with authentication, roles, RLS, rate limits, or payment checks;</li>
              <li>upload malicious code or overload the service or its providers;</li>
              <li>access another user&apos;s account, content, entitlement, or subscription without permission; or</li>
              <li>misrepresent AI output or test payment activity as verified professional or financial advice.</li>
            </ul>
          </section>

          <section className="legal-section" aria-labelledby="terms-ai-title">
            <h3 id="terms-ai-title">AI-generated content</h3>
            <p>
              SideQuest Guide and AI Quest Remix can produce incomplete, inaccurate,
              repetitive, or unsuitable suggestions. AI output is for inspiration,
              not professional, medical, legal, financial, or safety advice. Review
              each suggestion, use common sense, respect local conditions, and choose
              an activity that is safe and appropriate for you.
            </p>
          </section>

          <section className="legal-section" aria-labelledby="terms-payment-title">
            <h3 id="terms-payment-title">Test payments and subscriptions</h3>
            <p>
              The current SideQuest project uses Stripe Sandbox or test mode. The $5
              SideQuest Support Pack and $3-per-month SideQuest Plus flow demonstrate
              Checkout, entitlements, subscription status, and cancellation without
              processing a real commercial charge. Use Stripe test credentials only.
              If real billing is introduced later, the product information and these
              terms must be updated before live charges are accepted.
            </p>
          </section>

          <section className="legal-section" aria-labelledby="terms-cancel-title">
            <h3 id="terms-cancel-title">Cancellation behavior</h3>
            <p>
              The current SideQuest Plus demonstration schedules cancellation at the
              end of the Stripe test billing period. The app displays the status it
              verifies with Stripe and stores for the signed-in account. Cancelling a
              test subscription does not remove an existing one-time Support Pack
              entitlement.
            </p>
          </section>

          <section className="legal-section" aria-labelledby="terms-ip-title">
            <h3 id="terms-ip-title">SideQuest materials</h3>
            <p>
              The SideQuest name, interface, visual design, and original app content
              remain with their respective owner or licensor. These terms do not
              transfer ownership of the service or authorize copying, resale, or
              misuse of protected materials. Third-party names and services remain
              the property of their respective owners.
            </p>
          </section>

          <section className="legal-section" aria-labelledby="terms-provider-title">
            <h3 id="terms-provider-title">Third-party services</h3>
            <p>
              SideQuest depends on services including Supabase, Google, OpenAI,
              Upstash, Stripe, Vercel, and Sentry. Their availability, processing,
              and terms are outside SideQuest&apos;s direct control. Your use of a
              third-party sign-in, Checkout, or AI feature may also be governed by
              that provider&apos;s terms and policies.
            </p>
          </section>

          <section className="legal-section" aria-labelledby="terms-availability-title">
            <h3 id="terms-availability-title">Availability and changes</h3>
            <p>
              SideQuest may change, pause, limit, or discontinue features, and the
              service may occasionally be unavailable. Features may behave
              differently as providers, APIs, or project requirements change. No
              promise is made that every feature will always be available or error-free.
            </p>
          </section>

          <section className="legal-section" aria-labelledby="terms-disclaimer-title">
            <h3 id="terms-disclaimer-title">Disclaimers</h3>
            <p>
              SideQuest is provided on an “as available” basis for a project and
              demonstration experience. To the extent permitted by applicable law,
              no guarantee is made about accuracy, reliability, fitness for a
              particular purpose, safety of suggested activities, or uninterrupted
              operation. You decide whether and how to attempt a quest.
            </p>
          </section>

          <section className="legal-section" aria-labelledby="terms-liability-title">
            <h3 id="terms-liability-title">Limits of responsibility</h3>
            <p>
              To the extent permitted by applicable law, SideQuest&apos;s creator and
              contributors are not responsible for indirect, incidental, or
              consequential losses arising from use of the service, AI output,
              third-party providers, or an activity you choose to attempt. Some laws
              do not allow every limitation, so a limitation applies only as far as
              the law permits.
            </p>
          </section>

          <section className="legal-section" aria-labelledby="terms-termination-title">
            <h3 id="terms-termination-title">Suspension or termination</h3>
            <p>
              Access may be limited or suspended when reasonably necessary to
              protect users, providers, the service, or the integrity of its data,
              including for abuse, security risks, or serious violations of these
              terms. You may stop using SideQuest at any time.
            </p>
          </section>

          <section className="legal-section" aria-labelledby="terms-changes-title">
            <h3 id="terms-changes-title">Changes and contact</h3>
            <p>
              These terms may be revised as the project changes. The updated date at
              the top will identify the current version. Continued use after a
              revision means the revised terms apply from that point forward.
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
