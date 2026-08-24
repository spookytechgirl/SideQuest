(() => {
  "use strict";

  const state = {
    session: null,
    quests: [],
    editingId: null,
    loading: false,
    requestId: 0
  };

  const elements = {};
  let client;
  let initialSessionResolved = false;
  let latestAuthSession = null;
  let resolveInitialAuthEvent;

  const initialAuthEvent = new Promise((resolve) => {
    resolveInitialAuthEvent = resolve;
  });

  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  function cacheElements() {
    elements.dashboard = document.querySelector("[data-protected-content]");
    elements.userEmail = document.querySelector("#my-quests-user-email");
    elements.signOutButton = document.querySelector("#my-quests-sign-out-button");
    elements.form = document.querySelector("#user-quest-form");
    elements.questText = document.querySelector("#user-quest-text");
    elements.category = document.querySelector("#user-quest-category");
    elements.effort = document.querySelector("#user-quest-effort");
    elements.saveButton = document.querySelector("#user-quest-save-button");
    elements.cancelEdit = document.querySelector("#user-quest-cancel-edit");
    elements.formKicker = document.querySelector("#user-quest-form-kicker");
    elements.formTitle = document.querySelector("#user-quest-form-title");
    elements.message = document.querySelector("#user-quest-message");
    elements.questList = document.querySelector("#user-quest-list");
    elements.questCount = document.querySelector("#user-quest-count");
  }

  function setMessage(message = "", kind = "") {
    elements.message.textContent = message;
    elements.message.dataset.kind = kind;
    elements.message.hidden = !message;
  }

  function setFormBusy(isBusy) {
    elements.form.setAttribute("aria-busy", String(isBusy));
    elements.form.querySelectorAll("textarea, select, button").forEach((control) => {
      control.disabled = isBusy;
    });
    elements.cancelEdit.disabled = isBusy;
  }

  function setDashboardBusy(isBusy) {
    state.loading = isBusy;
    elements.dashboard.setAttribute("aria-busy", String(isBusy));
    elements.questList.querySelectorAll("button").forEach((button) => {
      button.disabled = isBusy;
    });
  }

  function resetEditor() {
    state.editingId = null;
    elements.form.reset();
    elements.formKicker.textContent = "Create";
    elements.formTitle.textContent = "Add a custom quest";
    elements.saveButton.innerHTML = 'Add Quest <span aria-hidden="true">→</span>';
    elements.cancelEdit.hidden = true;
  }

  function showSignedOutState() {
    state.requestId += 1;
    state.session = null;
    state.quests = [];
    state.loading = false;
    elements.signOutButton.disabled = false;
    elements.userEmail.textContent = "";
    elements.questList.replaceChildren();
    elements.questCount.textContent = "0 quests";
    elements.dashboard.hidden = true;
    resetEditor();
    setMessage();
  }

  function createBadge(text, className) {
    const badge = document.createElement("span");
    badge.className = className;
    badge.textContent = text;
    return badge;
  }

  function formatQuestDate(quest) {
    const created = new Date(quest.created_at);
    const updated = new Date(quest.updated_at);
    const wasUpdated = Number.isFinite(updated.getTime())
      && Number.isFinite(created.getTime())
      && updated.getTime() - created.getTime() > 1000;
    const date = wasUpdated ? updated : created;

    return {
      iso: Number.isFinite(date.getTime()) ? date.toISOString() : "",
      label: `${wasUpdated ? "Updated" : "Created"} ${Number.isFinite(date.getTime()) ? dateFormatter.format(date) : "recently"}`
    };
  }

  function renderQuests() {
    elements.questList.replaceChildren();
    const total = state.quests.length;
    elements.questCount.textContent = `${total} ${total === 1 ? "quest" : "quests"}`;

    if (total === 0) {
      const emptyState = document.createElement("div");
      emptyState.className = "admin-empty-state";

      const title = document.createElement("h3");
      title.textContent = "No custom quests yet.";

      const copy = document.createElement("p");
      copy.textContent = "Create your first idea with the form above.";

      emptyState.append(title, copy);
      elements.questList.append(emptyState);
      return;
    }

    state.quests.forEach((quest) => {
      const card = document.createElement("article");
      card.className = "admin-quest-card user-quest-card";

      const meta = document.createElement("div");
      meta.className = "admin-quest-meta";
      meta.append(
        createBadge(quest.category, "quest-label"),
        createBadge(quest.effort, "quest-effort")
      );

      const title = document.createElement("h3");
      title.textContent = quest.quest_text;

      const dateInfo = formatQuestDate(quest);
      const timestamp = document.createElement("time");
      timestamp.className = "user-quest-date";
      timestamp.textContent = dateInfo.label;

      if (dateInfo.iso) {
        timestamp.dateTime = dateInfo.iso;
      }

      const actions = document.createElement("div");
      actions.className = "admin-card-actions";

      const editButton = document.createElement("button");
      editButton.className = "admin-action-button";
      editButton.type = "button";
      editButton.dataset.action = "edit";
      editButton.dataset.questId = String(quest.id);
      editButton.textContent = "Edit";
      editButton.setAttribute("aria-label", `Edit quest: ${quest.quest_text}`);

      const deleteButton = document.createElement("button");
      deleteButton.className = "admin-action-button admin-delete-button";
      deleteButton.type = "button";
      deleteButton.dataset.action = "delete";
      deleteButton.dataset.questId = String(quest.id);
      deleteButton.textContent = "Delete";
      deleteButton.setAttribute("aria-label", `Delete quest: ${quest.quest_text}`);

      actions.append(editButton, deleteButton);
      card.append(meta, title, timestamp, actions);
      elements.questList.append(card);
    });
  }

  async function loadQuests() {
    if (!state.session?.user) {
      return;
    }

    const requestId = ++state.requestId;
    setDashboardBusy(true);
    setMessage("Loading your custom quests…");

    const { data, error } = await client
      .from("user_quests")
      .select("id, user_id, quest_text, category, effort, created_at, updated_at")
      .eq("user_id", state.session.user.id)
      .order("updated_at", { ascending: false });

    if (requestId !== state.requestId) {
      return;
    }

    setDashboardBusy(false);

    if (error) {
      state.quests = [];
      renderQuests();
      setMessage(
        "Your quests could not be loaded. Confirm that the user quest SQL has been run in Supabase.",
        "error"
      );
      return;
    }

    state.quests = data || [];
    renderQuests();
    setMessage();
  }

  async function applySession(session) {
    const previousUserId = state.session?.user?.id || null;
    const nextUserId = session?.user?.id || null;
    state.session = session;

    if (!session?.user) {
      showSignedOutState();
      return;
    }

    elements.userEmail.textContent = session.user.email || "authenticated user";

    if (previousUserId !== nextUserId || state.quests.length === 0) {
      await loadQuests();
    }
  }

  function getQuestValues() {
    return {
      quest_text: elements.questText.value.trim(),
      category: elements.category.value,
      effort: elements.effort.value
    };
  }

  async function handleQuestSubmit(event) {
    event.preventDefault();

    if (!state.session?.user || state.loading) {
      return;
    }

    const questValues = getQuestValues();

    if (!questValues.quest_text || !questValues.category || !questValues.effort) {
      setMessage("Complete all quest fields before saving.", "error");
      return;
    }

    setFormBusy(true);
    setMessage(state.editingId === null ? "Adding your quest…" : "Saving quest changes…");

    let data;
    let error;

    if (state.editingId === null) {
      ({ data, error } = await client
        .from("user_quests")
        .insert({
          ...questValues,
          user_id: state.session.user.id
        })
        .select("id")
        .single());
    } else {
      ({ data, error } = await client
        .from("user_quests")
        .update(questValues)
        .eq("id", state.editingId)
        .eq("user_id", state.session.user.id)
        .select("id")
        .maybeSingle());
    }

    setFormBusy(false);

    if (error || !data) {
      setMessage("The quest could not be saved. Please try again.", "error");
      return;
    }

    const successMessage = state.editingId === null
      ? "Quest added to your collection."
      : "Your quest changes were saved.";
    resetEditor();
    await loadQuests();
    setMessage(successMessage, "success");
  }

  function beginEdit(quest) {
    state.editingId = quest.id;
    elements.questText.value = quest.quest_text;
    elements.category.value = quest.category;
    elements.effort.value = quest.effort;
    elements.formKicker.textContent = "Update";
    elements.formTitle.textContent = "Edit this quest";
    elements.saveButton.innerHTML = 'Save Changes <span aria-hidden="true">→</span>';
    elements.cancelEdit.hidden = false;
    setMessage();
    elements.form.scrollIntoView({ behavior: "smooth", block: "center" });
    elements.questText.focus({ preventScroll: true });
  }

  async function deleteQuest(quest) {
    const confirmed = window.confirm(`Permanently delete “${quest.quest_text}”?`);

    if (!confirmed) {
      return;
    }

    setDashboardBusy(true);
    setMessage("Deleting your quest…");
    const { data, error } = await client
      .from("user_quests")
      .delete()
      .eq("id", quest.id)
      .eq("user_id", state.session.user.id)
      .select("id")
      .maybeSingle();
    setDashboardBusy(false);

    if (error || !data) {
      setMessage("The quest could not be deleted. Please try again.", "error");
      return;
    }

    if (String(state.editingId) === String(quest.id)) {
      resetEditor();
    }

    await loadQuests();
    setMessage("Quest permanently deleted.", "success");
  }

  async function handleQuestListClick(event) {
    const button = event.target.closest("button[data-action]");

    if (!button || !state.session?.user || state.loading) {
      return;
    }

    const quest = state.quests.find((item) => String(item.id) === button.dataset.questId);

    if (!quest) {
      return;
    }

    if (button.dataset.action === "edit") {
      beginEdit(quest);
    } else if (button.dataset.action === "delete") {
      await deleteQuest(quest);
    }
  }

  async function handleSignOut() {
    elements.signOutButton.disabled = true;
    setMessage("Signing out…");
    const { error } = await client.auth.signOut();

    if (error) {
      elements.signOutButton.disabled = false;
      setMessage("Unable to sign out right now. Please try again.", "error");
      return;
    }

    showSignedOutState();
  }

  function bindEvents() {
    elements.form.addEventListener("submit", handleQuestSubmit);
    elements.cancelEdit.addEventListener("click", () => {
      resetEditor();
      setMessage();
    });
    elements.questList.addEventListener("click", handleQuestListClick);
    elements.signOutButton.addEventListener("click", handleSignOut);
  }

  function handleAuthStateChange(event, session) {
    latestAuthSession = session;

    if (!initialSessionResolved) {
      if (event === "INITIAL_SESSION" || session?.user) {
        resolveInitialAuthEvent(session);
      }
      return;
    }

    window.setTimeout(() => {
      void applySession(session);
    }, 0);
  }

  async function resolveExistingSession() {
    const sessionRequest = client.auth.getSession();
    const sessionFromEvent = await Promise.race([
      initialAuthEvent,
      new Promise((resolve) => window.setTimeout(() => resolve(null), 750))
    ]);
    const { data, error } = await sessionRequest;

    if (error) {
      return { session: null, error };
    }

    let session = data.session || sessionFromEvent || latestAuthSession;

    if (!session) {
      await new Promise((resolve) => window.setTimeout(resolve, 150));
      const retry = await client.auth.getSession();

      if (retry.error) {
        return { session: null, error: retry.error };
      }

      session = retry.data.session || latestAuthSession;
    }

    return { session, error: null };
  }

  async function initialize() {
    cacheElements();
    bindEvents();
    client = window.sideQuestSupabase;

    if (!client) {
      setFormBusy(true);
      setMessage("My Quests is unavailable because the Supabase client could not be initialized.", "error");
      return;
    }

    client.auth.onAuthStateChange(handleAuthStateChange);

    const connectionReady = await window.sideQuestSupabaseReady;

    if (!connectionReady) {
      initialSessionResolved = true;
      setFormBusy(true);
      setMessage("My Quests is temporarily unavailable. Please refresh and try again.", "error");
      return;
    }

    const { session, error } = await resolveExistingSession();
    initialSessionResolved = true;

    if (error) {
      setFormBusy(true);
      setMessage("Your sign-in status could not be checked. Please refresh and try again.", "error");
      return;
    }

    await applySession(session);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    void initialize();
  }
})();
