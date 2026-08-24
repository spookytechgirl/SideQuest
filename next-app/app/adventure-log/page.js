import AdventureLogView from "@/components/adventure-log-view";
import BrandLink from "@/components/brand-link";
import PageShell from "@/components/page-shell";
import { requireUser } from "@/lib/auth";
import { createPrivateMetadata } from "@/lib/social-metadata";

export const metadata = createPrivateMetadata({
  title: "Adventure Log",
  description: "Review your five most recent SideQuest adventures.",
  path: "/adventure-log",
});

export default async function AdventureLogPage() {
  await requireUser("/adventure-log");

  return (
    <PageShell shellClassName="adventure-log-shell" pageClassName="adventure-log-page">
      <BrandLink />

      <p className="eyebrow">Your adventure log</p>
      <h1 id="page-title" className="adventure-log-title">
        Recent
        <br />
        <span>SideQuests.</span>
      </h1>
      <p className="intro adventure-log-intro">
        A look back at the little adventures that found you.
      </p>

      <AdventureLogView />
    </PageShell>
  );
}
