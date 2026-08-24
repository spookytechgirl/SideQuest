import BrandLink from "@/components/brand-link";
import PageShell from "@/components/page-shell";
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

const energyOptions = [
  ["low", "Low"],
  ["medium", "Medium"],
  ["high", "High"],
];

const moodOptions = [
  ["outside", "Get Outside"],
  ["create", "Make Something"],
  ["treat", "Treat Myself"],
  ["explore", "Explore"],
  ["relax", "Relax"],
  ["surprise", "Surprise Me"],
];

const timeOptions = [
  ["short", "Under 15 Minutes"],
  ["medium", "15–30 Minutes"],
  ["long", "I've Got Time"],
];

function QuizOptions({ name, options, className = "" }) {
  return (
    <div className={`quiz-options ${className}`.trim()}>
      {options.map(([value, label]) => (
        <label key={value}>
          <input type="radio" name={name} value={value} disabled />
          <span>{label}</span>
        </label>
      ))}
    </div>
  );
}

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

      <form className="sidequest-quiz" aria-describedby="quiz-phase-note">
        <fieldset>
          <legend>
            <span>1</span> Energy level
          </legend>
          <QuizOptions
            name="energy"
            options={energyOptions}
            className="quiz-options-three"
          />
        </fieldset>

        <fieldset>
          <legend>
            <span>2</span> What sounds good right now?
          </legend>
          <QuizOptions name="mood" options={moodOptions} />
        </fieldset>

        <fieldset>
          <legend>
            <span>3</span> How much time do you have?
          </legend>
          <QuizOptions
            name="time"
            options={timeOptions}
            className="quiz-options-three"
          />
        </fieldset>

        <button className="quiz-submit" type="submit" disabled>
          Find My SideQuest <span aria-hidden="true">→</span>
        </button>
      </form>

      <p className="phase-note" id="quiz-phase-note">
        Quiz matching will be enabled in Phase 3.
      </p>
      <p className="hint">No planning. No pressure. Just try something new.</p>
    </PageShell>
  );
}
