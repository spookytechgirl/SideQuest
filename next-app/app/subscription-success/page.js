import Link from "next/link";
import { redirect } from "next/navigation";
import BrandLink from "@/components/brand-link";
import PageShell from "@/components/page-shell";
import { getAuthContext } from "@/lib/auth";
import { getLoginPath } from "@/lib/auth-paths";
import { createPrivateMetadata } from "@/lib/social-metadata";
import { verifySideQuestPlusCheckout } from "@/lib/stripe";
import { saveSubscriptionRecord } from "@/lib/subscriptions";

export const metadata = createPrivateMetadata({
  title: "Subscription Active",
  description: "Confirmation for a SideQuest Plus test subscription.",
  path: "/subscription-success",
});

export default async function SubscriptionSuccessPage({ searchParams }) {
  const query = await searchParams;
  const sessionId = Array.isArray(query.session_id)
    ? query.session_id[0]
    : query.session_id;
  const { user } = await getAuthContext();

  if (!user) {
    const returnPath = sessionId
      ? `/subscription-success?session_id=${encodeURIComponent(sessionId)}`
      : "/subscription-success";
    redirect(getLoginPath(returnPath));
  }

  let isActive = false;

  try {
    const verified = await verifySideQuestPlusCheckout(sessionId, user.id);

    if (verified) {
      await saveSubscriptionRecord({
        userId: user.id,
        checkoutSessionId: verified.session.id,
        subscription: verified.subscription,
      });
      isActive = true;
    }
  } catch {
    isActive = false;
  }

  return (
    <PageShell pageClassName="info-page purchase-result-page">
      <BrandLink />

      <p className="eyebrow">
        {isActive ? "SideQuest Plus active" : "Subscription status unavailable"}
      </p>
      <h1 id="page-title" className="info-page-title purchase-result-title">
        {isActive ? (
          <>
            Plus
            <br />
            <span>Activated.</span>
          </>
        ) : (
          <>
            Check
            <br />
            <span>Pending.</span>
          </>
        )}
      </h1>
      <p className="intro info-page-intro">
        {isActive
          ? "Your $3 monthly Stripe test subscription was confirmed. SideQuest Plus is now connected to this account."
          : "SideQuest could not verify and save a subscription from this link. No subscription access was recorded, and no payment details are shown here."}
      </p>

      <div className="purchase-result-actions">
        <Link
          className="quest-button purchase-result-link"
          href="/#sidequest-plus"
        >
          <span>{isActive ? "View SideQuest Plus" : "Back to SideQuest"}</span>
          <span className="button-arrow" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </PageShell>
  );
}
