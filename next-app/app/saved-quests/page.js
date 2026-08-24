import BrandLink from "@/components/brand-link";
import PageShell from "@/components/page-shell";
import SavedQuestsView from "@/components/saved-quests-view";

export const metadata = {
  title: "Saved Quests",
  description: "Review the SideQuests you saved for later.",
  alternates: { canonical: "/saved-quests" },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Saved Quests | SideQuest",
    description: "Review the SideQuests you saved for later.",
    url: "/saved-quests",
  },
};

export default function SavedQuestsPage() {
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
