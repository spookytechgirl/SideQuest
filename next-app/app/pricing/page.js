import Link from "next/link";
import BrandLink from "@/components/brand-link";
import PageShell from "@/components/page-shell";
import PurchaseCard from "@/components/purchase-card";
import PublicPageJsonLd from "@/components/public-page-json-ld";
import SubscriptionCard from "@/components/subscription-card";
import { getAuthContext } from "@/lib/auth";
import { getEntitlementState } from "@/lib/entitlements";
import { createPublicMetadata } from "@/lib/social-metadata";
import { getSubscriptionState } from "@/lib/subscriptions";

export const metadata = createPublicMetadata({
  title: "Pricing",
  description:
    "Compare free SideQuest features, the $5 Support Pack, and the $3 monthly SideQuest Plus Stripe Sandbox demo.",
  path: "/pricing",
});

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const { supabase, user } = await getAuthContext();
  const [entitlement, subscriptionState] = user
    ? await Promise.all([
        getEntitlementState(supabase, user.id),
        getSubscriptionState(supabase, user.id),
      ])
    : [
        { isEntitled: false, error: null },
        {
          isActive: false,
          isCanceling: false,
          record: null,
          error: null,
        },
      ];
  const access = {
    isSignedIn: Boolean(user),
    isEntitled: entitlement.isEntitled,
    isAvailable: !entitlement.error,
  };
  const subscription = {
    isSignedIn: Boolean(user),
    isAvailable: !subscriptionState.error,
    isActive: subscriptionState.isActive,
    isCanceling: subscriptionState.isCanceling,
    status: subscriptionState.status,
    currentPeriodEnd: subscriptionState.record?.current_period_end || null,
  };

  return (
    <PageShell pageClassName="info-page pricing-page">
      <PublicPageJsonLd
        path="/pricing"
        title="Pricing | SideQuest"
        description="Compare free SideQuest features, the $5 Support Pack, and the $3 monthly SideQuest Plus Stripe Sandbox demo."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ]}
      />
      <BrandLink />

      <p className="eyebrow">Choose your trail</p>
      <h1 id="page-title" className="info-page-title">
        SideQuest
        <br />
        <span>Pricing.</span>
      </h1>
      <p className="intro info-page-intro pricing-intro">
        The everyday adventure tools are free. The two Stripe Sandbox options
        below demonstrate a one-time feature unlock and a recurring test
        subscription—no real charge is made.
      </p>

      <div className="pricing-grid" aria-label="SideQuest pricing options">
        <section className="pricing-free-card" aria-labelledby="free-plan-title">
          <div className="pricing-free-copy">
            <p className="info-kicker">Free SideQuest</p>
            <h2 id="free-plan-title">Everyday adventures</h2>
            <p>Everything needed to find, save, and create small quests.</p>
          </div>

          <p className="pricing-free-price">
            <span className="visually-hidden">Price:</span>
            <strong>$0</strong>
            <span>always free</span>
          </p>

          <ul className="pricing-feature-list">
            <li>Random generator and personalized quiz</li>
            <li>SideQuest Guide AI chat, subject to rate limits</li>
            <li>Saved Quests and Adventure Log with a free account</li>
            <li>Profile and user-created My Quests</li>
          </ul>

          <Link className="admin-secondary-button pricing-free-link" href="/">
            Explore free quests
          </Link>
        </section>

        <PurchaseCard access={access} />
        <SubscriptionCard subscription={subscription} />
      </div>

      <aside className="pricing-disclosure" aria-label="Test payment information">
        <p>
          Stripe Sandbox only. The Support Pack is a one-time $5 test purchase
          that unlocks AI Quest Remix. SideQuest Plus is a $3 monthly test
          subscription and currently demonstrates subscription lifecycle and
          cancellation; it does not unlock additional app features.
        </p>
        <p>
          Review the <Link href="/terms">Terms of Use</Link> and{" "}
          <Link href="/privacy">Privacy Policy</Link> before starting a test
          Checkout.
        </p>
      </aside>
    </PageShell>
  );
}
