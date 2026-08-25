import Link from "next/link";
import { redirect } from "next/navigation";
import BrandLink from "@/components/brand-link";
import PageShell from "@/components/page-shell";
import { getAuthContext } from "@/lib/auth";
import { getLoginPath } from "@/lib/auth-paths";
import { grantEntitlement } from "@/lib/entitlements";
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
  const { user } = await getAuthContext();

  if (!user) {
    const returnPath = sessionId
      ? `/purchase-success?session_id=${encodeURIComponent(sessionId)}`
      : "/purchase-success";
    redirect(getLoginPath(returnPath));
  }

  let isUnlocked = false;

  try {
    const session = await verifySupportPackCheckout(sessionId, user.id);

    if (session) {
      await grantEntitlement({
        userId: user.id,
        checkoutSessionId: session.id,
      });
      isUnlocked = true;
    }
  } catch {
    isUnlocked = false;
  }

  return (
    <PageShell pageClassName="info-page purchase-result-page">
      <BrandLink />

      <p className="eyebrow">
        {isUnlocked ? "AI Quest Remix unlocked" : "Purchase status unavailable"}
      </p>
      <h1 id="page-title" className="info-page-title purchase-result-title">
        {isUnlocked ? (
          <>
            Remix
            <br />
            <span>Unlocked.</span>
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
        {isUnlocked
          ? "Your SideQuest Support Pack test payment was confirmed. AI Quest Remix is ready whenever your next quest needs a plot twist."
          : "SideQuest could not verify and save an AI Quest Remix unlock from this link. No access was granted, and no sensitive payment details are shown here."}
      </p>

      <div className="purchase-result-actions">
        <Link className="quest-button purchase-result-link" href="/#page-title">
          <span>{isUnlocked ? "Remix a SideQuest" : "Back to SideQuest"}</span>
          <span className="button-arrow" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </PageShell>
  );
}
