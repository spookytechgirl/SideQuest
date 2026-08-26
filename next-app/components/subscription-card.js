"use client";

import Link from "next/link";
import SubscriptionCancelButton from "@/components/subscription-cancel-button";
import SubscriptionCheckoutButton from "@/components/subscription-checkout-button";
import { getLoginPath } from "@/lib/auth-paths";

function formatPeriodEnd(value) {
  if (!value) {
    return "the end of your current billing period";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "the end of your current billing period";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);
}

export default function SubscriptionCard({ subscription }) {
  const periodEnd = formatPeriodEnd(subscription?.currentPeriodEnd);

  return (
    <section
      className="subscription-card"
      id="sidequest-plus"
      aria-labelledby="sidequest-plus-title"
    >
      <div className="subscription-copy">
        <p className="info-kicker">Monthly test subscription</p>
        <h2 id="sidequest-plus-title">SideQuest Plus</h2>
        <p>A Stripe Sandbox subscription demo for your SideQuest account.</p>
      </div>

      <p className="subscription-price">
        <span className="visually-hidden">Price:</span>
        <strong>$3</strong>
        <span>USD / month</span>
      </p>

      {!subscription?.isAvailable ? (
        <p className="subscription-error" role="alert">
          Subscription status is temporarily unavailable. Please try again later.
        </p>
      ) : subscription?.isActive ? (
        <>
          <div className="subscription-active" role="status">
            <span aria-hidden="true">✓</span>
            <div>
              <strong>SideQuest Plus is active</strong>
              <p>
                {subscription.isCanceling
                  ? `Cancellation scheduled for ${periodEnd}.`
                  : `Next billing period ends ${periodEnd}.`}
              </p>
            </div>
          </div>
          {!subscription.isCanceling ? <SubscriptionCancelButton /> : null}
        </>
      ) : subscription?.isSignedIn ? (
        <SubscriptionCheckoutButton />
      ) : (
        <Link
          className="quest-button subscription-button"
          href={getLoginPath("/#sidequest-plus")}
        >
          <span>Sign in to subscribe</span>
          <span className="button-arrow" aria-hidden="true">
            →
          </span>
        </Link>
      )}

      <p className="subscription-note">
        {subscription?.isActive
          ? "Subscription status is tied securely to this SideQuest account."
          : "Stripe test mode only. No additional app features are currently tied to Plus."}
      </p>
    </section>
  );
}
