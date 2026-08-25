"use client";

import { useId, useState } from "react";
import {
  createRemixedQuest,
  getRemixStyleLabel,
  REMIX_STYLES,
} from "@/lib/remix-options";

export default function QuestRemixControls({ quest, onRemixed }) {
  const selectId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [style, setStyle] = useState(REMIX_STYLES[0].value);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError("");
    setStatus("");

    try {
      const response = await fetch("/api/remix-quest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questText: quest.title, style }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "This quest could not be remixed right now.");
      }

      if (typeof data.quest !== "string" || !data.quest.trim()) {
        throw new Error("The remix studio returned an empty quest. Please try again.");
      }

      const remixLabel = getRemixStyleLabel(style);
      onRemixed(createRemixedQuest(quest, data.quest.trim(), style));
      setStatus(`${remixLabel} remix ready. You can save it with the heart button.`);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "This quest could not be remixed right now. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="quest-remix" aria-labelledby="quest-remix-title">
      <button
        className="quest-remix-toggle"
        type="button"
        aria-expanded={isOpen}
        aria-controls="quest-remix-form"
        onClick={() => {
          setIsOpen((current) => !current);
          setError("");
          setStatus("");
        }}
      >
        <span aria-hidden="true">✦</span>
        <span id="quest-remix-title">Remix this quest</span>
        <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
      </button>

      {isOpen ? (
        <form
          className="quest-remix-form"
          id="quest-remix-form"
          onSubmit={handleSubmit}
          aria-busy={isLoading}
        >
          <div className="quest-remix-copy">
            <p className="quest-remix-kicker">AI Quest Remix</p>
            <p>Give this idea a small AI-powered plot twist.</p>
          </div>
          <div className="quest-remix-actions">
            <div className="quest-remix-field">
              <label htmlFor={selectId}>Remix style</label>
              <select
                id={selectId}
                value={style}
                onChange={(event) => {
                  setStyle(event.target.value);
                  setError("");
                  setStatus("");
                }}
                disabled={isLoading}
              >
                {REMIX_STYLES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="quest-remix-submit"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Remixing…" : "Create remix"}
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <p className="quest-remix-loading" role="status" aria-live="polite">
            {isLoading ? "AI Quest Remix is shaping one new adventure…" : status}
          </p>
          {error ? (
            <p className="quest-remix-error" role="alert">
              {error}
            </p>
          ) : null}
        </form>
      ) : null}
    </section>
  );
}
