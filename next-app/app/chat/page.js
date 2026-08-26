import BrandLink from "@/components/brand-link";
import ChatExperience from "@/components/chat-experience";
import PageShell from "@/components/page-shell";
import PublicPageJsonLd from "@/components/public-page-json-ld";
import { createPublicMetadata } from "@/lib/social-metadata";

export const metadata = createPublicMetadata({
  title: "SideQuest Guide",
  description:
    "Chat with the SideQuest Guide for one friendly, realistic activity matched to your mood, energy, time, and interests.",
  path: "/chat",
});

export default function ChatPage() {
  return (
    <PageShell pageClassName="info-page chat-page">
      <PublicPageJsonLd
        path="/chat"
        title="SideQuest Guide | SideQuest"
        description="Chat with the SideQuest Guide for one friendly, realistic activity matched to your mood, energy, time, and interests."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "SideQuest Guide", path: "/chat" },
        ]}
      />
      <BrandLink />

      <p className="eyebrow">A friendly nudge toward something new</p>
      <h1 id="page-title" className="info-page-title chat-page-title">
        SideQuest
        <br />
        <span>Guide.</span>
      </h1>
      <p className="intro info-page-intro chat-page-intro">
        Share how you feel and what your day looks like. Your guide will suggest
        one achievable adventure without turning it into a whole production.
      </p>

      <ChatExperience />
    </PageShell>
  );
}
