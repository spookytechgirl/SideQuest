"use client";

import { useState } from "react";

export default function SuggestionForm() {
  const [isInvalid, setIsInvalid] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const ideaField = form.elements.namedItem("idea");

    if (!ideaField.value.trim()) {
      ideaField.setCustomValidity("Please share a SideQuest idea.");
      setIsInvalid(true);
      setIsSuccessful(false);
      ideaField.reportValidity();
      return;
    }

    ideaField.setCustomValidity("");
    form.reset();
    setIsInvalid(false);
    setIsSuccessful(true);
  };

  const handleIdeaInput = (event) => {
    event.currentTarget.setCustomValidity("");
    setIsInvalid(false);
    setIsSuccessful(false);
  };

  return (
    <>
      <form className="suggestion-form" noValidate onSubmit={handleSubmit}>
        <div className="suggestion-form-grid">
          <div className="suggestion-field">
            <label htmlFor="suggestion-name">
              Name or nickname <span>(optional)</span>
            </label>
            <input
              id="suggestion-name"
              name="name"
              type="text"
              autoComplete="nickname"
              maxLength="60"
            />
          </div>

          <div className="suggestion-field">
            <label htmlFor="suggestion-category">
              Category <span>(optional)</span>
            </label>
            <select id="suggestion-category" name="category" defaultValue="">
              <option value="">Choose a category</option>
              <option value="Creative">Creative</option>
              <option value="Relaxing">Relaxing</option>
              <option value="Food">Food</option>
              <option value="Outdoors">Outdoors</option>
              <option value="Local Adventure">Local Adventure</option>
              <option value="Random">Random</option>
            </select>
          </div>
        </div>

        <div className="suggestion-field">
          <label htmlFor="suggestion-idea">
            SideQuest idea <span>(required)</span>
          </label>
          <textarea
            id="suggestion-idea"
            name="idea"
            rows="4"
            maxLength="240"
            required
            aria-invalid={isInvalid}
            aria-describedby={isInvalid ? "suggestion-error" : undefined}
            onInput={handleIdeaInput}
          />
        </div>

        <button className="quiz-submit suggestion-submit" type="submit">
          Submit SideQuest Idea <span aria-hidden="true">→</span>
        </button>
      </form>

      {isInvalid ? (
        <p className="suggestion-error" id="suggestion-error" role="alert">
          Please share a SideQuest idea.
        </p>
      ) : null}

      {isSuccessful ? (
        <p className="suggestion-success" role="status" aria-live="polite">
          Quest suggestion received! Thanks for adding to the adventure.
        </p>
      ) : null}
    </>
  );
}
