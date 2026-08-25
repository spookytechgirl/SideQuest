"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getLoginPath } from "@/lib/auth-paths";

const CHECKOUT_HOST = "checkout.stripe.com";

export default function SubscriptionCheckoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const startSubscription = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/subscription/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        router.push(getLoginPath("/#sidequest-plus"));
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Subscription Checkout could not start.");
      }

      const checkoutUrl = new URL(data.url);

      if (checkoutUrl.protocol !== "https:" || checkoutUrl.hostname !== CHECKOUT_HOST) {
        throw new Error("Stripe returned an unexpected checkout address.");
      }

      window.location.assign(checkoutUrl.toString());
    } catch (subscriptionError) {
      setError(
        subscriptionError instanceof Error
          ? subscriptionError.message
          : "Subscription Checkout could not start. Please try again.",
      );
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        className="quest-button subscription-button"
        type="button"
        onClick={startSubscription}
        disabled={isLoading}
        aria-busy={isLoading}
      >
        <span>{isLoading ? "Opening Stripe…" : "Subscribe"}</span>
        <span className="button-arrow" aria-hidden="true">
          {isLoading ? "…" : "→"}
        </span>
      </button>

      <div className="subscription-feedback" aria-live="polite" aria-atomic="true">
        {isLoading ? <p>Preparing secure subscription Checkout…</p> : null}
      </div>

      {error ? (
        <p className="subscription-error" role="alert">
          {error}
        </p>
      ) : null}
    </>
  );
}
