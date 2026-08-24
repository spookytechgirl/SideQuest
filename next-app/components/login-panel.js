"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSafeReturnPath } from "@/lib/auth-paths";
import { createClient } from "@/lib/supabase/client";

const emptyMessage = { text: "", kind: "" };

export default function LoginPanel({
  initialSignedIn = false,
  initialError = "",
  returnTo = "/login",
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [isSignedIn, setIsSignedIn] = useState(initialSignedIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingAction, setPendingAction] = useState("");
  const [message, setMessage] = useState(
    initialError ? { text: initialError, kind: "error" } : emptyMessage,
  );

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsSignedIn(Boolean(session?.user));
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const isBusy = Boolean(pendingAction);
  const safeReturnTo = getSafeReturnPath(returnTo, "/login");

  async function handleEmailSignIn(event) {
    event.preventDefault();
    setMessage(emptyMessage);
    setPendingAction("email");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setPendingAction("");

    if (error) {
      setPassword("");
      setMessage({
        text: "Sign-in failed. Check your email and password, then try again.",
        kind: "error",
      });
      return;
    }

    setEmail("");
    setPassword("");
    setIsSignedIn(Boolean(data.user));
    setMessage({
      text: "You are signed in and ready for your next quest.",
      kind: "success",
    });

    if (safeReturnTo !== "/login") {
      router.replace(safeReturnTo);
    } else {
      router.refresh();
    }
  }

  async function handleGoogleSignIn() {
    setMessage(emptyMessage);
    setPendingAction("google");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeReturnTo)}`,
      },
    });

    if (error) {
      setPendingAction("");
      setMessage({
        text: "Google sign-in could not be started. Please try again.",
        kind: "error",
      });
    }
  }

  async function handleSignOut() {
    setMessage(emptyMessage);
    setPendingAction("signout");

    const { error } = await supabase.auth.signOut();
    setPendingAction("");

    if (error) {
      setMessage({
        text: "Unable to sign out right now. Please try again.",
        kind: "error",
      });
      return;
    }

    setIsSignedIn(false);
    setMessage({ text: "You have been signed out.", kind: "success" });
    router.refresh();
  }

  return (
    <>
      <p className="info-kicker">Your SideQuest account</p>
      <h2>{isSignedIn ? "You’re signed in." : "Sign in to continue."}</h2>
      <p className="login-panel-copy">
        {isSignedIn
          ? "Your Supabase session is active in the Next.js app."
          : "Use the same SideQuest account you already know. No new account is required."}
      </p>

      {isSignedIn ? (
        <div className="login-signed-in-actions">
          <div className="login-session-status" role="status">
            <span aria-hidden="true">✓</span>
            Authenticated session detected
          </div>
          <button
            className="admin-secondary-button login-sign-out"
            type="button"
            onClick={handleSignOut}
            disabled={isBusy}
          >
            {pendingAction === "signout" ? "Signing out…" : "Sign Out"}
          </button>
        </div>
      ) : (
        <form className="admin-form login-form" onSubmit={handleEmailSignIn} aria-busy={isBusy}>
          <div className="suggestion-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={isBusy}
            />
          </div>

          <div className="suggestion-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={isBusy}
            />
          </div>

          <button className="quiz-submit" type="submit" disabled={isBusy}>
            <span>{pendingAction === "email" ? "Signing In…" : "Sign In"}</span>
            <span aria-hidden="true">→</span>
          </button>

          <div className="admin-auth-divider" aria-hidden="true">
            <span>or</span>
          </div>

          <button
            className="admin-google-button"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isBusy}
          >
            <span className="admin-google-mark" aria-hidden="true">G</span>
            {pendingAction === "google" ? "Opening Google…" : "Continue with Google"}
          </button>
        </form>
      )}

      <p
        className="admin-message login-message"
        data-kind={message.kind || undefined}
        role={message.kind === "error" ? "alert" : "status"}
        aria-live={message.kind === "error" ? "assertive" : "polite"}
        hidden={!message.text}
      >
        {message.text}
      </p>
    </>
  );
}
