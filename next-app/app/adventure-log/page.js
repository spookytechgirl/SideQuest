import AdventureLogView from "@/components/adventure-log-view";
import BrandLink from "@/components/brand-link";
import PageShell from "@/components/page-shell";

export const metadata = {
  title: "Adventure Log",
  description: "Review your five most recent SideQuest adventures.",
  alternates: { canonical: "/adventure-log" },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Adventure Log | SideQuest",
    description: "Review your five most recent SideQuest adventures.",
    url: "/adventure-log",
  },
};

export default function AdventureLogPage() {
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
