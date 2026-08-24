"use client";

export default function SaveQuestButton({ questTitle, isSaved, onToggle }) {
  const action = isSaved ? "Unsave" : "Save";

  return (
    <button
      className="save-quest-button"
      type="button"
      aria-label={`${action} quest: ${questTitle}`}
      aria-pressed={isSaved}
      title={`${action} quest`}
      onClick={onToggle}
    >
      <span className="save-quest-icon" aria-hidden="true">
        {isSaved ? "♥" : "♡"}
      </span>
    </button>
  );
}
