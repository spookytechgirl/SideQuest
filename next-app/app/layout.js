import { DM_Sans, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import RevealEffects from "@/components/reveal-effects";
import { ToastProvider } from "@/components/toast-provider";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://sidequest-next-preview.vercel.app"),
  title: {
    default: "SideQuest | Find Your Next Adventure",
    template: "%s | SideQuest",
  },
  description:
    "SideQuest offers simple, low-pressure ideas for making an ordinary day more interesting.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    siteName: "SideQuest",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SideQuest — Small adventures count.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const themeScript = `
  (() => {
    const storageKey = "sidequest-theme";
    let theme;

    try {
      const savedTheme = window.localStorage.getItem(storageKey);
      theme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : null;
    } catch {
      theme = null;
    }

    if (!theme) {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  })();
`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${manrope.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body>
        <Script id="sidequest-theme" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <ToastProvider>{children}</ToastProvider>
        <RevealEffects />
        <Analytics />
      </body>
    </html>
  );
}
