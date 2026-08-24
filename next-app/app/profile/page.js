import BrandLink from "@/components/brand-link";
import PageShell from "@/components/page-shell";
import ProfileEditor from "@/components/profile-editor";
import { requireUser } from "@/lib/auth";
import { createPrivateMetadata } from "@/lib/social-metadata";

export const metadata = createPrivateMetadata({
  title: "Profile",
  description: "Update your SideQuest profile and adventure avatar.",
  path: "/profile",
});

export default async function ProfilePage() {
  const { supabase, user } = await requireUser("/profile");
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("user_id, display_name, bio, avatar_url, updated_at")
    .eq("user_id", user.id)
    .maybeSingle();

  const initialMessage = error
    ? "Your profile could not be loaded. Please confirm the existing Supabase profile setup."
    : profile
      ? ""
      : "Your profile is ready to personalize.";

  return (
    <PageShell shellClassName="profile-shell" pageClassName="profile-page">
      <BrandLink />

      <p className="eyebrow">Your trail identity</p>
      <h1 id="page-title" className="info-page-title profile-title">
        Your
        <br />
        <span>Profile.</span>
      </h1>
      <p className="intro profile-intro">
        A small corner of SideQuest that feels like you.
      </p>

      <ProfileEditor
        initialProfile={profile}
        initialMessage={initialMessage}
        initialMessageKind={error ? "error" : ""}
        userEmail={user.email || ""}
        userId={user.id}
      />
    </PageShell>
  );
}
