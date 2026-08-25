import Link from "next/link";
import BrandLink from "@/components/brand-link";
import PageShell from "@/components/page-shell";
import { createPrivateMetadata } from "@/lib/social-metadata";

export const metadata = createPrivateMetadata({
  title: "Purchase Cancelled",
  description: "Return to SideQuest after cancelling a test purchase.",
  path: "/purchase-cancelled",
});

export default function PurchaseCancelledPage() {
  return (
    <PageShell pageClassName="info-page purchase-result-page">
      <BrandLink />

      <p className="eyebrow">No purchase completed</p>
      <h1 id="page-title" className="info-page-title purchase-result-title">
        Quest
        <br />
        <span>Paused.</span>
      </h1>
      <p className="intro info-page-intro">
        Your Stripe test checkout was cancelled, so no purchase was completed.
        You can try again whenever the mood strikes.
      </p>

      <div className="purchase-result-actions">
        <Link
          className="quest-button purchase-result-link"
          href="/#support-sidequest"
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
