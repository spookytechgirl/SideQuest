(() => {
  "use strict";

  const config = window.SIDEQUEST_SUPABASE_CONFIG;
  const sdk = window.supabase;

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

  async function verifySupabaseConnection() {
    try {
      const response = await fetch(`${config.projectUrl}/auth/v1/settings`, {
        headers: {
          apikey: config.publishableKey
        }
      });

      if (!response.ok) {
        throw new Error(`Supabase responded with status ${response.status}.`);
      }

      document.documentElement.dataset.supabaseConnection = "connected";
      console.info("[SideQuest] Supabase connection verified.");
      return true;
    } catch (error) {
      document.documentElement.dataset.supabaseConnection = "error";
      console.error("[SideQuest] Supabase connection check failed.", error);
      return false;
    }
  }

  window.sideQuestSupabaseReady = verifySupabaseConnection();
})();
