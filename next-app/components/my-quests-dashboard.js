"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SignOutButton from "@/components/sign-out-button";
import { useToast } from "@/components/toast-provider";
import {
  MAX_QUEST_LENGTH,
  QUEST_CATEGORIES,
  QUEST_EFFORTS,
  validateQuestValues,
} from "@/lib/quest-options";
import { createClient } from "@/lib/supabase/client";

const emptyForm = { quest_text: "", category: "", effort: "" };
const questColumns =
  "id, user_id, quest_text, category, effort, created_at, updated_at";

function formatQuestDate(quest) {
  const created = new Date(quest.created_at);
  const updated = new Date(quest.updated_at);
  const wasUpdated =
    Number.isFinite(created.getTime()) &&
    Number.isFinite(updated.getTime()) &&
    updated.getTime() - created.getTime() > 1000;
  const date = wasUpdated ? updated : created;

  return {
    iso: Number.isFinite(date.getTime()) ? date.toISOString() : undefined,
    label: `${wasUpdated ? "Updated" : "Created"} ${
      Number.isFinite(date.getTime())
        ? new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }).format(date)
        : "recently"
    }`,
  };
}

export default function MyQuestsDashboard({
  initialError = "",
  initialQuests = [],
  userEmail,
  userId,
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const editorRef = useRef(null);
  const { showToast } = useToast();
  const [quests, setQuests] = useState(initialQuests);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [pendingAction, setPendingAction] = useState("");
  const [message, setMessage] = useState(
    initialError ? { text: initialError, kind: "error" } : { text: "", kind: "" },
  );

  const isBusy = Boolean(pendingAction);
  const countLabel = `${quests.length} ${quests.length === 1 ? "quest" : "quests"}`;

  async function getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    return error || !user || user.id !== userId ? null : user;
  }

  function returnToLogin() {
    router.replace("/login?next=%2Fmy-quests");
    router.refresh();
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetEditor() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage({ text: "", kind: "" });
  }

  async function reloadQuests() {
    setPendingAction("load");
    setMessage({ text: "Loading your custom quests…", kind: "" });
    const user = await getCurrentUser();

    if (!user) {
      returnToLogin();
      return;
    }

    const { data, error } = await supabase
      .from("user_quests")
      .select(questColumns)
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    setPendingAction("");

    if (error) {
      const text = "Your quests could not be loaded. Please try again.";
      setMessage({ text, kind: "error" });
      showToast(text, "error");
      return;
    }

    setQuests(data || []);
    setMessage({ text: "", kind: "" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const values = {
      quest_text: form.quest_text.trim(),
      category: form.category,
      effort: form.effort,
    };
    const validationMessage = validateQuestValues(values);

    if (validationMessage) {
      setMessage({ text: validationMessage, kind: "error" });
      return;
    }

    setPendingAction(editingId === null ? "create" : "update");
    setMessage({
      text: editingId === null ? "Adding your quest…" : "Saving quest changes…",
      kind: "",
    });

    const user = await getCurrentUser();

    if (!user) {
      returnToLogin();
      return;
    }

    let result;

    if (editingId === null) {
      result = await supabase
        .from("user_quests")
        .insert({ ...values, user_id: user.id })
        .select(questColumns)
        .single();
    } else {
      result = await supabase
        .from("user_quests")
        .update(values)
        .eq("id", editingId)
        .eq("user_id", user.id)
        .select(questColumns)
        .maybeSingle();
    }

    setPendingAction("");

    if (result.error || !result.data) {
      const text = "The quest could not be saved. Please try again.";
      setMessage({ text, kind: "error" });
      showToast(text, "error");
      return;
    }

    const wasEditing = editingId !== null;
    setQuests((current) =>
      wasEditing
        ? [result.data, ...current.filter((quest) => quest.id !== result.data.id)]
        : [result.data, ...current],
    );
    setEditingId(null);
    setForm(emptyForm);
    setMessage({ text: "", kind: "" });
    showToast(
      wasEditing
        ? "Your quest changes were saved."
        : "Quest added to your collection.",
    );
  }

  function beginEdit(quest) {
    setEditingId(quest.id);
    setForm({
      quest_text: quest.quest_text,
      category: quest.category,
      effort: quest.effort,
    });
    setMessage({ text: "", kind: "" });
    editorRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "center",
    });
    window.requestAnimationFrame(() => {
      editorRef.current?.querySelector("textarea")?.focus({ preventScroll: true });
    });
  }

  async function deleteQuest(quest) {
    if (!window.confirm(`Permanently delete “${quest.quest_text}”?`)) {
      return;
    }

    setPendingAction(`delete-${quest.id}`);
    setMessage({ text: "Deleting your quest…", kind: "" });
    const user = await getCurrentUser();

    if (!user) {
      returnToLogin();
      return;
    }

    const { data, error } = await supabase
      .from("user_quests")
      .delete()
      .eq("id", quest.id)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    setPendingAction("");

    if (error || !data) {
      const text = "The quest could not be deleted. Please try again.";
      setMessage({ text, kind: "error" });
      showToast(text, "error");
      return;
    }

    setQuests((current) => current.filter((item) => item.id !== quest.id));
    if (editingId === quest.id) {
      resetEditor();
    } else {
      setMessage({ text: "", kind: "" });
    }
    showToast("Quest permanently deleted.");
  }

  return (
    <section className="my-quests-dashboard" aria-labelledby="my-quests-dashboard-title">
      <div className="admin-dashboard-heading my-quests-account-bar">
        <div>
          <p className="info-kicker">Personal quest board</p>
          <h2 id="my-quests-dashboard-title">Manage your quests</h2>
          <p className="admin-user-line">
            Signed in as <strong>{userEmail || "authenticated user"}</strong>
          </p>
        </div>
        <SignOutButton />
      </div>

      <section
        className="info-surface user-quest-editor"
        aria-labelledby="user-quest-form-title"
        ref={editorRef}
      >
        <div className="admin-panel-heading">
          <div>
            <p className="info-kicker">{editingId === null ? "Create" : "Update"}</p>
            <h2 id="user-quest-form-title">
              {editingId === null ? "Add a custom quest" : "Edit this quest"}
            </h2>
          </div>
          {editingId !== null ? (
            <button
              className="admin-secondary-button admin-cancel-edit"
              type="button"
              onClick={resetEditor}
              disabled={isBusy}
            >
              Cancel Edit
            </button>
          ) : null}
        </div>

        <form className="admin-form user-quest-form" onSubmit={handleSubmit} aria-busy={isBusy}>
          <div className="suggestion-field">
            <label htmlFor="user-quest-text">Quest text</label>
            <textarea
              id="user-quest-text"
              name="quest_text"
              maxLength={MAX_QUEST_LENGTH}
              required
              placeholder="What small adventure should future-you try?"
              aria-describedby="user-quest-text-help"
              value={form.quest_text}
              onChange={updateField}
              disabled={isBusy}
            />
            <p className="field-help" id="user-quest-text-help">
              Keep it specific and inviting—up to 240 characters.
            </p>
          </div>

          <div className="admin-form-grid">
            <div className="suggestion-field">
              <label htmlFor="user-quest-category">Category</label>
              <select
                id="user-quest-category"
                name="category"
                required
                value={form.category}
                onChange={updateField}
                disabled={isBusy}
              >
                <option value="">Choose a category</option>
                {QUEST_CATEGORIES.map((category) => (
                  <option value={category} key={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="suggestion-field">
              <label htmlFor="user-quest-effort">Effort level</label>
              <select
                id="user-quest-effort"
                name="effort"
                required
                value={form.effort}
                onChange={updateField}
                disabled={isBusy}
              >
                <option value="">Choose an effort level</option>
                {QUEST_EFFORTS.map((effort) => (
                  <option value={effort} key={effort}>{effort}</option>
                ))}
              </select>
            </div>
          </div>

          <button className="quiz-submit" type="submit" disabled={isBusy}>
            <span>
              {pendingAction === "create"
                ? "Adding…"
                : pendingAction === "update"
                  ? "Saving…"
                  : editingId === null
                    ? "Add Quest"
                    : "Save Changes"}
            </span>
            <span aria-hidden="true">→</span>
          </button>
        </form>

        <p
          className="admin-message user-quest-message"
          data-kind={message.kind || undefined}
          role={message.kind === "error" ? "alert" : "status"}
          aria-live={message.kind === "error" ? "assertive" : "polite"}
          hidden={!message.text}
        >
          {message.text}
        </p>
        {initialError && message.kind === "error" ? (
          <button className="admin-secondary-button" type="button" onClick={reloadQuests} disabled={isBusy}>
            Try Loading Again
          </button>
        ) : null}
      </section>

      <section className="admin-collection user-quest-collection" aria-labelledby="user-quest-list-title" aria-busy={pendingAction === "load"}>
        <div className="admin-collection-heading">
          <div>
            <p className="info-kicker">Your collection</p>
            <h2 id="user-quest-list-title">Custom quests</h2>
          </div>
          <span className="admin-count" aria-live="polite">{countLabel}</span>
        </div>

        <div className="admin-quest-list user-quest-list" aria-live="polite">
          {quests.length ? quests.map((quest) => {
            const date = formatQuestDate(quest);
            return (
              <article className="admin-quest-card user-quest-card" key={quest.id}>
                <div className="admin-quest-meta">
                  <span className="quest-label">{quest.category}</span>
                  <span className="quest-effort">{quest.effort}</span>
                </div>
                <h3>{quest.quest_text}</h3>
                <time className="user-quest-date" dateTime={date.iso}>{date.label}</time>
                <div className="admin-card-actions">
                  <button
                    className="admin-action-button"
                    type="button"
                    onClick={() => beginEdit(quest)}
                    disabled={isBusy}
                    aria-label={`Edit quest: ${quest.quest_text}`}
                  >
                    Edit
                  </button>
                  <button
                    className="admin-action-button admin-delete-button"
                    type="button"
                    onClick={() => deleteQuest(quest)}
                    disabled={isBusy}
                    aria-label={`Delete quest: ${quest.quest_text}`}
                  >
                    {pendingAction === `delete-${quest.id}` ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </article>
            );
          }) : (
            <div className="admin-empty-state">
              <h3>No custom quests yet.</h3>
              <p>Create your first idea with the form above.</p>
            </div>
          )}
        </div>
      </section>
    </section>
  );
}
