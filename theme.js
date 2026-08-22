(() => {
  const THEME_STORAGE_KEY = "sidequest-theme";
  const root = document.documentElement;
  const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function readSavedTheme() {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      return savedTheme === "light" || savedTheme === "dark" ? savedTheme : null;
    } catch {
      return null;
    }
  }

  function getSystemTheme() {
    return systemThemeQuery.matches ? "dark" : "light";
  }

  let hasSavedTheme = readSavedTheme() !== null;

  function updateToggle(theme) {
    const toggle = document.querySelector("[data-theme-toggle]");

    if (!toggle) {
      return;
    }

    const nextTheme = theme === "dark" ? "light" : "dark";
    const icon = toggle.querySelector("[data-theme-icon]");
    const label = toggle.querySelector("[data-theme-label]");
    const actionLabel = `Switch to ${nextTheme} mode`;

    toggle.setAttribute("aria-label", actionLabel);
    toggle.setAttribute("title", actionLabel);
    toggle.dataset.currentTheme = theme;

    if (icon) {
      icon.textContent = nextTheme === "light" ? "☀" : "☾";
    }

    if (label) {
      label.textContent = nextTheme === "light" ? "Light" : "Dark";
    }
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    updateToggle(theme);
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      hasSavedTheme = true;
    } catch {
      hasSavedTheme = false;
    }
  }

  const initialTheme = readSavedTheme() || getSystemTheme();
  applyTheme(initialTheme);

  function initializeToggle() {
    const toggle = document.querySelector("[data-theme-toggle]");

    if (!toggle) {
      return;
    }

    updateToggle(root.dataset.theme || initialTheme);

    toggle.addEventListener("click", () => {
      const currentTheme = root.dataset.theme || getSystemTheme();
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      saveTheme(nextTheme);
      applyTheme(nextTheme);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeToggle, { once: true });
  } else {
    initializeToggle();
  }

  const handleSystemThemeChange = (event) => {
    if (!hasSavedTheme) {
      applyTheme(event.matches ? "dark" : "light");
    }
  };

  if (typeof systemThemeQuery.addEventListener === "function") {
    systemThemeQuery.addEventListener("change", handleSystemThemeChange);
  } else {
    systemThemeQuery.addListener(handleSystemThemeChange);
  }
})();
