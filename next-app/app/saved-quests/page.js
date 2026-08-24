import BrandLink from "@/components/brand-link";
import PageShell from "@/components/page-shell";
import SavedQuestsView from "@/components/saved-quests-view";
import { requireUser } from "@/lib/auth";
import { createPrivateMetadata } from "@/lib/social-metadata";

export const metadata = createPrivateMetadata({
  title: "Saved Quests",
  description: "Review the SideQuests you saved for later.",
  path: "/saved-quests",
});

export default async function SavedQuestsPage() {
  await requireUser("/saved-quests");

  return (
    <PageShell shellClassName="saved-quests-shell" pageClassName="saved-quests-page">
      <BrandLink />

      <p className="eyebrow">Keepers for later</p>
      <h1 id="page-title" className="saved-quests-title">
        Saved
        <br />
        <span>SideQuests.</span>
      </h1>
      <p className="intro saved-quests-intro">
        The little adventures you wanted to hold onto.
      </p>

      <SavedQuestsView />
    </PageShell>
  );
}
