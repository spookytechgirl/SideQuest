"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast-provider";
import { AVATAR_BUCKET, validateAvatar } from "@/lib/profile";
import { createClient } from "@/lib/supabase/client";

const emptyMessage = { text: "", kind: "" };

function getInitials(displayName, email) {
  const words = displayName.trim().split(/\s+/).filter(Boolean);

  if (words.length) {
    return words
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }

  return (email.trim()[0] || "S").toUpperCase();
}

export default function ProfileEditor({
  initialProfile,
  initialMessage = "",
  initialMessageKind = "",
  userEmail,
  userId,
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const supabase = useMemo(() => createClient(), []);
  const fileInputRef = useRef(null);
  const previewUrlRef = useRef("");
  const [profile, setProfile] = useState(initialProfile);
  const [displayName, setDisplayName] = useState(
    initialProfile?.display_name || "",
  );
  const [bio, setBio] = useState(initialProfile?.bio || "");
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageFailed, setImageFailed] = useState(false);
  const [pendingAction, setPendingAction] = useState("");
  const [message, setMessage] = useState(
    initialMessage
      ? { text: initialMessage, kind: initialMessageKind }
      : emptyMessage,
  );

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const isBusy = Boolean(pendingAction);
  const initials = getInitials(displayName, userEmail);
  const avatarSource = previewUrl || profile?.avatar_url || "";
  const showAvatarImage = Boolean(avatarSource) && !imageFailed;
  const avatarLabel = displayName.trim()
    ? `${displayName.trim()}'s avatar preview`
    : "SideQuest avatar preview";

  function clearPreviewUrl() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = "";
    }

    setPreviewUrl("");
  }

  function handleAvatarSelection(event) {
    const [file] = event.target.files;
    setMessage(emptyMessage);

    if (!file) {
      setSelectedAvatar(null);
      clearPreviewUrl();
      setImageFailed(false);
      return;
    }

    const validationMessage = validateAvatar(file);

    if (validationMessage) {
      event.target.value = "";
      setSelectedAvatar(null);
      clearPreviewUrl();
      setImageFailed(false);
      setMessage({ text: validationMessage, kind: "error" });
      showToast(validationMessage, "error");
      event.target.focus();
      return;
    }

    clearPreviewUrl();
    const nextPreviewUrl = URL.createObjectURL(file);
    previewUrlRef.current = nextPreviewUrl;
    setPreviewUrl(nextPreviewUrl);
    setSelectedAvatar(file);
    setImageFailed(false);
    setMessage({
      text: "Avatar selected. Save changes to upload it.",
      kind: "",
    });
  }

  async function uploadAvatar(file, authenticatedUserId) {
    const objectPath = `${authenticatedUserId}/avatar`;
    const { error } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(objectPath, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from(AVATAR_BUCKET)
      .getPublicUrl(objectPath);

    if (!data?.publicUrl) {
      throw new Error("Supabase did not return a public avatar URL.");
    }

    return `${data.publicUrl}?v=${Date.now()}`;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const normalizedDisplayName = displayName.trim();
    const normalizedBio = bio.trim();

    if (normalizedDisplayName.length > 80) {
      setMessage({
        text: "Keep your display name to 80 characters or fewer.",
        kind: "error",
      });
      return;
    }

    if (normalizedBio.length > 280) {
      setMessage({
        text: "Keep your bio to 280 characters or fewer.",
        kind: "error",
      });
      return;
    }

    if (selectedAvatar) {
      const validationMessage = validateAvatar(selectedAvatar);

      if (validationMessage) {
        setMessage({ text: validationMessage, kind: "error" });
        showToast(validationMessage, "error");
        return;
      }
    }

    setPendingAction("save");
    setMessage({
      text: selectedAvatar
        ? "Uploading your avatar…"
        : "Saving your profile…",
      kind: "",
    });

    try {
      const avatarWasUploaded = Boolean(selectedAvatar);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user || user.id !== userId) {
        router.replace("/login?next=%2Fprofile");
        router.refresh();
        return;
      }

      let avatarUrl = profile?.avatar_url || null;

      if (selectedAvatar) {
        avatarUrl = await uploadAvatar(selectedAvatar, user.id);
        setMessage({
          text: "Avatar uploaded. Saving your profile…",
          kind: "",
        });
      }

      const { data, error } = await supabase
        .from("profiles")
        .upsert(
          {
            user_id: user.id,
            display_name: normalizedDisplayName || null,
            bio: normalizedBio || null,
            avatar_url: avatarUrl,
          },
          { onConflict: "user_id" },
        )
        .select("user_id, display_name, bio, avatar_url, updated_at")
        .single();

      if (error) {
        throw error;
      }

      setProfile(data);
      setDisplayName(data.display_name || "");
      setBio(data.bio || "");
      setSelectedAvatar(null);
      clearPreviewUrl();
      setImageFailed(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setMessage({
        text: "Profile saved! Your adventure identity is up to date.",
        kind: "success",
      });
      showToast(
        avatarWasUploaded
          ? "Avatar uploaded and profile saved."
          : "Profile saved successfully.",
      );
    } catch {
      const text =
        "Your profile could not be saved. Please check the profile and avatar setup, then try again.";
      setMessage({
        text,
        kind: "error",
      });
      showToast(text, "error");
    } finally {
      setPendingAction("");
    }
  }

  async function handleSignOut() {
    setPendingAction("signout");
    setMessage({ text: "Signing out…", kind: "" });
    const { error } = await supabase.auth.signOut();

    if (error) {
      setPendingAction("");
      setMessage({
        text: "Unable to sign out right now. Please try again.",
        kind: "error",
      });
      showToast("Unable to sign out right now. Please try again.", "error");
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  return (
    <section
      className="info-surface profile-dashboard"
      aria-labelledby="profile-editor-title"
    >
      <div className="profile-account-bar">
        <div>
          <p className="info-kicker">Signed-in adventurer</p>
          <h2 id="profile-editor-title">Edit your profile</h2>
          <p className="profile-account-email">
            Signed in as <strong>{userEmail || "authenticated user"}</strong>
          </p>
        </div>
        <button
          className="admin-secondary-button profile-sign-out"
          type="button"
          onClick={handleSignOut}
          disabled={isBusy}
        >
          {pendingAction === "signout" ? "Signing Out…" : "Sign Out"}
        </button>
      </div>

      <form className="profile-form" onSubmit={handleSubmit} aria-busy={isBusy}>
        <div className="profile-avatar-editor">
          <div
            className="profile-avatar-frame"
            role="img"
            aria-label={avatarLabel}
          >
            {showAvatarImage ? (
              <Image
                src={avatarSource}
                width={128}
                height={128}
                alt=""
                unoptimized
                onError={() => setImageFailed(true)}
              />
            ) : (
              <span className="profile-avatar-placeholder" aria-hidden="true">
                {initials}
              </span>
            )}
          </div>

          <div className="profile-avatar-copy">
            <h3>Adventure avatar</h3>
            <p>Choose a PNG, JPEG, or WebP image up to 2 MB.</p>
            <div className="suggestion-field">
              <label htmlFor="profile-avatar-input">
                Upload or replace avatar
              </label>
              <input
                className="profile-file-input"
                id="profile-avatar-input"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                aria-describedby="profile-avatar-help"
                onChange={handleAvatarSelection}
                ref={fileInputRef}
                disabled={isBusy}
              />
              <span className="profile-field-help" id="profile-avatar-help">
                Your image is uploaded only when you save changes.
              </span>
            </div>
          </div>
        </div>

        <div className="profile-fields">
          <div className="suggestion-field">
            <label htmlFor="profile-display-name">Display name</label>
            <input
              id="profile-display-name"
              type="text"
              autoComplete="nickname"
              maxLength={80}
              placeholder="How should SideQuest greet you?"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              disabled={isBusy}
            />
          </div>

          <div className="suggestion-field profile-email-field">
            <label htmlFor="profile-email">
              Email address <span>read-only</span>
            </label>
            <input
              id="profile-email"
              type="email"
              value={userEmail}
              readOnly
              aria-readonly="true"
            />
          </div>

          <div className="suggestion-field profile-bio-field">
            <label htmlFor="profile-bio">
              Short bio <span>up to 280 characters</span>
            </label>
            <textarea
              id="profile-bio"
              maxLength={280}
              placeholder="Share the kind of tiny adventures you enjoy."
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              disabled={isBusy}
            />
          </div>
        </div>

        <button
          className="quiz-submit profile-save-button"
          type="submit"
          disabled={isBusy}
        >
          <span>{pendingAction === "save" ? "Saving…" : "Save Changes"}</span>
          <span aria-hidden="true">→</span>
        </button>
      </form>

      <p
        className="admin-message profile-message"
        data-kind={message.kind || undefined}
        role={message.kind === "error" ? "alert" : "status"}
        aria-live={message.kind === "error" ? "assertive" : "polite"}
        hidden={!message.text}
      >
        {message.text}
      </p>
    </section>
  );
}
