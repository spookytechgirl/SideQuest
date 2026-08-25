import Link from "next/link";
import BrandLink from "@/components/brand-link";
import PageShell from "@/components/page-shell";
import { createPrivateMetadata } from "@/lib/social-metadata";
import { verifySupportPackCheckout } from "@/lib/stripe";

export const metadata = createPrivateMetadata({
  title: "Purchase Complete",
  description: "Confirmation for a SideQuest Support Pack test purchase.",
  path: "/purchase-success",
});

export default async function PurchaseSuccessPage({ searchParams }) {
  const query = await searchParams;
  const sessionId = Array.isArray(query.session_id)
    ? query.session_id[0]
    : query.session_id;
  let isVerified = false;

  try {
    isVerified = await verifySupportPackCheckout(sessionId);
  } catch {
    isVerified = false;
  }

  return (
    <PageShell pageClassName="info-page purchase-result-page">
      <BrandLink />

      <p className="eyebrow">
        {isVerified ? "Test purchase complete" : "Purchase status unavailable"}
      </p>
      <h1 id="page-title" className="info-page-title purchase-result-title">
        {isVerified ? (
          <>
            Quest
            <br />
            <span>Supported.</span>
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
        {isVerified
          ? "Your SideQuest Support Pack test payment was confirmed. Thanks for adding a little fuel to the adventure."
          : "SideQuest could not verify a completed test payment from this link. No sensitive payment details are shown here."}
      </p>

      <div className="purchase-result-actions">
        <Link className="quest-button purchase-result-link" href="/">
          <span>Back to SideQuest</span>
          <span className="button-arrow" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </PageShell>
  );
}
