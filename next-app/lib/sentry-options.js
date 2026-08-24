const REDACTED = "[Filtered]";
export const SENTRY_DSN =
  "https://163514fabbcdfe499e026f02b3aa9162@o4511967211618304.ingest.us.sentry.io/4511967240585216";
const SENSITIVE_TEXT = [
  /Bearer\s+[A-Za-z0-9._~-]+/gi,
  /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,
  /sb_(?:publishable|secret)_[A-Za-z0-9_-]+/gi,
  /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,
];

function redactText(value) {
  if (typeof value !== "string") {
    return value;
  }

  return SENSITIVE_TEXT.reduce(
    (text, pattern) => text.replace(pattern, REDACTED),
    value,
  );
}

export function sanitizeSentryEvent(event) {
  delete event.user;
  delete event.request;
  delete event.breadcrumbs;
  delete event.contexts;
  delete event.extra;

  if (event.message) {
    event.message = redactText(event.message);
  }

  if (typeof event.transaction === "string") {
    event.transaction = redactText(event.transaction.split("?")[0]);
  }

  event.exception?.values?.forEach((exception) => {
    if (exception.value) {
      exception.value = redactText(exception.value);
    }
  });

  return event;
}

export function getSentryOptions(dsn) {
  return {
    dsn,
    sendDefaultPii: false,
    enableLogs: false,
    autoSessionTracking: false,
    sendClientReports: false,
    tracesSampleRate: 0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    integrations(defaultIntegrations) {
      const disabled = new Set([
        "Breadcrumbs",
        "BrowserTracing",
        "CaptureConsole",
        "Replay",
      ]);
      return defaultIntegrations.filter(
        (integration) => !disabled.has(integration.name),
      );
    },
    beforeSend: sanitizeSentryEvent,
  };
}
