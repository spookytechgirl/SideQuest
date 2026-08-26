import Link from "next/link";
import BrandLink from "@/components/brand-link";
import DatabaseQuestCard from "@/components/database-quest-card";
import JsonLd from "@/components/json-ld";
import PageShell from "@/components/page-shell";
import { getPublicQuests } from "@/lib/public-quests";
import { createPublicMetadata } from "@/lib/social-metadata";
import { createPageStructuredData } from "@/lib/structured-data";

const description =
  "Browse the live SideQuest catalog by category and effort, then open any quest for practical ways to make it your own.";

export const metadata = createPublicMetadata({
  title: "Quest Directory",
  description,
  path: "/quests",
});

export const dynamic = "force-dynamic";

export default async function QuestDirectoryPage() {
  let quests = [];
  let catalogAvailable = true;

  try {
    quests = await getPublicQuests();
  } catch {
    catalogAvailable = false;
  }

  return (
    <PageShell pageClassName="info-page quest-directory-page">
      <JsonLd
        data={createPageStructuredData({
          type: "CollectionPage",
          path: "/quests",
          title: "Quest Directory | SideQuest",
          description,
          breadcrumbs: [
            { name: "Home", path: "/" },
            { name: "Quest Directory", path: "/quests" },
          ],
        })}
      />
      <BrandLink />

      <nav className="seo-breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Quest Directory</span>
      </nav>

      <p className="eyebrow">The live adventure catalog</p>
      <h1 id="page-title" className="info-page-title quest-directory-title">
        Quest
        <br />
        <span>Directory.</span>
      </h1>
      <p className="intro info-page-intro quest-directory-intro">{description}</p>

      <section className="quest-directory-section" aria-labelledby="quest-catalog-title">
        <div className="quest-directory-heading scroll-reveal">
          <div>
            <p className="info-kicker">Choose a starting point</p>
            <h2 id="quest-catalog-title">Small adventures from the SideQuest catalog.</h2>
          </div>
          {catalogAvailable && (
            <p className="quest-directory-count" role="status">
              {quests.length} {quests.length === 1 ? "quest" : "quests"}
            </p>
          )}
        </div>

        {catalogAvailable && quests.length > 0 ? (
          <div className="database-quest-grid">
            {quests.map((quest) => (
              <DatabaseQuestCard quest={quest} key={quest.id} />
            ))}
          </div>
        ) : (
          <div className="info-surface catalog-state" role="status">
            <p className="info-kicker">The trail is quiet</p>
            <h2>{catalogAvailable ? "No catalog quests are available yet." : "The quest catalog is temporarily unavailable."}</h2>
            <p>
              You can still generate a quest or use the quick quiz while the live
              directory is unavailable.
            </p>
          </div>
        )}
      </section>

      <section className="quest-directory-next scroll-reveal" aria-labelledby="quest-directory-next-title">
        <div>
          <p className="info-kicker">Prefer a little help choosing?</p>
          <h2 id="quest-directory-next-title">Use chance, context, or a curated collection.</h2>
          <p>Every path leads back to one realistic next step.</p>
        </div>
        <div className="content-next-actions">
          <Link className="quest-button" href="/">
            <span>Generate a SideQuest</span>
            <span className="button-arrow" aria-hidden="true">→</span>
          </Link>
          <Link className="admin-secondary-button" href="/quiz">Find My Quest</Link>
          <Link className="admin-secondary-button" href="/ideas">Browse SideQuest Ideas</Link>
        </div>
      </section>
    </PageShell>
  );
}

