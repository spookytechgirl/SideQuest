import Link from "next/link";
import BrandLink from "@/components/brand-link";
import PageShell from "@/components/page-shell";
import { SITE_URL } from "@/lib/social-metadata";

function StructuredData({ page }) {
  const url = `${SITE_URL}/${page.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: `${page.title} | SideQuest`,
        description: page.description,
        inLanguage: "en",
        isPartOf: {
          "@type": "WebSite",
          name: "SideQuest",
          url: SITE_URL,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: page.title,
            item: url,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default function SeoLandingPage({ page }) {
  const sectionPrefix = page.slug;

  return (
    <PageShell pageClassName="info-page seo-landing-page">
      <StructuredData page={page} />
      <BrandLink />

      <nav className="seo-breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{page.title}</span>
      </nav>

      <p className="eyebrow">{page.eyebrow}</p>
      <h1 id="page-title" className="info-page-title seo-landing-title">
        {page.heading.lead}
        <br />
        <span>{page.heading.accent}</span>
      </h1>
      <p className="intro info-page-intro seo-landing-intro">{page.intro}</p>

      <section
        className="info-surface seo-intent-surface scroll-reveal"
        aria-labelledby={`${sectionPrefix}-audience-title`}
      >
        <p className="info-kicker">{page.audience.kicker}</p>
        <h2 id={`${sectionPrefix}-audience-title`}>{page.audience.heading}</h2>
        {page.audience.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section
        className="seo-section seo-ideas-section"
        aria-labelledby={`${sectionPrefix}-ideas-title`}
      >
        <div className="seo-section-heading scroll-reveal">
          <p className="info-kicker">Try one of these</p>
          <h2 id={`${sectionPrefix}-ideas-title`}>Six quests with a clear first step.</h2>
          <p>
            Pick the idea that feels interesting enough—not the one that sounds
            most impressive.
          </p>
        </div>

        <div className="seo-idea-grid">
          {page.ideas.map((idea, index) => (
            <article
              className="seo-idea-card scroll-reveal"
              style={{ "--reveal-delay": `${Math.min(index * 55, 220)}ms` }}
              key={idea.title}
            >
              <div className="seo-idea-meta">
                <span className="seo-idea-symbol" aria-hidden="true">
                  {idea.symbol}
                </span>
                <span className="seo-idea-tag">{idea.tag}</span>
              </div>
              <h3>{idea.title}</h3>
              <p>{idea.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="seo-section seo-guide-section scroll-reveal"
        aria-labelledby={`${sectionPrefix}-guide-title`}
      >
        <div className="seo-guide-intro">
          <p className="info-kicker">{page.guide.kicker}</p>
          <h2 id={`${sectionPrefix}-guide-title`}>{page.guide.heading}</h2>
          <p>{page.guide.intro}</p>
        </div>
        <div className="seo-tip-grid">
          {page.guide.tips.map((tip, index) => (
            <article key={tip.title}>
              <span aria-hidden="true">0{index + 1}</span>
              <h3>{tip.title}</h3>
              <p>{tip.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="seo-cta scroll-reveal"
        aria-labelledby={`${sectionPrefix}-cta-title`}
      >
        <div>
          <p className="info-kicker">{page.cta.kicker}</p>
          <h2 id={`${sectionPrefix}-cta-title`}>{page.cta.heading}</h2>
          <p>{page.cta.description}</p>
        </div>
        <div className="seo-cta-actions">
          <Link className="quest-button" href="/">
            <span>{page.cta.primary}</span>
            <span className="button-arrow" aria-hidden="true">→</span>
          </Link>
          <Link className="admin-secondary-button" href="/quiz">
            {page.cta.secondary}
          </Link>
        </div>
      </section>

      <section
        className="seo-section seo-related-section"
        aria-labelledby={`${sectionPrefix}-related-title`}
      >
        <div className="seo-section-heading scroll-reveal">
          <p className="info-kicker">Keep exploring</p>
          <h2 id={`${sectionPrefix}-related-title`}>Choose another kind of quest.</h2>
        </div>
        <div className="seo-related-grid">
          {page.related.map((related) => (
            <article className="seo-related-card scroll-reveal" key={related.href}>
              <h3>
                <Link href={related.href}>{related.title}</Link>
              </h3>
              <p>{related.description}</p>
              <Link className="seo-related-link" href={related.href}>
                Explore this path <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
        <nav className="seo-resource-links" aria-label="More SideQuest resources">
          {page.resourceLinks.map((link) => (
            <Link href={link.href} key={link.href}>{link.label}</Link>
          ))}
        </nav>
      </section>

      <section
        className="seo-section seo-faq-section scroll-reveal"
        aria-labelledby={`${sectionPrefix}-faq-title`}
      >
        <div className="seo-section-heading">
          <p className="info-kicker">Good to know</p>
          <h2 id={`${sectionPrefix}-faq-title`}>Frequently asked questions.</h2>
        </div>
        <div className="seo-faq-list">
          {page.faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
