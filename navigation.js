const navigationToggle = document.querySelector("[data-nav-toggle]");
const navigationPanel = document.querySelector("[data-mobile-nav]");
const navigationHeader = navigationToggle?.closest(".site-header");
const mobileNavigationQuery = window.matchMedia("(max-width: 42rem)");

function setNavigationOpen(isOpen, returnFocus = false) {
  if (!navigationToggle || !navigationPanel) {
    return;
  }

  navigationPanel.dataset.open = String(isOpen);
  navigationToggle.setAttribute("aria-expanded", String(isOpen));
  navigationToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
  );

  if (returnFocus) {
    navigationToggle.focus();
  }
}

navigationToggle?.addEventListener("click", () => {
  const isOpen = navigationToggle.getAttribute("aria-expanded") === "true";
  setNavigationOpen(!isOpen);
});

navigationPanel?.addEventListener("click", (event) => {
  if (event.target instanceof Element && event.target.closest("a")) {
    setNavigationOpen(false);
  }
});

document.addEventListener("click", (event) => {
  const isOpen = navigationToggle?.getAttribute("aria-expanded") === "true";

  if (isOpen && navigationHeader && !navigationHeader.contains(event.target)) {
    setNavigationOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigationToggle?.getAttribute("aria-expanded") === "true") {
    setNavigationOpen(false, true);
  }
});

mobileNavigationQuery.addEventListener("change", (event) => {
  if (!event.matches) {
    setNavigationOpen(false);
  }
});
