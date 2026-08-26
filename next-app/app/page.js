import Link from "next/link";
import PageShell from "@/components/page-shell";
import PublicPageJsonLd from "@/components/public-page-json-ld";
import PurchaseCard from "@/components/purchase-card";
import QuestGenerator from "@/components/quest-generator";
import SubscriptionCard from "@/components/subscription-card";
import { getAuthContext } from "@/lib/auth";
import { getEntitlementState } from "@/lib/entitlements";
import { createPublicMetadata } from "@/lib/social-metadata";
import { getSubscriptionState } from "@/lib/subscriptions";

export const metadata = createPublicMetadata({
  absoluteTitle: "SideQuest | Find Your Next Adventure",
  description:
    "SideQuest generates quick, simple activities whenever you want to shake up your day.",
  path: "/",
});

export const dynamic = "force-dynamic";

export default async function Home() {
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
    <PageShell shellClassName="home-shell" pageClassName="home-hero">
      <PublicPageJsonLd
        path="/"
        title="SideQuest | Find Your Next Adventure"
        description="SideQuest generates quick, simple activities whenever you want to shake up your day."
      />
      <div className="brand-mark" aria-hidden="true">
        <span>↗</span>
      </div>

      <p className="eyebrow">A little spark for your day</p>
      <h1 id="page-title">
        Side<span>Quest.</span>
      </h1>
      <p className="intro">
        Break the routine with one simple idea. Your next small adventure is
        only a click away.
      </p>

      <QuestGenerator remixAccess={access} />

      <p className="hint">No planning. No pressure. Just try something new.</p>

      <section className="home-discovery scroll-reveal" aria-labelledby="home-discovery-title">
        <div>
          <p className="info-kicker">More ways to begin</p>
          <h2 id="home-discovery-title">Start with the kind of day you are having.</h2>
          <p>
            Browse ideas by mood and setting, explore a little inspiration, or ask
            the Guide for help narrowing it down.
          </p>
        </div>
        <div className="home-discovery-actions">
          <Link href="/quests">Browse the Quest Directory</Link>
          <Link href="/ideas">Browse SideQuest Ideas</Link>
          <Link href="/explore">Explore inspiration</Link>
          <Link href="/chat">Ask the SideQuest Guide</Link>
        </div>
      </section>

      <PurchaseCard access={access} />
      <SubscriptionCard subscription={subscription} />
    </PageShell>
  );
}
