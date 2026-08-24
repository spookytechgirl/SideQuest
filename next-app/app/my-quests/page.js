import BrandLink from "@/components/brand-link";
import MyQuestsDashboard from "@/components/my-quests-dashboard";
import PageShell from "@/components/page-shell";
import { requireUser } from "@/lib/auth";
import { createPrivateMetadata } from "@/lib/social-metadata";

export const metadata = createPrivateMetadata({
  title: "My Quests",
  description: "Create and manage the custom SideQuests that belong to your account.",
  path: "/my-quests",
});

export const dynamic = "force-dynamic";

export default async function MyQuestsPage() {
  const { supabase, user } = await requireUser("/my-quests");
  const { data, error } = await supabase
    .from("user_quests")
    .select("id, user_id, quest_text, category, effort, created_at, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return (
    <PageShell shellClassName="my-quests-shell" pageClassName="my-quests-page">
      <BrandLink />

      <p className="eyebrow">Your ideas, your trail</p>
      <h1 id="page-title" className="info-page-title my-quests-title">
        My<br /><span>Quests.</span>
      </h1>
      <p className="intro my-quests-intro">
        Create the little adventures you want to find again.
      </p>

      <MyQuestsDashboard
        initialError={error ? "Your quests could not be loaded. Please try again." : ""}
        initialQuests={data || []}
        userEmail={user.email || ""}
        userId={user.id}
      />
    </PageShell>
  );
}
