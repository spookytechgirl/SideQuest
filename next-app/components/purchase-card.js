"use client";

import { useState } from "react";

const CHECKOUT_HOST = "checkout.stripe.com";

export default function PurchaseCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const startCheckout = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Test checkout could not start.");
      }

      const checkoutUrl = new URL(data.url);

      if (checkoutUrl.protocol !== "https:" || checkoutUrl.hostname !== CHECKOUT_HOST) {
        throw new Error("Stripe returned an unexpected checkout address.");
      }

      window.location.assign(checkoutUrl.toString());
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Test checkout could not start. Please try again.",
      );
      setIsLoading(false);
    }
  };

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
          Support the spirit of small adventures with one simple Stripe test
          purchase.
        </p>
      </div>

      <p className="support-pack-price">
        <span className="visually-hidden">Price:</span>
        <strong>$5.00</strong>
        <span>USD</span>
      </p>

      <button
        className="quest-button support-pack-button"
        type="button"
        onClick={startCheckout}
        disabled={isLoading}
        aria-busy={isLoading}
      >
        <span>{isLoading ? "Opening Stripe…" : "Buy Now"}</span>
        <span className="button-arrow" aria-hidden="true">
          {isLoading ? "…" : "→"}
        </span>
      </button>

      <p className="support-pack-note">
        Secure hosted checkout. Stripe test cards only—no real charge will be made.
      </p>

      <div className="support-pack-status" aria-live="polite" aria-atomic="true">
        {isLoading ? <p>Preparing secure Stripe Checkout…</p> : null}
      </div>

      {error ? (
        <p className="support-pack-error" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
