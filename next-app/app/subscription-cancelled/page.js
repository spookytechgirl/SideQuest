import Link from "next/link";
import BrandLink from "@/components/brand-link";
import PageShell from "@/components/page-shell";
import { createPrivateMetadata } from "@/lib/social-metadata";

export const metadata = createPrivateMetadata({
  title: "Subscription Cancelled",
  description: "Return to SideQuest after cancelling subscription Checkout.",
  path: "/subscription-cancelled",
});

export default function SubscriptionCancelledPage() {
  return (
    <PageShell pageClassName="info-page purchase-result-page">
      <BrandLink />

      <p className="eyebrow">No subscription started</p>
      <h1 id="page-title" className="info-page-title purchase-result-title">
        Plus
        <br />
        <span>Paused.</span>
      </h1>
      <p className="intro info-page-intro">
        Your Stripe test Checkout was cancelled, so SideQuest Plus was not
        started. You can subscribe whenever you are ready.
      </p>

      <div className="purchase-result-actions">
        <Link
          className="quest-button purchase-result-link"
          href="/#sidequest-plus"
        >
          <span>Try Again</span>
          <span className="button-arrow" aria-hidden="true">
            →
          </span>
        </Link>
        <Link className="admin-secondary-button" href="/">
          Back Home
        </Link>
      </div>
    </PageShell>
  );
}
