(() => {
  "use strict";

  const config = window.SIDEQUEST_SUPABASE_CONFIG;
  const sdk = window.supabase;

  if (window.sideQuestSupabase) {
    window.sideQuestSupabaseReady ??= Promise.resolve(true);
    return;
  }

  if (!config?.projectUrl || !config?.publishableKey) {
    console.error("[SideQuest] Supabase public configuration is missing.");
    return;
  }

  if (!sdk || typeof sdk.createClient !== "function") {
    console.error("[SideQuest] The Supabase JavaScript client could not be loaded.");
    return;
  }

  const client = sdk.createClient(config.projectUrl, config.publishableKey);
  window.sideQuestSupabase = client;
  document.documentElement.dataset.supabaseConnection = "initialized";
  window.sideQuestSupabaseReady = Promise.resolve(true);
})();
