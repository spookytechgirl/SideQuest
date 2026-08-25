"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SubscriptionCancelButton() {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const cancelSubscription = async () => {
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/subscription/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "The subscription could not be cancelled.");
      }

      setMessage(data.message || "Cancellation scheduled.");
      setIsConfirming(false);
      router.refresh();
    } catch (cancelError) {
      setError(
        cancelError instanceof Error
          ? cancelError.message
          : "The subscription could not be cancelled right now.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="subscription-cancel-controls">
      {isConfirming ? (
        <div className="subscription-cancel-confirmation">
          <p>
            SideQuest Plus will stay active until the end of the current billing
            period. Continue?
          </p>
          <div className="subscription-cancel-actions">
            <button
              className="admin-secondary-button"
              type="button"
              onClick={() => setIsConfirming(false)}
              disabled={isLoading}
            >
              Keep subscription
            </button>
            <button
              className="admin-secondary-button admin-delete-button"
              type="button"
              onClick={cancelSubscription}
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? "Scheduling…" : "Confirm cancellation"}
            </button>
          </div>
        </div>
      ) : (
        <button
          className="admin-secondary-button subscription-cancel-button"
          type="button"
          onClick={() => {
            setError("");
            setMessage("");
            setIsConfirming(true);
          }}
        >
          Cancel subscription
        </button>
      )}

      <div className="subscription-feedback" aria-live="polite" aria-atomic="true">
        {isLoading ? <p>Scheduling cancellation…</p> : null}
        {message ? <p>{message}</p> : null}
      </div>

      {error ? (
        <p className="subscription-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
