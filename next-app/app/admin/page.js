import AdminDashboard from "@/components/admin-dashboard";
import BrandLink from "@/components/brand-link";
import PageShell from "@/components/page-shell";
import SignOutButton from "@/components/sign-out-button";
import { getViewerContext, requireUser } from "@/lib/auth";
import { createPrivateMetadata } from "@/lib/social-metadata";

export const metadata = createPrivateMetadata({
  title: "Quest Admin",
  description: "Authorized SideQuest administrators can manage the shared quest catalog.",
  path: "/admin",
});

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireUser("/admin");
  const { supabase, user, role, roleError } = await getViewerContext();
  const isAdmin = role === "admin";

  let quests = [];
  let loadError = "";

  if (isAdmin) {
    const { data, error } = await supabase
      .from("quests")
      .select("id, quest_text, category, effort, created_at")
      .order("created_at", { ascending: false });

    quests = data || [];
    loadError = error
      ? "The quest catalog could not be loaded. Please try again."
      : "";
  }

  return (
    <PageShell shellClassName="admin-shell" pageClassName="admin-page">
      <BrandLink />

      <p className="eyebrow">Private quest desk</p>
      <h1 id="page-title" className="info-page-title">
        Quest<br /><span>Admin.</span>
      </h1>
      <p className="intro admin-intro">
        Add, revise, and organize the quests stored in Supabase.
      </p>

      {isAdmin ? (
        <AdminDashboard
          initialError={loadError}
          initialQuests={quests}
          userEmail={user.email || ""}
          userId={user.id}
        />
      ) : (
        <section className="info-surface admin-access-panel" aria-labelledby="admin-access-title">
          <p className="info-kicker">Admin access required</p>
          <h2 id="admin-access-title">This quest desk is for admins.</h2>
          <p>Your account is signed in, but it does not have the required admin role.</p>
          <p className="admin-user-line">
            Signed in as <strong>{user.email || "authenticated user"}</strong>
          </p>
          {roleError ? (
            <p className="admin-message" role="alert" data-kind="error">
              Your admin role could not be verified. Access remains safely blocked.
            </p>
          ) : null}
          <SignOutButton className="admin-secondary-button admin-access-sign-out" />
        </section>
      )}
    </PageShell>
  );
}
