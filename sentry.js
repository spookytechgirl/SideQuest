(() => {
  "use strict";

  const sdk = window.Sentry;

  if (!sdk || typeof sdk.init !== "function") {
    return;
  }

  const redactSensitiveText = (value) => {
    if (typeof value !== "string") {
      return value;
    }

    return value
      .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[Filtered email]")
      .replace(/\bBearer\s+[A-Z0-9._~-]+\b/gi, "Bearer [Filtered]")
      .replace(/\beyJ[A-Z0-9_-]{8,}\.[A-Z0-9_-]{8,}\.[A-Z0-9_-]{8,}\b/gi, "[Filtered token]")
      .replace(/\bsb_(?:publishable|secret)_[A-Z0-9_-]+\b/gi, "[Filtered Supabase credential]")
      .replace(/\b(password|passwd|access_token|refresh_token|authorization|avatar_url)\s*[:=]\s*[^\s,;]+/gi, "$1=[Filtered]");
  };

  sdk.init({
    dsn: "https://163514fabbcdfe499e026f02b3aa9162@o4511967211618304.ingest.us.sentry.io/4511967240585216",
    environment: window.location.hostname === "side-quest-ochre.vercel.app" ? "production" : "development",
    sendDefaultPii: false,
    sampleRate: 1,
    tracesSampleRate: 0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    enableLogs: false,
    debug: false,
    autoSessionTracking: false,
    maxBreadcrumbs: 0,
    beforeBreadcrumb: () => null,
    beforeSendTransaction: () => null,
    integrations(defaultIntegrations) {
      const disabledIntegrations = new Set([
        "Breadcrumbs",
        "BrowserTracing",
        "CaptureConsole",
        "Replay"
      ]);

      return defaultIntegrations.filter((integration) => !disabledIntegrations.has(integration.name));
    },
    beforeSend(event) {
      delete event.user;
      delete event.request;
      delete event.breadcrumbs;
      delete event.contexts;
      delete event.extra;

      if (event.message) {
        event.message = redactSensitiveText(event.message);
      }

      event.exception?.values?.forEach((exception) => {
        if (exception.value) {
          exception.value = redactSensitiveText(exception.value);
        }
      });

      return event;
    }
  });

  document.documentElement.dataset.sentryMonitoring = "initialized";
})();
