"use client";

import { useEffect, useRef, useState } from "react";

const MAX_MESSAGE_LENGTH = 2000;

function createMessage(role, content) {
  return {
    id: crypto.randomUUID(),
    role,
    content,
  };
}

export default function ChatExperience() {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef(null);
  const textareaRef = useRef(null);
  const endRef = useRef(null);
  const wasLoadingRef = useRef(false);

  useEffect(() => {
    if (wasLoadingRef.current && !isLoading) {
      textareaRef.current?.focus();
    }

    wasLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    if (!messages.length && !isLoading) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    endRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "nearest",
    });
  }, [isLoading, messages]);

  const requestReply = async (conversation) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversation.map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "The guide could not answer right now.");
      }

      if (typeof data.message !== "string" || !data.message.trim()) {
        throw new Error("The guide returned an empty reply. Please try again.");
      }

      setMessages((current) => [
        ...current,
        createMessage("assistant", data.message.trim()),
      ]);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "The guide could not answer right now. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const content = draft.trim();

    if (!content || isLoading) {
      return;
    }

    const nextMessages = [...messages, createMessage("user", content)];
    setMessages(nextMessages);
    setDraft("");
    void requestReply(nextMessages);
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const retryLastMessage = () => {
    if (isLoading || messages.at(-1)?.role !== "user") {
      return;
    }

    void requestReply(messages);
  };

  return (
    <section className="chat-panel" aria-labelledby="chat-panel-title">
      <div className="chat-panel-heading">
        <div>
          <p className="info-kicker">Your cozy adventure companion</p>
          <h2 id="chat-panel-title">Chat with the Guide</h2>
        </div>
        <span className="chat-session-label">Session only</span>
      </div>

      <div
        className="chat-messages"
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
        aria-busy={isLoading}
      >
        {messages.length === 0 ? (
          <div className="chat-welcome">
            <span className="chat-avatar" aria-hidden="true">
              ↗
            </span>
            <div>
              <h3>Ready for a small plot twist?</h3>
              <p>
                Tell me your mood, energy, available time, or what sounds good.
                I&apos;ll help you find one realistic little adventure.
              </p>
            </div>
          </div>
        ) : (
          <ol className="chat-message-list">
            {messages.map((message) => (
              <li
                className="chat-message"
                data-role={message.role}
                key={message.id}
              >
                <span className="chat-avatar" aria-hidden="true">
                  {message.role === "assistant" ? "↗" : "You"}
                </span>
                <div className="chat-message-content">
                  <p className="chat-message-author">
                    {message.role === "assistant" ? "SideQuest Guide" : "You"}
                  </p>
                  <p>{message.content}</p>
                </div>
              </li>
            ))}
          </ol>
        )}

        {isLoading ? (
          <div className="chat-message chat-loading-message" role="status">
            <span className="chat-avatar" aria-hidden="true">
              ↗
            </span>
            <div className="chat-message-content">
              <p className="chat-message-author">SideQuest Guide</p>
              <p className="chat-thinking">
                <span aria-hidden="true" />
                <span aria-hidden="true" />
                <span aria-hidden="true" />
                <span className="visually-hidden">Finding your next side quest…</span>
              </p>
            </div>
          </div>
        ) : null}

        <div ref={endRef} />
      </div>

      {error ? (
        <div className="chat-error" role="alert">
          <p>{error}</p>
          {messages.at(-1)?.role === "user" ? (
            <button type="button" onClick={retryLastMessage} disabled={isLoading}>
              Try again
            </button>
          ) : null}
        </div>
      ) : null}

      <form
        className="chat-composer"
        ref={formRef}
        onSubmit={handleSubmit}
        aria-busy={isLoading}
      >
        <label htmlFor="chat-message">Message the SideQuest Guide</label>
        <textarea
          id="chat-message"
          ref={textareaRef}
          rows="2"
          maxLength={MAX_MESSAGE_LENGTH}
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            setError("");
          }}
          onKeyDown={handleKeyDown}
          placeholder="I have 20 minutes and low energy…"
          aria-describedby="chat-message-help chat-character-count"
          disabled={isLoading}
        />
        <div className="chat-composer-footer">
          <div className="chat-input-help">
            <p id="chat-message-help">Enter sends · Shift+Enter adds a new line</p>
            <p id="chat-character-count" aria-live="off">
              {draft.length}/{MAX_MESSAGE_LENGTH}
            </p>
          </div>
          <button
            className="quiz-submit chat-send-button"
            type="submit"
            disabled={isLoading || !draft.trim()}
          >
            {isLoading ? "Thinking…" : "Send"}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </form>

      <p className="chat-privacy-note">
        Conversation history stays in this page session and clears when you refresh.
      </p>
    </section>
  );
}
