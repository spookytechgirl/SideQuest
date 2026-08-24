(() => {
  "use strict";

  const gate = document.querySelector("[data-auth-gate]");
  const protectedContent = document.querySelector("[data-protected-content]");

  if (!gate || !protectedContent) {
    return;
  }

  const elements = {
    loading: gate.querySelector("[data-auth-loading]"),
    required: gate.querySelector("[data-auth-required]"),
    form: gate.querySelector("[data-auth-form]"),
    email: gate.querySelector("[data-auth-email]"),
    password: gate.querySelector("[data-auth-password]"),
    googleButton: gate.querySelector("[data-auth-google]"),
    message: gate.querySelector("[data-auth-message]")
  };

  let client;
  let initialSessionResolved = false;
  let latestAuthSession = null;
  let resolveInitialAuthEvent;
  let resolveSharedAuth;
  let sharedAuthResolved = false;

  const initialAuthEvent = new Promise((resolve) => {
    resolveInitialAuthEvent = resolve;
  });

  window.sideQuestAuthReady = new Promise((resolve) => {
    resolveSharedAuth = resolve;
  });

  function resolveSharedAuthState(session, error = null) {
    if (sharedAuthResolved) {
      return;
    }

    sharedAuthResolved = true;
    resolveSharedAuth({ session, error });
  }

  function announceAuthChange(session) {
    window.dispatchEvent(new CustomEvent("sidequest:authchange", {
      detail: { session }
    }));
  }

  function setMessage(message = "", kind = "") {
    elements.message.textContent = message;
    elements.message.dataset.kind = kind;
    elements.message.hidden = !message;
  }

  function setFormBusy(isBusy) {
    elements.form.setAttribute("aria-busy", String(isBusy));
    elements.form.querySelectorAll("input, button").forEach((control) => {
      control.disabled = isBusy;
    });
  }

  function showAuthenticatedState() {
    gate.hidden = true;
    elements.loading.hidden = true;
    elements.required.hidden = true;
    protectedContent.hidden = false;
    document.documentElement.dataset.authState = "authenticated";
    setMessage();
  }

  function showSignedOutState(message = "", kind = "") {
    protectedContent.hidden = true;
    gate.hidden = false;
    elements.loading.hidden = true;
    elements.required.hidden = false;
    document.documentElement.dataset.authState = "signed-out";
    setMessage(message, kind);
  }

  function showConnectionError(message) {
    showSignedOutState(message, "error");
    setFormBusy(true);
  }

  function getRedirectUrl() {
    return `${window.location.origin}${window.location.pathname}`;
  }

  async function handleEmailSignIn(event) {
    event.preventDefault();
    setMessage();
    setFormBusy(true);

    const { data, error } = await client.auth.signInWithPassword({
      email: elements.email.value.trim(),
      password: elements.password.value
    });

    setFormBusy(false);

    if (error) {
      elements.password.value = "";
      elements.password.focus();
      setMessage("Sign-in failed. Check your email and password, then try again.", "error");
      return;
    }

    elements.form.reset();
    showAuthenticatedState(data.session);
  }

  async function handleGoogleSignIn() {
    setMessage();
    setFormBusy(true);

    const { error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getRedirectUrl()
      }
    });

    if (error) {
      setFormBusy(false);
      setMessage("Google sign-in could not be started. Please try again.", "error");
    }
  }

  function applySession(session) {
    if (session?.user) {
      showAuthenticatedState();
    } else {
      showSignedOutState();
    }
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
      applySession(session);
      announceAuthChange(session);
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
    elements.form.addEventListener("submit", handleEmailSignIn);
    elements.googleButton.addEventListener("click", handleGoogleSignIn);

    client = window.sideQuestSupabase;

    if (!client) {
      initialSessionResolved = true;
      resolveSharedAuthState(null, new Error("Supabase client initialization failed."));
      showConnectionError("Sign-in is unavailable because the Supabase client could not be initialized.");
      return;
    }

    client.auth.onAuthStateChange(handleAuthStateChange);

    const connectionReady = await window.sideQuestSupabaseReady;

    if (!connectionReady) {
      initialSessionResolved = true;
      resolveSharedAuthState(null, new Error("Supabase connection initialization failed."));
      showConnectionError("Sign-in is temporarily unavailable. Please refresh and try again.");
      return;
    }

    const { session, error } = await resolveExistingSession();
    initialSessionResolved = true;

    if (error) {
      resolveSharedAuthState(null, error);
      showSignedOutState("Your sign-in status could not be checked. Please refresh and try again.", "error");
      return;
    }

    applySession(session);
    resolveSharedAuthState(session);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    void initialize();
  }
})();
