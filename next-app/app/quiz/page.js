import BrandLink from "@/components/brand-link";
import PageShell from "@/components/page-shell";
import PublicPageJsonLd from "@/components/public-page-json-ld";
import QuizExperience from "@/components/quiz-experience";
import { createPublicMetadata } from "@/lib/social-metadata";

export const metadata = createPublicMetadata({
  title: "Quick Vibe Check",
  description:
    "Find a personalized SideQuest with a quick three-question vibe check.",
  path: "/quiz",
});

export default function QuizPage() {
  return (
    <PageShell shellClassName="quiz-page-shell" pageClassName="quiz-page">
      <PublicPageJsonLd
        path="/quiz"
        title="Quick Vibe Check | SideQuest"
        description="Find a personalized SideQuest with a quick three-question vibe check."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Find My Quest", path: "/quiz" },
        ]}
      />
      <BrandLink />

      <p className="eyebrow">Quick vibe check</p>
      <h1 id="page-title" className="quiz-page-title">
        What Kind of
        <br />
        <span>SideQuest</span> Do You Need?
      </h1>
      <p className="intro quiz-page-intro">
        Three quick questions. One little adventure picked for your current mood.
      </p>

      <QuizExperience />
      <p className="hint">No planning. No pressure. Just try something new.</p>
    </PageShell>
  );
}
