import { SITE_URL } from "@/lib/social-metadata";

export function toAbsoluteUrl(path) {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

export function createWebsiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "SideQuest",
    description:
      "Small, realistic activities for making an ordinary day more interesting.",
    inLanguage: "en",
  };
}

export function createPageStructuredData({
  type = "WebPage",
  path,
  title,
  description,
  breadcrumbs = [],
}) {
  const url = toAbsoluteUrl(path);
  const graph = [
    {
      "@type": type,
      "@id": `${url}#webpage`,
      url,
      name: title,
      description,
      inLanguage: "en",
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
  ];

  if (breadcrumbs.length > 0) {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: toAbsoluteUrl(item.path),
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function appendFaqStructuredData(structuredData, faqs) {
  return {
    ...structuredData,
    "@graph": [
      ...structuredData["@graph"],
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
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
}

