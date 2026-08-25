"use client";

import Link from "next/link";
import SupportPackCheckoutButton from "@/components/support-pack-checkout-button";
import { getLoginPath } from "@/lib/auth-paths";

export default function PurchaseCard({ access }) {
  return (
    <section
      className="support-pack"
      id="support-sidequest"
      aria-labelledby="support-pack-title"
    >
      <div className="support-pack-copy">
        <p className="info-kicker">Optional test-mode checkout</p>
        <h2 id="support-pack-title">SideQuest Support Pack</h2>
        <p>
          Unlock AI Quest Remix with one simple Stripe test purchase.
        </p>
      </div>

      <p className="support-pack-price">
        <span className="visually-hidden">Price:</span>
        <strong>$5.00</strong>
        <span>USD</span>
      </p>

      {access?.isEntitled ? (
        <div className="support-pack-unlocked" role="status">
          <span aria-hidden="true">✓</span>
          AI Quest Remix unlocked
        </div>
      ) : !access?.isAvailable ? (
        <p className="support-pack-error" role="alert">
          Unlock status is temporarily unavailable. Please try again later.
        </p>
      ) : access?.isSignedIn ? (
        <SupportPackCheckoutButton label="Unlock with Support Pack — $5" />
      ) : (
        <Link
          className="quest-button support-pack-button"
          href={getLoginPath("/#support-sidequest")}
        >
          <span>Sign in to unlock</span>
          <span className="button-arrow" aria-hidden="true">→</span>
        </Link>
      )}

      <p className="support-pack-note">
        {access?.isEntitled
          ? "Your unlock is tied securely to this SideQuest account."
          : "Secure hosted checkout. Stripe test cards only—no real charge will be made."}
      </p>
    </section>
  );
}
