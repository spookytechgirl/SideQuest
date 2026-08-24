(() => {
  "use strict";

  const AVATAR_BUCKET = "avatars";
  const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
  const ALLOWED_AVATAR_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

  const state = {
    session: null,
    profile: null,
    selectedAvatar: null,
    previewUrl: "",
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

  function cacheElements() {
    elements.form = document.querySelector("#profile-form");
    elements.displayName = document.querySelector("#profile-display-name");
    elements.email = document.querySelector("#profile-email");
    elements.bio = document.querySelector("#profile-bio");
    elements.avatarInput = document.querySelector("#profile-avatar-input");
    elements.avatarFrame = document.querySelector("#profile-avatar-frame");
    elements.avatarImage = document.querySelector("#profile-avatar-image");
    elements.avatarPlaceholder = document.querySelector("#profile-avatar-placeholder");
    elements.accountEmail = document.querySelector("#profile-account-email");
    elements.saveButton = document.querySelector("#profile-save-button");
    elements.signOutButton = document.querySelector("#profile-sign-out-button");
    elements.message = document.querySelector("#profile-message");
  }

  function setMessage(message = "", kind = "") {
    elements.message.textContent = message;
    elements.message.dataset.kind = kind;
    elements.message.hidden = !message;
  }

  function setFormBusy(isBusy) {
    elements.form.setAttribute("aria-busy", String(isBusy));
    elements.form.querySelectorAll("input, textarea, button").forEach((control) => {
      control.disabled = isBusy;
    });
  }

  function getInitials(displayName, email) {
    const words = displayName.trim().split(/\s+/).filter(Boolean);

    if (words.length > 0) {
      return words.slice(0, 2).map((word) => word[0]).join("").toUpperCase();
    }

    return (email.trim()[0] || "S").toUpperCase();
  }

  function clearPreviewUrl() {
    if (state.previewUrl) {
      URL.revokeObjectURL(state.previewUrl);
      state.previewUrl = "";
    }
  }

  function showAvatar(url, displayName = "", email = "") {
    const initials = getInitials(displayName, email);
    elements.avatarPlaceholder.textContent = initials;
    elements.avatarFrame.setAttribute(
      "aria-label",
      displayName ? `${displayName}'s avatar preview` : "SideQuest avatar preview"
    );

    if (url) {
      elements.avatarImage.src = url;
      elements.avatarImage.hidden = false;
      elements.avatarPlaceholder.hidden = true;
      return;
    }

    elements.avatarImage.removeAttribute("src");
    elements.avatarImage.hidden = true;
    elements.avatarPlaceholder.hidden = false;
  }

  function renderProfile(profile, session) {
    const displayName = profile?.display_name || "";
    const bio = profile?.bio || "";
    const avatarUrl = profile?.avatar_url || "";
    const email = session.user.email || "";

    elements.displayName.value = displayName;
    elements.bio.value = bio;
    elements.email.value = email;
    elements.accountEmail.textContent = email || "authenticated user";
    showAvatar(avatarUrl, displayName, email);
  }

  function clearProfileState() {
    state.requestId += 1;
    state.session = null;
    state.profile = null;
    state.selectedAvatar = null;
    clearPreviewUrl();
    elements.form.reset();
    elements.email.value = "";
    elements.accountEmail.textContent = "";
    showAvatar("", "", "");
    setMessage();
  }

  function validateAvatar(file) {
    if (!ALLOWED_AVATAR_TYPES.has(file.type)) {
      return "Choose a PNG, JPEG, or WebP image.";
    }

    if (file.size > AVATAR_MAX_BYTES) {
      return "Choose an avatar smaller than 2 MB.";
    }

    return "";
  }

  async function loadProfile(session) {
    const requestId = ++state.requestId;
    setFormBusy(true);
    setMessage("Loading your profile…");

    const { data, error } = await client
      .from("profiles")
      .select("user_id, display_name, bio, avatar_url, updated_at")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (requestId !== state.requestId) {
      return;
    }

    setFormBusy(false);

    if (error) {
      state.profile = null;
      renderProfile(null, session);
      setMessage(
        "Your profile could not be loaded. Confirm that the profile SQL has been run in Supabase.",
        "error"
      );
      return;
    }

    state.profile = data || null;
    renderProfile(state.profile, session);
    setMessage(data ? "" : "Your profile is ready to personalize.");
  }

  async function applySession(session) {
    const previousUserId = state.session?.user?.id || null;
    const nextUserId = session?.user?.id || null;
    state.session = session;

    if (!session?.user) {
      clearProfileState();
      return;
    }

    elements.email.value = session.user.email || "";
    elements.accountEmail.textContent = session.user.email || "authenticated user";

    if (previousUserId !== nextUserId || state.profile === null) {
      await loadProfile(session);
    }
  }

  function handleAvatarSelection() {
    const [file] = elements.avatarInput.files;
    setMessage();

    if (!file) {
      state.selectedAvatar = null;
      clearPreviewUrl();
      showAvatar(
        state.profile?.avatar_url || "",
        elements.displayName.value,
        state.session?.user?.email || ""
      );
      return;
    }

    const validationMessage = validateAvatar(file);

    if (validationMessage) {
      elements.avatarInput.value = "";
      state.selectedAvatar = null;
      clearPreviewUrl();
      showAvatar(
        state.profile?.avatar_url || "",
        elements.displayName.value,
        state.session?.user?.email || ""
      );
      setMessage(validationMessage, "error");
      elements.avatarInput.focus();
      return;
    }

    state.selectedAvatar = file;
    clearPreviewUrl();
    state.previewUrl = URL.createObjectURL(file);
    showAvatar(
      state.previewUrl,
      elements.displayName.value,
      state.session?.user?.email || ""
    );
    setMessage("Avatar selected. Save changes to upload it.");
  }

  async function uploadAvatar(file, userId) {
    const objectPath = `${userId}/avatar`;
    const { error } = await client.storage
      .from(AVATAR_BUCKET)
      .upload(objectPath, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: true
      });

    if (error) {
      throw error;
    }

    const { data } = client.storage.from(AVATAR_BUCKET).getPublicUrl(objectPath);

    if (!data?.publicUrl) {
      throw new Error("Supabase did not return a public avatar URL.");
    }

    return `${data.publicUrl}?v=${Date.now()}`;
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();

    if (!state.session?.user) {
      return;
    }

    const displayName = elements.displayName.value.trim();
    const bio = elements.bio.value.trim();
    let avatarUrl = state.profile?.avatar_url || null;

    if (state.selectedAvatar) {
      const validationMessage = validateAvatar(state.selectedAvatar);

      if (validationMessage) {
        setMessage(validationMessage, "error");
        return;
      }
    }

    setFormBusy(true);
    elements.signOutButton.disabled = true;
    setMessage(state.selectedAvatar ? "Uploading your avatar…" : "Saving your profile…");

    try {
      if (state.selectedAvatar) {
        avatarUrl = await uploadAvatar(state.selectedAvatar, state.session.user.id);
        setMessage("Avatar uploaded. Saving your profile…");
      }

      const profileValues = {
        user_id: state.session.user.id,
        display_name: displayName || null,
        bio: bio || null,
        avatar_url: avatarUrl
      };

      const { data, error } = await client
        .from("profiles")
        .upsert(profileValues, { onConflict: "user_id" })
        .select("user_id, display_name, bio, avatar_url, updated_at")
        .single();

      if (error) {
        throw error;
      }

      state.profile = data;
      state.selectedAvatar = null;
      elements.avatarInput.value = "";
      clearPreviewUrl();
      renderProfile(data, state.session);
      setMessage("Profile saved! Your adventure identity is up to date.", "success");
    } catch (error) {
      console.error("[SideQuest] Profile save failed.", error);
      setMessage(
        "Your profile could not be saved. Check the Supabase profile and avatar setup, then try again.",
        "error"
      );
    } finally {
      setFormBusy(false);
      elements.signOutButton.disabled = false;
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

    clearProfileState();
  }

  function handleAvatarError() {
    showAvatar("", elements.displayName.value, state.session?.user?.email || "");
  }

  function bindEvents() {
    elements.form.addEventListener("submit", handleProfileSubmit);
    elements.avatarInput.addEventListener("change", handleAvatarSelection);
    elements.displayName.addEventListener("input", () => {
      if (!elements.avatarImage.hidden) {
        elements.avatarFrame.setAttribute(
          "aria-label",
          elements.displayName.value.trim()
            ? `${elements.displayName.value.trim()}'s avatar preview`
            : "SideQuest avatar preview"
        );
      } else {
        elements.avatarPlaceholder.textContent = getInitials(
          elements.displayName.value,
          state.session?.user?.email || ""
        );
      }
    });
    elements.avatarImage.addEventListener("error", handleAvatarError);
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
      setMessage("Profile editing is unavailable because the Supabase client could not be initialized.", "error");
      return;
    }

    client.auth.onAuthStateChange(handleAuthStateChange);

    const connectionReady = await window.sideQuestSupabaseReady;

    if (!connectionReady) {
      initialSessionResolved = true;
      setFormBusy(true);
      setMessage("Profile editing is temporarily unavailable. Please refresh and try again.", "error");
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
