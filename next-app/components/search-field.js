"use client";

export default function SearchField({
  value,
  onChange,
  statusId,
  statusText,
  hideStatus,
}) {
  return (
    <div className="saved-quests-search">
      <label htmlFor="saved-quests-search">Search saved quests</label>
      <div className="saved-quests-search-control">
        <span className="saved-quests-search-icon" aria-hidden="true">
          ⌕
        </span>
        <input
          id="saved-quests-search"
          type="search"
          placeholder="Try a quest, category, or effort level"
          autoComplete="off"
          aria-describedby={statusId}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
      <p
        className="saved-quests-search-status"
        id={statusId}
        role="status"
        aria-live="polite"
        hidden={hideStatus}
      >
        {statusText}
      </p>
    </div>
  );
}
