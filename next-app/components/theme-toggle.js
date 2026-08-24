"use client";

import { useEffect, useRef, useState } from "react";

const storageKey = "sidequest-theme";

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");
  const hasSavedTheme = useRef(false);

  useEffect(() => {
    let isMounted = true;
    let savedTheme = null;

    try {
      const storedTheme = window.localStorage.getItem(storageKey);
      savedTheme = storedTheme === "light" || storedTheme === "dark" ? storedTheme : null;
    } catch {
      savedTheme = null;
    }

    hasSavedTheme.current = savedTheme !== null;
    const initialTheme =
      document.documentElement.dataset.theme || savedTheme || getSystemTheme();

    applyTheme(initialTheme);
    queueMicrotask(() => {
      if (isMounted) {
        setTheme(initialTheme);
      }
    });

    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (event) => {
      if (!hasSavedTheme.current) {
        const nextTheme = event.matches ? "dark" : "light";
        applyTheme(nextTheme);
        setTheme(nextTheme);
      }
    };

    systemTheme.addEventListener("change", handleSystemThemeChange);
    return () => {
      isMounted = false;
      systemTheme.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  const nextTheme = theme === "dark" ? "light" : "dark";
  const actionLabel = `Switch to ${nextTheme} mode`;

  const handleToggle = () => {
    try {
      window.localStorage.setItem(storageKey, nextTheme);
      hasSavedTheme.current = true;
    } catch {
      hasSavedTheme.current = false;
    }

    applyTheme(nextTheme);
    setTheme(nextTheme);
  };

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={actionLabel}
      title={actionLabel}
      data-current-theme={theme}
      onClick={handleToggle}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {nextTheme === "light" ? "☀" : "☾"}
      </span>
      <span className="theme-toggle-label">
        {nextTheme === "light" ? "Light" : "Dark"}
      </span>
    </button>
  );
}
