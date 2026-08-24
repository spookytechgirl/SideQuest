(() => {
  "use strict";

  const GOOGLE_OAUTH_REDIRECT_URL = "https://side-quest-ochre.vercel.app/admin.html";

  const state = {
    session: null,
    role: null,
    quests: [],
    editingId: null,
    loading: false,
    accessCheckId: 0
  };

  const elements = {};
  let client;

  function cacheElements() {
    elements.connectionStatus = document.querySelector("#admin-connection-status");
    elements.authPanel = document.querySelector("#admin-auth-panel");
    elements.authForm = document.querySelector("#admin-sign-in-form");
    elements.email = document.querySelector("#admin-email");
    elements.password = document.querySelector("#admin-password");
    elements.signInButton = document.querySelector("#admin-sign-in-button");
    elements.googleSignInButton = document.querySelector("#admin-google-sign-in-button");
    elements.authMessage = document.querySelector("#admin-auth-message");
    elements.accessPanel = document.querySelector("#admin-access-panel");
    elements.accessUser = document.querySelector("#admin-access-user");
    elements.accessMessage = document.querySelector("#admin-access-message");
    elements.accessSignOutButton = document.querySelector("#admin-access-sign-out-button");
    elements.dashboard = document.querySelector("#admin-dashboard");
    elements.dashboardMessage = document.querySelector("#admin-dashboard-message");
    elements.userEmail = document.querySelector("#admin-user-email");
    elements.signOutButton = document.querySelector("#admin-sign-out-button");
    elements.questForm = document.querySelector("#admin-quest-form");
    elements.questText = document.querySelector("#admin-quest-text");
    elements.category = document.querySelector("#admin-category");
    elements.effort = document.querySelector("#admin-effort");
    elements.saveButton = document.querySelector("#admin-save-button");
    elements.cancelEdit = document.querySelector("#admin-cancel-edit");
    elements.formKicker = document.querySelector("#admin-form-kicker");
    elements.formTitle = document.querySelector("#admin-form-title");
    elements.questList = document.querySelector("#admin-quest-list");
    elements.questCount = document.querySelector("#admin-quest-count");
  }

  function setMessage(element, message = "", kind = "") {
    element.textContent = message;
    element.dataset.kind = kind;
    element.setAttribute("role", kind === "error" ? "alert" : "status");
    element.setAttribute("aria-live", kind === "error" ? "assertive" : "polite");
    element.hidden = !message;
  }

  function setFormBusy(form, isBusy) {
    form.setAttribute("aria-busy", String(isBusy));
    form.querySelectorAll("input, select, textarea, button").forEach((control) => {
      control.disabled = isBusy;
    });
  }

  function setDashboardBusy(isBusy) {
    state.loading = isBusy;
    elements.dashboard.setAttribute("aria-busy", String(isBusy));
  }

  function resetEditor() {
    state.editingId = null;
    elements.questForm.reset();
    elements.formKicker.textContent = "Create";
    elements.formTitle.textContent = "Add a new quest";
    elements.saveButton.innerHTML = 'Add Quest <span aria-hidden="true">→</span>';
    elements.cancelEdit.hidden = true;
  }

  function showSignedOutState() {
    state.accessCheckId += 1;
    state.session = null;
    state.role = null;
    state.quests = [];
    elements.authPanel.hidden = false;
    elements.accessPanel.hidden = true;
    elements.dashboard.hidden = true;
    elements.accessUser.textContent = "";
    elements.userEmail.textContent = "";
    elements.questList.replaceChildren();
    elements.questCount.textContent = "0 quests";
    setMessage(elements.accessMessage);
    setMessage(elements.dashboardMessage);
    resetEditor();
  }

  function showUnauthorizedState(session, message = "") {
    state.session = session;
    state.role = null;
    state.quests = [];
    elements.authPanel.hidden = true;
    elements.accessPanel.hidden = false;
    elements.dashboard.hidden = true;
    elements.accessUser.textContent = session.user.email || "authenticated user";
    elements.userEmail.textContent = "";
    elements.questList.replaceChildren();
    elements.questCount.textContent = "0 quests";
    setMessage(elements.authMessage);
    setMessage(elements.accessMessage, message, message ? "error" : "");
    setMessage(elements.dashboardMessage);
    resetEditor();
  }

  function showAdminState(session) {
    state.session = session;
    state.role = "admin";
    elements.authPanel.hidden = true;
    elements.accessPanel.hidden = true;
    elements.dashboard.hidden = false;
    elements.accessUser.textContent = "";
    elements.userEmail.textContent = session.user.email || "authenticated user";
    setMessage(elements.authMessage);
    setMessage(elements.accessMessage);
  }

  async function applySession(session) {
    const accessCheckId = ++state.accessCheckId;
    const previousUserId = state.session?.user?.id || null;
    const nextUserId = session?.user?.id || null;
    state.session = session;

    if (!session) {
      showSignedOutState();
      return;
    }

    elements.authPanel.hidden = true;
    elements.accessPanel.hidden = true;
    elements.dashboard.hidden = true;
    setMessage(elements.connectionStatus, "Checking admin access…");

    const { data: roleRecord, error: roleError } = await client
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (accessCheckId !== state.accessCheckId) {
      return;
    }

    setMessage(elements.connectionStatus, "Connected to the SideQuest database.", "success");

    if (roleError) {
      showUnauthorizedState(
        session,
        "Admin access could not be verified. Confirm that the role SQL has been run in Supabase."
      );
      return;
    }

    if (roleRecord?.role !== "admin") {
      showUnauthorizedState(session);
      return;
    }

    showAdminState(session);

    if (previousUserId !== nextUserId || state.quests.length === 0) {
      await loadQuests();
    }
  }

  function createBadge(text, className) {
    const badge = document.createElement("span");
    badge.className = className;
    badge.textContent = text;
    return badge;
  }

  function renderQuests() {
    elements.questList.replaceChildren();
    const total = state.quests.length;
    elements.questCount.textContent = `${total} ${total === 1 ? "quest" : "quests"}`;

    if (total === 0) {
      const emptyState = document.createElement("div");
      emptyState.className = "admin-empty-state";

      const title = document.createElement("h3");
      title.textContent = "No database quests yet.";

      const copy = document.createElement("p");
      copy.textContent = "Add the first quest using the form above.";

      emptyState.append(title, copy);
      elements.questList.append(emptyState);
      return;
    }

    state.quests.forEach((quest) => {
      const card = document.createElement("article");
      card.className = "admin-quest-card";

      const meta = document.createElement("div");
      meta.className = "admin-quest-meta";
      meta.append(
        createBadge(quest.category, "quest-label"),
        createBadge(quest.effort, "quest-effort")
      );

      const title = document.createElement("h3");
      title.textContent = quest.quest_text;

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
      card.append(meta, title, actions);
      elements.questList.append(card);
    });
  }

  async function loadQuests() {
    if (!state.session || state.role !== "admin") {
      return;
    }

    setDashboardBusy(true);
    setMessage(elements.dashboardMessage, "Loading database quests…");

    const { data, error } = await client
      .from("quests")
      .select("id, quest_text, category, effort, created_at")
      .order("created_at", { ascending: false });

    setDashboardBusy(false);

    if (error) {
      state.quests = [];
      renderQuests();
      setMessage(
        elements.dashboardMessage,
        "The quests table could not be loaded. Confirm that the SQL setup has been run in Supabase.",
        "error"
      );
      return;
    }

    state.quests = data || [];
    renderQuests();
    setMessage(elements.dashboardMessage);
  }

  async function handleSignIn(event) {
    event.preventDefault();
    setMessage(elements.authMessage);
    setFormBusy(elements.authForm, true);

    const { data, error } = await client.auth.signInWithPassword({
      email: elements.email.value.trim(),
      password: elements.password.value
    });

    setFormBusy(elements.authForm, false);

    if (error) {
      elements.password.value = "";
      elements.password.focus();
      setMessage(elements.authMessage, "Sign-in failed. Check your email and password, then try again.", "error");
      return;
    }

    elements.authForm.reset();
    await applySession(data.session);
  }

  async function handleGoogleSignIn() {
    setMessage(elements.authMessage);
    setFormBusy(elements.authForm, true);

    const { error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: GOOGLE_OAUTH_REDIRECT_URL
      }
    });

    if (error) {
      setFormBusy(elements.authForm, false);
      setMessage(elements.authMessage, "Google sign-in could not be started. Please try again.", "error");
    }
  }

  async function handleSignOut(event) {
    const signOutButton = event.currentTarget;
    signOutButton.disabled = true;
    const { error } = await client.auth.signOut();
    signOutButton.disabled = false;

    if (error) {
      const messageTarget = elements.dashboard.hidden ? elements.accessMessage : elements.dashboardMessage;
      setMessage(messageTarget, "Unable to sign out right now. Please try again.", "error");
      return;
    }

    showSignedOutState();
    setMessage(elements.authMessage, "You have been signed out.", "success");
  }

  async function handleQuestSubmit(event) {
    event.preventDefault();

    if (!state.session || state.role !== "admin" || state.loading) {
      return;
    }

    const questValues = {
      quest_text: elements.questText.value.trim(),
      category: elements.category.value,
      effort: elements.effort.value
    };

    if (!questValues.quest_text || !questValues.category || !questValues.effort) {
      setMessage(elements.dashboardMessage, "Complete all quest fields before saving.", "error");
      return;
    }

    setFormBusy(elements.questForm, true);
    setMessage(
      elements.dashboardMessage,
      state.editingId === null ? "Adding quest…" : "Saving quest changes…"
    );

    const query = state.editingId === null
      ? client.from("quests").insert(questValues)
      : client.from("quests").update(questValues).eq("id", state.editingId);
    const { error } = await query;

    setFormBusy(elements.questForm, false);

    if (error) {
      setMessage(elements.dashboardMessage, "The quest could not be saved. Please try again.", "error");
      return;
    }

    const successMessage = state.editingId === null ? "Quest added to Supabase." : "Quest updated in Supabase.";
    resetEditor();
    await loadQuests();
    setMessage(elements.dashboardMessage, successMessage, "success");
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
    elements.questForm.scrollIntoView({ behavior: "smooth", block: "center" });
    elements.questText.focus({ preventScroll: true });
  }

  async function deleteQuest(quest) {
    const confirmed = window.confirm(`Permanently delete “${quest.quest_text}”?`);

    if (!confirmed) {
      return;
    }

    setDashboardBusy(true);
    setMessage(elements.dashboardMessage, "Deleting quest…");
    const { error } = await client.from("quests").delete().eq("id", quest.id);
    setDashboardBusy(false);

    if (error) {
      setMessage(elements.dashboardMessage, "The quest could not be deleted. Please try again.", "error");
      return;
    }

    if (String(state.editingId) === String(quest.id)) {
      resetEditor();
    }

    await loadQuests();
    setMessage(elements.dashboardMessage, "Quest permanently deleted.", "success");
  }

  async function handleQuestListClick(event) {
    const button = event.target.closest("button[data-action]");

    if (!button || !state.session || state.role !== "admin" || state.loading) {
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

  function bindEvents() {
    elements.authForm.addEventListener("submit", handleSignIn);
    elements.googleSignInButton.addEventListener("click", handleGoogleSignIn);
    elements.signOutButton.addEventListener("click", handleSignOut);
    elements.accessSignOutButton.addEventListener("click", handleSignOut);
    elements.questForm.addEventListener("submit", handleQuestSubmit);
    elements.cancelEdit.addEventListener("click", resetEditor);
    elements.questList.addEventListener("click", handleQuestListClick);
  }

  async function initialize() {
    cacheElements();
    bindEvents();
    client = window.sideQuestSupabase;

    if (!client) {
      elements.authForm.querySelectorAll("input, button").forEach((control) => {
        control.disabled = true;
      });
      setMessage(elements.connectionStatus, "The Supabase client could not be initialized.", "error");
      return;
    }

    const connectionReady = await window.sideQuestSupabaseReady;

    if (!connectionReady) {
      elements.authForm.querySelectorAll("input, button").forEach((control) => {
        control.disabled = true;
      });
      setMessage(elements.connectionStatus, "The quest database connection is unavailable.", "error");
      return;
    }

    setMessage(elements.connectionStatus, "Connected to the SideQuest database.", "success");

    client.auth.onAuthStateChange((_event, session) => {
      window.setTimeout(() => {
        void applySession(session);
      }, 0);
    });

    const { data, error } = await client.auth.getSession();

    if (error) {
      setMessage(elements.authMessage, "Your authentication status could not be checked. Please refresh and try again.", "error");
      showSignedOutState();
      return;
    }

    await applySession(data.session);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    void initialize();
  }
})();
