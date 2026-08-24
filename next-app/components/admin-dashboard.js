"use client";

import { useMemo, useRef, useState } from "react";
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
const questColumns = "id, quest_text, category, effort, created_at";

export default function AdminDashboard({
  initialError = "",
  initialQuests = [],
  userEmail,
  userId,
}) {
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

  async function verifyCurrentAdmin() {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user || user.id !== userId) {
      return false;
    }

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    return !error && data?.role === "admin";
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
      text: editingId === null ? "Adding quest…" : "Saving quest changes…",
      kind: "",
    });

    if (!(await verifyCurrentAdmin())) {
      setPendingAction("");
      const text = "Admin access could not be confirmed. Refresh the page and try again.";
      setMessage({ text, kind: "error" });
      showToast(text, "error");
      return;
    }

    const result = editingId === null
      ? await supabase.from("quests").insert(values).select(questColumns).single()
      : await supabase
          .from("quests")
          .update(values)
          .eq("id", editingId)
          .select(questColumns)
          .maybeSingle();

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
        ? current.map((quest) => quest.id === result.data.id ? result.data : quest)
        : [result.data, ...current],
    );
    setEditingId(null);
    setForm(emptyForm);
    setMessage({ text: "", kind: "" });
    showToast(wasEditing ? "Quest updated in Supabase." : "Quest added to Supabase.");
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
    setMessage({ text: "Deleting quest…", kind: "" });

    if (!(await verifyCurrentAdmin())) {
      setPendingAction("");
      const text = "Admin access could not be confirmed. Refresh the page and try again.";
      setMessage({ text, kind: "error" });
      showToast(text, "error");
      return;
    }

    const { data, error } = await supabase
      .from("quests")
      .delete()
      .eq("id", quest.id)
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
    <section className="admin-dashboard" aria-labelledby="admin-dashboard-title">
      <div className="admin-dashboard-heading">
        <div>
          <p className="info-kicker">Supabase quest collection</p>
          <h2 id="admin-dashboard-title">Manage quests</h2>
          <p className="admin-user-line">
            Signed in as <strong>{userEmail || "authenticated admin"}</strong>
          </p>
        </div>
        <SignOutButton />
      </div>

      <p
        className="admin-message"
        data-kind={message.kind || undefined}
        role={message.kind === "error" ? "alert" : "status"}
        aria-live={message.kind === "error" ? "assertive" : "polite"}
        hidden={!message.text}
      >
        {message.text}
      </p>

      <section className="info-surface admin-editor" aria-labelledby="admin-form-title" ref={editorRef}>
        <div className="admin-panel-heading">
          <div>
            <p className="info-kicker">{editingId === null ? "Create" : "Update"}</p>
            <h2 id="admin-form-title">
              {editingId === null ? "Add a new quest" : "Edit this quest"}
            </h2>
          </div>
          {editingId !== null ? (
            <button className="admin-secondary-button admin-cancel-edit" type="button" onClick={resetEditor} disabled={isBusy}>
              Cancel Edit
            </button>
          ) : null}
        </div>

        <form className="admin-form" onSubmit={handleSubmit} aria-busy={isBusy}>
          <div className="suggestion-field">
            <label htmlFor="admin-quest-text">Quest text</label>
            <textarea
              id="admin-quest-text"
              name="quest_text"
              rows={4}
              maxLength={MAX_QUEST_LENGTH}
              required
              aria-describedby="admin-quest-text-help"
              value={form.quest_text}
              onChange={updateField}
              disabled={isBusy}
            />
            <p className="field-help" id="admin-quest-text-help">
              Describe one clear activity in 240 characters or fewer.
            </p>
          </div>

          <div className="admin-form-grid">
            <div className="suggestion-field">
              <label htmlFor="admin-category">Category</label>
              <select id="admin-category" name="category" required value={form.category} onChange={updateField} disabled={isBusy}>
                <option value="">Choose a category</option>
                {QUEST_CATEGORIES.map((category) => (
                  <option value={category} key={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="suggestion-field">
              <label htmlFor="admin-effort">Effort level</label>
              <select id="admin-effort" name="effort" required value={form.effort} onChange={updateField} disabled={isBusy}>
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
      </section>

      <section className="admin-collection" aria-labelledby="admin-collection-title">
        <div className="admin-collection-heading">
          <div>
            <p className="info-kicker">Read, edit, or remove</p>
            <h2 id="admin-collection-title">Database quests</h2>
          </div>
          <span className="admin-count" aria-live="polite">{countLabel}</span>
        </div>

        <div className="admin-quest-list" aria-live="polite">
          {quests.length ? quests.map((quest) => (
            <article className="admin-quest-card" key={quest.id}>
              <div className="admin-quest-meta">
                <span className="quest-label">{quest.category}</span>
                <span className="quest-effort">{quest.effort}</span>
              </div>
              <h3>{quest.quest_text}</h3>
              <div className="admin-card-actions">
                <button className="admin-action-button" type="button" onClick={() => beginEdit(quest)} disabled={isBusy} aria-label={`Edit quest: ${quest.quest_text}`}>
                  Edit
                </button>
                <button className="admin-action-button admin-delete-button" type="button" onClick={() => deleteQuest(quest)} disabled={isBusy} aria-label={`Delete quest: ${quest.quest_text}`}>
                  {pendingAction === `delete-${quest.id}` ? "Deleting…" : "Delete"}
                </button>
              </div>
            </article>
          )) : (
            <div className="admin-empty-state">
              <h3>No database quests yet.</h3>
              <p>Add the first Supabase quest with the form above.</p>
            </div>
          )}
        </div>
      </section>
    </section>
  );
}
