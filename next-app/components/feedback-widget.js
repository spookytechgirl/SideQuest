"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const MAX_MESSAGE_LENGTH = 1_000;

const initialForm = {
  feedbackType: "",
  rating: "",
  message: "",
};

export default function FeedbackWidget() {
  const pathname = usePathname();
  const triggerRef = useRef(null);
  const dialogRef = useRef(null);
  const typeRef = useRef(null);
  const messageRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [error, setError] = useState("");
  const [errorField, setErrorField] = useState("");
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog || !isOpen || dialog.open) {
      return;
    }

    dialog.showModal();
    window.requestAnimationFrame(() => typeRef.current?.focus());
  }, [isOpen]);

  const openDialog = () => {
    setError("");
    setErrorField("");
    setIsSuccessful(false);
    setIsOpen(true);
  };

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  const handleDialogClose = () => {
    setIsOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const handleDialogCancel = (event) => {
    event.preventDefault();
    closeDialog();
  };

  const handleDialogKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeDialog();
    }
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      closeDialog();
    }
  };

  const updateField = (event) => {
    const { name, value } = event.currentTarget;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
    setErrorField("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.feedbackType) {
      setError("Choose the kind of feedback you want to share.");
      setErrorField("feedbackType");
      typeRef.current?.focus();
      return;
    }

    if (!form.message.trim()) {
      setError("Please share a feedback message.");
      setErrorField("message");
      messageRef.current?.focus();
      return;
    }

    setIsSending(true);
    setError("");
    setErrorField("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedbackType: form.feedbackType,
          rating: form.rating ? Number(form.rating) : null,
          message: form.message,
          pagePath: pathname || "/",
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          payload?.error || "Feedback could not be sent. Please try again.",
        );
      }

      setForm(initialForm);
      setIsSuccessful(true);
    } catch (submissionError) {
      setErrorField("form");
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Feedback could not be sent. Please try again.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        className="feedback-trigger"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={openDialog}
      >
        <span className="feedback-trigger-mark" aria-hidden="true">
          ✦
        </span>
        Send Feedback
      </button>

      <dialog
        ref={dialogRef}
        className="feedback-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-dialog-title"
        aria-describedby="feedback-dialog-description"
        onCancel={handleDialogCancel}
        onClose={handleDialogClose}
        onClick={handleBackdropClick}
        onKeyDown={handleDialogKeyDown}
      >
        <div className="feedback-panel">
          <div className="feedback-heading">
            <div>
              <p className="info-kicker">Help shape the next adventure</p>
              <h2 id="feedback-dialog-title">Send Feedback</h2>
            </div>
            <button
              className="feedback-close"
              type="button"
              aria-label="Close feedback dialog"
              onClick={closeDialog}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <p id="feedback-dialog-description" className="feedback-intro">
            Found a rough edge or have a bright idea? Share a quick note with
            SideQuest. No email is required.
          </p>

          {isSuccessful ? (
            <div
              className="feedback-success"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              <span aria-hidden="true">✓</span>
              <h3>Thanks for the feedback!</h3>
              <p>Your note is safely tucked into the adventure log.</p>
              <div className="feedback-success-actions">
                <button
                  className="admin-secondary-button"
                  type="button"
                  onClick={() => {
                    setIsSuccessful(false);
                    window.requestAnimationFrame(() => typeRef.current?.focus());
                  }}
                >
                  Send another
                </button>
                <button className="quest-button" type="button" onClick={closeDialog}>
                  Done <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          ) : (
            <form
              className="feedback-form"
              aria-busy={isSending}
              noValidate
              onSubmit={handleSubmit}
            >
              <div className="feedback-field">
                <label htmlFor="feedback-type">
                  Feedback type <span>(required)</span>
                </label>
                <select
                  ref={typeRef}
                  id="feedback-type"
                  name="feedbackType"
                  value={form.feedbackType}
                  required
                  disabled={isSending}
                  aria-invalid={errorField === "feedbackType"}
                  aria-describedby={
                    errorField === "feedbackType" ? "feedback-error" : undefined
                  }
                  onChange={updateField}
                >
                  <option value="">Choose a type</option>
                  <option value="bug">Bug</option>
                  <option value="idea">Idea</option>
                  <option value="like">Something I like</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="feedback-field">
                <label htmlFor="feedback-rating">
                  Rating <span>(optional)</span>
                </label>
                <select
                  id="feedback-rating"
                  name="rating"
                  value={form.rating}
                  disabled={isSending}
                  onChange={updateField}
                >
                  <option value="">No rating</option>
                  <option value="1">1 — Needs work</option>
                  <option value="2">2</option>
                  <option value="3">3 — Good</option>
                  <option value="4">4</option>
                  <option value="5">5 — Love it</option>
                </select>
              </div>

              <div className="feedback-field feedback-message-field">
                <div className="feedback-label-row">
                  <label htmlFor="feedback-message">
                    Message <span>(required)</span>
                  </label>
                  <span aria-hidden="true">
                    {form.message.length}/{MAX_MESSAGE_LENGTH}
                  </span>
                </div>
                <textarea
                  ref={messageRef}
                  id="feedback-message"
                  name="message"
                  rows="5"
                  maxLength={MAX_MESSAGE_LENGTH}
                  value={form.message}
                  required
                  disabled={isSending}
                  aria-invalid={errorField === "message"}
                  aria-describedby={
                    errorField === "message" ? "feedback-error" : undefined
                  }
                  placeholder="Tell us what happened or what would make SideQuest better..."
                  onChange={updateField}
                />
              </div>

              {error ? (
                <p className="feedback-error" id="feedback-error" role="alert">
                  {error}
                </p>
              ) : null}

              <button
                className="quest-button feedback-submit"
                type="submit"
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Send Feedback"}
                <span aria-hidden="true">→</span>
              </button>
            </form>
          )}

          <p className="feedback-privacy-note">
            Signed-in notes may be associated with your account. Anonymous notes
            are welcome too.
          </p>
        </div>
      </dialog>
    </>
  );
}
