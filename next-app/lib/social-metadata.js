export const openGraphImage = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "SideQuest — Small adventures count.",
};

export const twitterImage = "/og-image.png";

export const SITE_URL = "https://side-quest-ochre.vercel.app";

export function createPublicMetadata({
  title,
  absoluteTitle,
  description,
  path,
}) {
  const socialTitle = absoluteTitle || `${title} | SideQuest`;

  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    alternates: { canonical: path },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: "SideQuest",
      title: socialTitle,
      description,
      url: path,
      images: [openGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [twitterImage],
    },
  };
}

export function createPrivateMetadata({ title, description, path }) {
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: { index: false, follow: false },
    openGraph: {
      type: "website",
      siteName: "SideQuest",
      title: `${title} | SideQuest`,
      description,
      url: path,
      images: [],
    },
    twitter: {
      card: "summary",
      title: `${title} | SideQuest`,
      description,
      images: [],
    },
  };
}
