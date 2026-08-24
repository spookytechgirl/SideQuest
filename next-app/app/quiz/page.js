import BrandLink from "@/components/brand-link";
import PageShell from "@/components/page-shell";
import QuizExperience from "@/components/quiz-experience";
import { openGraphImage, twitterImage } from "@/lib/social-metadata";

export const metadata = {
  title: "Quick Vibe Check",
  description:
    "Find a personalized SideQuest with a quick three-question vibe check.",
  alternates: { canonical: "/quiz" },
  openGraph: {
    title: "Quick Vibe Check | SideQuest",
    description:
      "Find a personalized SideQuest with a quick three-question vibe check.",
    url: "/quiz",
    images: [openGraphImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quick Vibe Check | SideQuest",
    description:
      "Find a personalized SideQuest with a quick three-question vibe check.",
    images: [twitterImage],
  },
};

export default function QuizPage() {
  return (
    <PageShell shellClassName="quiz-page-shell" pageClassName="quiz-page">
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
