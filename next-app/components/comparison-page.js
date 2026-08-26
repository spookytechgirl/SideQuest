import Link from "next/link";
import BrandLink from "@/components/brand-link";
import DatabaseQuestCard from "@/components/database-quest-card";
import JsonLd from "@/components/json-ld";
import PageShell from "@/components/page-shell";
import { createPageStructuredData } from "@/lib/structured-data";

function ComparisonColumn({ side, examples }) {
  return (
    <article className="comparison-column">
      <span className="comparison-symbol" aria-hidden="true">{side.symbol}</span>
      <h2>{side.title}</h2>
      <p className="comparison-summary">{side.summary}</p>
      <dl className="comparison-details">
        {side.dimensions.map((dimension) => (
          <div key={dimension.label}>
            <dt>{dimension.label}</dt>
            <dd>{dimension.value}</dd>
          </div>
        ))}
      </dl>
      <div className="comparison-examples">
        <h3>Examples from the quest catalog</h3>
        {examples.length > 0 ? (
          examples.map((quest) => (
            <DatabaseQuestCard quest={quest} headingLevel="h4" key={quest.id} />
          ))
        ) : (
          <p className="catalog-unavailable">
            Catalog examples are temporarily unavailable. The comparison guide
            still works, and the directory will return when the database is reachable.
          </p>
        )}
      </div>
    </article>
  );
}

export default function ComparisonPage({ config, leftExamples, rightExamples }) {
  const path = `/compare/${config.slug}`;

  return (
    <PageShell pageClassName="info-page comparison-page">
      <JsonLd
        data={createPageStructuredData({
          path,
          title: `${config.title} | SideQuest`,
          description: config.description,
          breadcrumbs: [
            { name: "Home", path: "/" },
            { name: "SideQuest Ideas", path: "/ideas" },
            { name: config.title, path },
          ],
        })}
      />
      <BrandLink />

      <nav className="seo-breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/ideas">Ideas</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{config.title}</span>
      </nav>

      <p className="eyebrow">{config.eyebrow}</p>
      <h1 id="page-title" className="info-page-title comparison-title">
        {config.heading.lead}
        <br />
        <span>{config.heading.accent}</span>
      </h1>
      <p className="intro info-page-intro comparison-intro">{config.intro}</p>

      <section className="comparison-grid" aria-label={config.title}>
        <ComparisonColumn side={config.left} examples={leftExamples} />
        <ComparisonColumn side={config.right} examples={rightExamples} />
      </section>

      <section className="comparison-guidance scroll-reveal" aria-labelledby={`${config.slug}-choose-title`}>
        <div>
          <p className="info-kicker">How to choose</p>
          <h2 id={`${config.slug}-choose-title`}>Follow the option that removes the most friction.</h2>
        </div>
        <ul>
          {config.guidance.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section className="comparison-next scroll-reveal" aria-labelledby={`${config.slug}-next-title`}>
        <div>
          <p className="info-kicker">Pick a practical next step</p>
          <h2 id={`${config.slug}-next-title`}>Turn the comparison into one small adventure.</h2>
          <p>Browse the live catalog, let the generator surprise you, or match a quest to your current mood and energy.</p>
        </div>
        <div className="content-next-actions">
          <Link className="quest-button" href="/">
            <span>Generate a SideQuest</span>
            <span className="button-arrow" aria-hidden="true">→</span>
          </Link>
          <Link className="admin-secondary-button" href="/quiz">Find My Quest</Link>
          <Link className="admin-secondary-button" href="/quests">Browse Quest Directory</Link>
        </div>
        <nav className="comparison-related-links" aria-label="Related SideQuest guides">
          {config.relatedLinks.map((link) => (
            <Link href={link.href} key={link.href}>{link.label}</Link>
          ))}
        </nav>
      </section>
    </PageShell>
  );
}
