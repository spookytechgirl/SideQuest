const suggestionForm = document.querySelector("#suggestion-form");
const suggestionIdea = document.querySelector("#suggestion-idea");
const suggestionSuccess = document.querySelector("#suggestion-success");

suggestionForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!suggestionIdea.value.trim()) {
    suggestionIdea.setCustomValidity("Please share a SideQuest idea.");
    suggestionIdea.reportValidity();
    suggestionSuccess.hidden = true;
    return;
  }

  suggestionIdea.setCustomValidity("");
  suggestionForm.reset();
  suggestionSuccess.hidden = false;
});

suggestionIdea?.addEventListener("input", () => {
  suggestionIdea.setCustomValidity("");
  suggestionSuccess.hidden = true;
});
