export const REMIX_STYLES = [
  { value: "easier", label: "Easier" },
  { value: "more-adventurous", label: "More adventurous" },
  { value: "indoor", label: "Indoor" },
  { value: "outdoor", label: "Outdoor" },
  { value: "more-creative", label: "More creative" },
  { value: "lower-energy", label: "Lower energy" },
];

export const REMIX_STYLE_VALUES = REMIX_STYLES.map(({ value }) => value);

export function isAllowedRemixStyle(value) {
  return REMIX_STYLE_VALUES.includes(value);
}

export function getRemixStyleLabel(value) {
  return REMIX_STYLES.find((style) => style.value === value)?.label || "";
}

function getEasierEffort(effort) {
  return effort === "Quick" ? "Quick" : "Easy";
}

export function createRemixedQuest(originalQuest, title, style) {
  const remixedQuest = { ...originalQuest, title };

  if (style === "more-adventurous") {
    remixedQuest.effort = "Adventure";
  }

  if (style === "easier" || style === "lower-energy") {
    remixedQuest.effort = getEasierEffort(originalQuest.effort);
  }

  if (style === "outdoor") {
    remixedQuest.category = "Outdoors";
  }

  if (style === "more-creative") {
    remixedQuest.category = "Creative";
  }

  if (
    style === "indoor" &&
    !["Creative", "Food", "Relaxing"].includes(originalQuest.category)
  ) {
    remixedQuest.category = "Random";
  }

  return remixedQuest;
}
