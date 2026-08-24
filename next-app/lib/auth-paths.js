const APP_ORIGIN = "https://sidequest.local";

export function getSafeReturnPath(value, fallback = "/") {
  if (typeof value !== "string" || !value.startsWith("/")) {
    return fallback;
  }

  try {
    const destination = new URL(value, APP_ORIGIN);

    if (destination.origin !== APP_ORIGIN) {
      return fallback;
    }

    return `${destination.pathname}${destination.search}${destination.hash}`;
  } catch {
    return fallback;
  }
}

export function getLoginPath(returnTo) {
  const destination = getSafeReturnPath(returnTo, "/");
  return `/login?next=${encodeURIComponent(destination)}`;
}
