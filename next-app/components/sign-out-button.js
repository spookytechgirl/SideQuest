"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/toast-provider";

export default function SignOutButton({ className = "admin-secondary-button" }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isBusy, setIsBusy] = useState(false);

  async function handleSignOut() {
    setIsBusy(true);
    const { error } = await createClient().auth.signOut();

    if (error) {
      setIsBusy(false);
      showToast("Unable to sign out right now. Please try again.", "error");
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      className={className}
      type="button"
      onClick={handleSignOut}
      disabled={isBusy}
      aria-busy={isBusy}
    >
      {isBusy ? "Signing Out…" : "Sign Out"}
    </button>
  );
}
