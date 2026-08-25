"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getLoginPath } from "@/lib/auth-paths";

const CHECKOUT_HOST = "checkout.stripe.com";

export default function SupportPackCheckoutButton({
  className = "quest-button support-pack-button",
  label = "Buy Now",
  loadingLabel = "Opening Stripe…",
  returnTo = "/#support-sidequest",
}) {
  const router = useRouter();
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

      if (response.status === 401) {
        router.push(getLoginPath(returnTo));
        return;
      }

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
    <>
      <button
        className={className}
        type="button"
        onClick={startCheckout}
        disabled={isLoading}
        aria-busy={isLoading}
      >
        <span>{isLoading ? loadingLabel : label}</span>
        <span className="button-arrow" aria-hidden="true">
          {isLoading ? "…" : "→"}
        </span>
      </button>

      <div className="support-pack-status" aria-live="polite" aria-atomic="true">
        {isLoading ? <p>Preparing secure Stripe Checkout…</p> : null}
      </div>

      {error ? (
        <p className="support-pack-error" role="alert">
          {error}
        </p>
      ) : null}
    </>
  );
}
