import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import BrandLink from "@/components/brand-link";
import DatabaseQuestCard from "@/components/database-quest-card";
import JsonLd from "@/components/json-ld";
import PageShell from "@/components/page-shell";
import {
  getPublicQuestById,
  getQuestPath,
  getQuestRouteSegment,
  getRelatedPublicQuests,
  parseQuestRouteSegment,
} from "@/lib/public-quests";
import { categoryGuidance, effortGuidance } from "@/lib/quest-page-content";
import { createPublicMetadata } from "@/lib/social-metadata";
import { createPageStructuredData } from "@/lib/structured-data";

export const dynamic = "force-dynamic";

async function loadQuest(segment) {
  const route = parseQuestRouteSegment(segment);

  if (!route) {
    notFound();
  }

  const quest = await getPublicQuestById(route.id);

  if (!quest) {
    notFound();
  }

  return quest;
}

function createQuestDescription(quest) {
  const description = `${quest.quest_text} Explore why this ${quest.category} SideQuest is worth trying and how to adapt its ${quest.effort} effort level.`;
  return description.length <= 158
    ? description
    : `${description.slice(0, 155).trimEnd()}…`;
}

export async function generateMetadata({ params }) {
  const { quest: segment } = await params;
  const quest = await loadQuest(segment);
  const path = getQuestPath(quest);

  return createPublicMetadata({
    title: quest.quest_text,
    description: createQuestDescription(quest),
    path,
  });
}

export default async function QuestPage({ params }) {
  const { quest: segment } = await params;
  const quest = await loadQuest(segment);
  const canonicalSegment = getQuestRouteSegment(quest);

  if (segment !== canonicalSegment) {
    permanentRedirect(getQuestPath(quest));
  }

  let relatedQuests = [];

  try {
    relatedQuests = await getRelatedPublicQuests(quest);
  } catch {
    relatedQuests = [];
  }

  const path = getQuestPath(quest);
  const description = createQuestDescription(quest);

  return (
    <PageShell pageClassName="info-page database-quest-page">
      <JsonLd
        data={createPageStructuredData({
          path,
          title: `${quest.quest_text} | SideQuest`,
          description,
          breadcrumbs: [
            { name: "Home", path: "/" },
            { name: "Quest Directory", path: "/quests" },
            { name: quest.quest_text, path },
          ],
        })}
      />
      <BrandLink />

      <nav className="seo-breadcrumbs quest-breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/quests">Quests</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Quest {quest.id}</span>
      </nav>

      <p className="eyebrow">A quest from the live catalog</p>
      <div className="database-quest-hero">
        <div className="database-quest-meta" aria-label="Quest details">
          <span>{quest.category}</span>
          <span>{quest.effort}</span>
        </div>
        <h1 id="page-title" className="database-quest-title">{quest.quest_text}</h1>
        <p className="intro database-quest-intro">
          Treat this as a prompt, not a rulebook. Keep the interesting part and
          adapt everything else to your time, energy, and surroundings.
        </p>
      </div>

      <div className="quest-guidance-grid">
        <section className="info-surface scroll-reveal" aria-labelledby="why-try-title">
          <p className="info-kicker">Why try this quest?</p>
          <h2 id="why-try-title">Give the day one clear point of curiosity.</h2>
          <p>{categoryGuidance[quest.category].why}</p>
        </section>

        <section className="info-surface scroll-reveal" aria-labelledby="make-own-title">
          <p className="info-kicker">Make it your own</p>
          <h2 id="make-own-title">Adjust the prompt without losing its spirit.</h2>
          <p>{categoryGuidance[quest.category].customize}</p>
        </section>
      </div>

      <section className="quest-effort-guide scroll-reveal" aria-labelledby="effort-guide-title">
        <div>
          <p className="info-kicker">{quest.effort} effort</p>
          <h2 id="effort-guide-title">Set a pace that works in real life.</h2>
        </div>
        <p>{effortGuidance[quest.effort]}</p>
      </section>

      {relatedQuests.length > 0 && (
        <section className="related-database-quests" aria-labelledby="related-quests-title">
          <div className="quest-directory-heading scroll-reveal">
            <div>
              <p className="info-kicker">Keep exploring</p>
              <h2 id="related-quests-title">Related quests from the catalog.</h2>
            </div>
            <Link href="/quests">View all quests</Link>
          </div>
          <div className="database-quest-grid related-quest-grid">
            {relatedQuests.map((relatedQuest) => (
              <DatabaseQuestCard quest={relatedQuest} key={relatedQuest.id} />
            ))}
          </div>
        </section>
      )}

      <section className="quest-directory-next scroll-reveal" aria-labelledby="quest-page-next-title">
        <div>
          <p className="info-kicker">Try another direction</p>
          <h2 id="quest-page-next-title">Let chance choose—or match the moment.</h2>
          <p>Generate a fresh prompt or use the quiz to narrow the catalog by how today feels.</p>
        </div>
        <div className="content-next-actions">
          <Link className="quest-button" href="/">
            <span>Generate Another SideQuest</span>
            <span className="button-arrow" aria-hidden="true">→</span>
          </Link>
          <Link className="admin-secondary-button" href="/quiz">Find My Quest</Link>
          <Link className="admin-secondary-button" href="/ideas">Browse SideQuest Ideas</Link>
        </div>
      </section>
    </PageShell>
  );
}

